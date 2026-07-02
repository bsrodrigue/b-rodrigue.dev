---
title: "Case Study: Modular Data Collection System"
metaTitle: "MDCS"
metaDesc: "Modular Data Collection System - "
date: "2026-07-01"
category: essay
tags:
  - case-study, django, python, coding, software design
---
# The Rationale

At my job at DISCOM, I had the main responsibility to design and build a data collecting and analysis platform for the cotton industry in Burkina Faso. Our customer (AICB), used to hand out word and excel documents to the different organisms to be filled manually and gathered back for synthesis.

This process was slow and error prone. The platform I was going to build would make everybody life's easier. The agents from different organisms would just have to log in, and fill centralized digital forms with progress tracking and validation, making it impossible to miss fields, lose progress and enter invalid data. Our customer could then query the data in an aggregated form and visualize it and generate reports that can be used for intelligence and better decision making.

The core architecture is quite simple to understand:
- Data collection
- Aggregation & Synthesis
- Monitoring Dashboard

I voluntarily omitted additional components like: auditing, configuration, etc. Because I wanted to focus on one of the most important parts of the system: Data collection.

The platform would be very simple to design and build if we only had to create a few forms to be filled by the different organisms. But it turned out to be a bit tricky.

Each organism is part of an organism type, and each type of organism must fill different forms without seeing or being able to modify the submissions of other parties. The entire set of forms that must be filled by an organism must be filled every year during periods called *campaigns*. We have an overall of hundred forms and some are more complex than others. Some are just basic fields, others require to select data directly tied to database entries, and some cannot even be filled manually and require bulk ingestion. 

I wrote this piece of article with the motivation of documenting my design choices and the engineering challenges I've faced.

# Constraints & Decisions

## Server Setup

We run the platform on a Debian server with the following specs:
- CPU: Intel Core (Haswell, no TSX) at 2.99 GHz and 4 cores
- RAM: 8GB
- Storage: 74GiB of HDD

This setup is quite modest, but the goal is to make a quality platform for a small amount of users with a limited budget. This sounds feasible to me if we make the right decisions. The scarcest resource we have here is RAM and especially storage space.

## Technological Stack

- Django
- Redis
- Celery
- Prometheus
- Loki
- Grafana
- PostgreSQL
- Docker


The platform is not designed for massive usage at scale, it is no social media with thousands of interactions per short amount of time. Rather it is a professional platform designed only for a few stakeholders that will use it to collect data and generate statistics and reports occasionally. Which means that using React and Django is not a bad choice, especially if we want to leverage the dynamic nature of Django and *python magic*

## Design & Implementation

Before diving into the design, let's try to visualize the actual usage pattern.

Among the *organisms*, that is, those who will fill the forms, we have cotton societies: SOFITEX, FASO COTON and SOCOMA. 
They could each access the platform through 10 representative users, called *agents*.
We also have special organisms like FILSAH, SECOBIO, UNPCB, TRITURATION and INERA, that could also have 10 users each (even though they will be less numerous in practice). 
Which gives us a safe upper bound of 80 concurrent users on the data collection side. As for the analytics and administration side, we can safely assume it will have at most 10 concurrent users too, but let's round up to 20 in order to prepare the platform for 100 concurrent users.

8GB of RAM and 4 cores at roughly 3 GHz for 100 concurrent users sounds more than enough. The platform is closed by default and requires authentication. Rate limiting can also protect the server. 

Regarding the usage pattern, the vast majority of users will be agents that will fill in forms in random fashion. They can log in every day to make small progress, they can also log in a few times to fill lots of data, who knows. They can also log in to review already provided data and make corrections. It is up the agents of the same organisms to find a work schedule and organization that suits them best. The heaviest operation will be csv uploading and ingestion. Each agent of cotton society and SECOBIO will eventually upload large csv files multiple times. Which means we have a write heavy application in terms of sheer amount of data. Not only to mention that data from previous campaigns (before the development of the platform) will have to be imported in the platform, which means, the platform must support archive data imports.

### Implementation - Modular Record System

I decided to design the solution around the concept of *records*.

A form to be filled is called *record*, and there are three types of records:
- The *SingleEntryRecord*: A few form fields to fill per record.
- The *TabularRecord*: The same form fields to fill per selected interest point, for instance, providing information about each type of tool used in cotton production.
- The *GranularRecord*: A large quantity of data related to a particular item (farmer, group of farmers) that cannot possibly be filled out manually.

Each record type is represented by a dedicated django model class inheriting from *BaseRecord*

```python

class BaseRecord(TimestampedModel):
    """
    Base class for all records records.
    Links to a CampaignRecordSubmission.
    """

    submission: models.ForeignKey[
        CampaignRecordSubmission, CampaignRecordSubmission
    ] = models.ForeignKey(
        CampaignRecordSubmission,
        on_delete=models.CASCADE,
        related_name="%(class)s",
        verbose_name="Soumission",
    )
    submission_id: int

    class Meta:
        abstract = True
        ordering = ["pk"]
        


class SingleEntryRecord(BaseRecord):
    """
    Pattern for forms that contain exactly one set of data per submission.
    Example: Global campaign financial summary.
    """

    RECORD_TYPE = RecordType.SINGLE

    class Meta(BaseRecord.Meta):
        abstract = True
        constraints = [
            models.UniqueConstraint(
                fields=["submission"],
                name="unique_%(class)s_per_submission",
            )
        ]

### The rest goes here...

```

This pattern allows us to create models of each record type and use *meta-programming* to dynamically add behavior we would manually code:

```python

class ConcreteSingleEntryRecord(SingleEntryRecord):
	# Add your regular django fields
	pass

```

Next, we create a python object that acts as a dynamic registry that will expose these records to consumers:

```python
# This registry item can then be consumed by third parties

 RecordForm(
	id="primary_input_needs",
	label="Expression des besoins primaires en intrants",
	model_class=ExpressionOfPrimaryInputNeedRecord,
	serializer_class=ExpressionOfPrimaryInputNeedSerializer,
	endpoint="/api/records/inputs/primary/",
	record_type=RecordType.GRANULAR,
	linkage_mode=LinkageMode.SCOOP,
	dynamic_options_endpoints={"input_type": "input-types/"},
	idempotency_keys=[
		"cotton_campaign",
		"scoop",
	],
),
```

The key idea is to find a smart and standardized way to create records in order to avoid code duplication. The registry can then be consumed by the React front-end in order to dynamically create and render the forms. The registry exposes the shape of each record, the form filling pattern (singular, tabular, granular), the endpoint to call to submit and query them, etc. This allows us to have a modular form exposing system that allows third parties like front-ends, to represent the forms as they wish.

We currently have roughly 100 records and total, most of the records (80%) are for the cotton societies and a special cotton society called SECOBIO. We have 24 Granular Records among them. 

This design works perfectly and scales well, adding a new form is equivalent to creating a django model and adding it to the register. The front-end will pick it up and render it and handle form validation and submission. It is also possible to introduce new record types.

But this is not where the complexity ends, we have now to consider the csv ingestion problem.

### Implementation CSV Ingestion Pipeline

This wasn't the most complex aspect of the system, but it still had interesting problems. As someone that loves reasoning about performance, this was probably my favorite technical challenge.

The need for a csv ingestion pipeline comes from the fact that some data is way to numerous to be filled in manually, we needed an interface to allow the agents to upload files in a requested format and then load them into our database.

The flow is as follows:
- Agent picks a csv file and submits to the *Granular Form*.
- Server receives the file and streams it in memory.
- Server parses the contents and validates each row (only simple data type checking).
- Servers creates batches and submits them for bulk upserts in the database.

The platform doesn't need to be a hyper performing ingestion engine, capable of processing millions of rows in a few seconds, but we still need to keep reasonable throughput, especially as we use slow languages like python.

Here is an example measurement of one of our first ingestion processes we had with 20 K chunk size:

| Metric                               |                     Value |
| ------------------------------------ | ------------------------: |
| Rows processed                       |                    16,581 |
| Chunk size                           |                    20,000 |
| CSV scan                             |                   61.5 ms |
| Data preload                         |                  134.9 ms |
| Parsing                              |                   84.8 ms |
| Database save                        |               11,071.6 ms |
| Processing phase (excluding preload) |               11,293.6 ms |
| **Total pipeline time**              | **11,490.1 ms (11.49 s)** |

Loading a csv file in memory with almost 17 thousand rows took 60 ms, we also did some prefetching to gather foreign keys in order to avoid frequent DB lookups. Parsing the file took 85 ms. The largest amount of time was spent loading the data in the database, roughly 12 seconds. 

To put things into perspective, an optimized C parser with SIMD can parse 10 MB of csv in less than 5 ms. The file from the previous table was less than 1 MB. This shows that despite python being terribly slow, the real bottleneck remains our database logic. It is therefore clear that we should focus on how we talk to the database.

> **Observation** 
> This is a compelling reason to always measure before you try any sort of optimization. Never try to guess and outsmart the machine. Put some logs here and there, measure and compare. You'll be surprised by how little you know about how things really work.

We use PostgreSQL as our primary data store. It is not a slow database by any means, it is fully capable of dealing with massive data at scale, we have to investigate how we actually use it.

Let's first think about an elephant in the room: *indexes*. 
They can considerably speed up your reads, and they can also nuke your write performances if used wrong. Should we get rid of indexes? I'd say that we should keep them and be wary of how we use them. As a reminder, the platform is both a data collection system and an analytics provider. Storing data is not the only problem, we need to quickly query big loads of data across years with a low budget server and simple architecture.

SOFITEX has today registered very roughly 7 K farmer cooperatives and 200 K farmers. Only a single record tracks data per farmer, and the other granular records track data per cooperative and some other data that can multiply the total rows.

Campaigns can go back to the year 1950 up till today, and our platform should be good enough to be used in the future. If we assume we are in 2030: 80 years x 170.000 rows = 13.600.000 rows! 

Now let's take 20 records for the cooperatives: 20 x 7.000 x 80 = 11.200.000 rows! (We even omitted the multiplicative effect of some records)

SOFITEX by itself could potentially take several millions of row space in the database. We can safely assume that the platform will at production eventually host 50 millions or more rows. Giving up on *indexes* would be shooting ourselves in the foot. A cache-only solution would also bite too much on our RAM. Let's find other solutions.

What about latency? All our services live in containers on the same cloud machine. We also don't use row by row inserts, which would be exponentially slower, instead, we use bulk upserts provided by our Django ORM.

Why *UPSERT* in particular? Let's first define what it is. It doesn't have a special keyword in SQL (at least in PostgreSQL), it is just a like a regular *INSERT* with a fallback strategy consisting in updating fields instead if we happen to trigger a *Unique Constraint* error. In other terms, when you try to create an item that already exists, you can choose to instead update some fields, and you can do this in a single batch in an *atomic* fashion.

The base syntax in PostgreSQL is as follows:

```sql
INSERT ... ON CONFLICT DO UPDATE
```

This feature supports many more strategies to deal with conflicts, but this flexibility is not free. It mixes the cost of a regular *INSERT* with additional overhead for handling conflict resolution. If your payload contains a lot of conflicts, it can be penalizing, can we design our application in a way to avoid conflicting data in the first place?

Imagine an agent from a cotton society uploads a csv file with millions of rows for the first time on the platform. No conflicts. Now let's say that a colleague from the same organism logs in to provide additional entries to the aforementioned set of data. Should he delete the entire uploaded set? Or should he be able to just upload whatever new items he wants? Of course, the latter is optimal for better UX. Also consider the situation where agents happen to gather new fresh data.
It means we need a way to handle duplicate entries as conflicts cannot be avoided easily. It follows then, that using *upserts* is a good decision here and should not be optimized away.

What else can we look after to squeeze out more performance? The size of our SQL payloads maybe?

Even if we assume the raw csv data to have a small byte size, we must not forget that this data has to be formatted and sent along SQL statement. This mix can drastically increase the size of the final payload being sent to the database to be parsed. 
In a setting where the bandwidth is scarce, this can incur extra-latency along with the parsing.

The total size of the SQL sent for our previous data set is *1412910 bytes* -> *1.41291 MB*. Yet, the original size of the csv file was roughly *350 KB*. Formatting our raw data into a bulk upsert made the original byte size grow by a factor of *4x*. What if we send a *5 MB* csv file? Our measurement gave use *15 MB*! 

All this SQL must be parsed, planned and then executed. which adds overhead. A good starting point is to leverage the *batch_size* with Django ORM's bulk insert to let PostgreSQL spend less time parsing before executing actual inserts.
Here are the results for the same data set and *5000 batch_size*:

| Metric                               |                   Value |
| ------------------------------------ | ----------------------: |
| Batch size                           |                    5000 |
| Rows processed                       |                  16,581 |
| Chunk size                           |                  20,000 |
| CSV scan                             |                 32.3 ms |
| Data preload                         |                 69.7 ms |
| Parsing                              |                143.1 ms |
| Database save                        |              4,172.5 ms |
| Processing phase (excluding preload) |              4,409.0 ms |
| **Total pipeline time**              | **4,478.7 ms (4.48 s)** |

We went from *11.5 s to 4.5 s* which is a huge gain! The larger data set of 170 K rows completed in *33 seconds*. Is it fast enough now? Remember that the platform is designed for 100 concurrent users. Most of them will be filling forms, and only a quarter of them require csv uploading. At minimum, we will have roughly *25 x 4 = 100* csv uploads assuming no errors and re-uploads will occur. The aforementioned 170 K rows come from an actual real potential data set from the biggest cotton society, which means that a single csv upload won't take more than a minute for sure. Furthermore, the agent can scroll past the ongoing uploading and take care of other forms (and upload other files). The async nature makes the waiting bearable, especially when they have an entire year to collect their own data and fill our forms.

Now we have to consider the UX when multiple agents are using our platform concurrently.

### Implementation - Concurrency model

Despite the low user count, we have to be wary of the large quantity of data that can be produced over time and put a strain on the database. The heaviest write operation is directly related to how the granular records work: the user uploads a csv file and the server asynchronously processes it.

We use Celery with Redis for async work and must guarantee a good experience for a worst case 4 x 24 = 96 concurrent uploads. At baseline, a celery worker in prefork mode takes us 200MB at rest. It would cost us  200MB x 100 = 20GB of RAM to have 100 ready workers, which is insane and unsustainable. It would be better to have cheaper workers, and given that our task is IO bound, we've opted for thread based workers.

How does multi-threading perform in python?
First, let's consider what it implies. Python is subject to something called the GIL (Global Interpreter Lock) that prevents multiple thread from running python byte-code in parallel. When one thread is running, the others have to wait their turn. Which means that for a purely CPU-bound workload, you get no performance improvement. But there is an important detail: when one of the thread is blocking on IO, other threads can run, in other terms, multi-threading comes handy with code that blocks often on IO operations (like dealing with databases) This enables concurrency in exchange of thread context switching overhead. 

Why not async? Our celery workers rely on Django, a framework mainly built with synchronous capabilities, and we want to keep things as simple as possible.

In order to support 100 concurrent processing, let's consider what it implies. It starts with 100 POST requests to upload the csv files. We need enough gunicorn workers to handle them. We can create 4 gthread workers that will each spawn 25 threads. This will make a total of 100 threads to handle the requests concurrently. Given that uploading (and the usual workload) is IO bound, all the threads will very likely have equal chance to run. 

Our largest csv test file is roughly 5MB with overall 200k rows, which reflects the largest set of data among the cotton societies. For better safety, we will cap the file-size to 10MB. If 100 concurrent uploads happen, it means, parsing all the files without streaming will load 100 x 10MB = 1GB in memory, which is not optimal, we will of course stream.










