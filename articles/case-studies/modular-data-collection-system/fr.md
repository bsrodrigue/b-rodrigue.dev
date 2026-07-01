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


class TabularRecord(BaseRecord):
    """
    Pattern for forms that contain multiple entries per submission,
    discriminated by a specific item type (e.g. InputType, CottonVariety).
    Supports multi-item input via API.
    """

    RECORD_TYPE = RecordType.TABULAR

    # The field name used to discriminate entries (e.g., 'input_type')
    # MUST be defined in concrete subclasses.
    ITEM_FIELD: str

    class Meta(BaseRecord.Meta):
        abstract = True


class GranularRecord(BaseRecord):
    """
    Pattern for forms that contain thousands of entries (one per SCOOP or Producer).
    Always supports CSV upload via Viewflow.
    """

    RECORD_TYPE = RecordType.GRANULAR

    # The linkage mode for this granular record.
    # MUST be defined in concrete subclasses.
    LINKAGE_MODE: LinkageMode

    class Meta(BaseRecord.Meta):
        abstract = True



```

This pattern allows us to create models of each record type and use *meta-programming* to dynamically add behavior we would manually code:

```python

class ProductionObjectiveRecord(SingleEntryRecord):
    """
    Objectifs de production.
    Fiche 03 - 6.3
    """

    planned_area_ha: models.DecimalField[Decimal, Decimal] = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal("0.00"),
        verbose_name="Superficie prévue (ha)",
    )

    objective_production_tons: models.DecimalField[Decimal, Decimal] = (
        models.DecimalField(
            max_digits=15,
            decimal_places=2,
            default=Decimal("0.00"),
            verbose_name="Objectif de production (tonnes)",
        )
    )

    comment: models.TextField[str, str] = models.TextField(
        blank=True, default="", verbose_name="Commentaire"
    )

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

Despite the low user count, we have to be wary of the large quantity of data that can be produced over time and put a strain on the database. The heaviest write operation is directly related to how the granular records work: the user uploads a csv file and the server asynchronously processes it.

We use Celery with Redis for async work and must guarantee a good experience for a worst case 4 x 24 = 96 concurrent uploads. At baseline, a celery worker in prefork mode takes us 200MB at rest. It would cost us  200MB x 100 = 20GB of RAM to have 100 ready workers, which is insane and unsustainable. It would be better to have cheaper workers, and given that our task is IO bound, we've opted for thread based workers.

How does multi-threading perform in python?
First, let's consider what it implies. Python is subject to something called the GIL (Global Interpreter Lock) that prevents multiple thread from running python byte-code in parallel. When one thread is running, the others have to wait their turn. Which means that for a purely CPU-bound workload, you get no performance improvement. But there is an important detail: when one of the thread is blocking on IO, other threads can run, in other terms, multi-threading comes handy with code that blocks often on IO operations (like dealing with databases) This enables concurrency in exchange of thread context switching overhead. 

Why not async? Our celery workers rely on Django, a framework mainly built with synchronous capabilities, and we want to keep things as simple as possible.

In order to support 100 concurrent processing, let's consider what it implies. It starts with 100 POST requests to upload the csv files. We need enough gunicorn workers to handle them. We can create 4 gthread workers that will each spawn 25 threads. This will make a total of 100 threads to handle the requests concurrently. Given that uploading (and the usual workload) is IO bound, all the threads will very likely have equal chance to run. 

Our largest csv test file is roughly 5MB with overall 200k rows, which reflects the largest set of data among the cotton societies. For better safety, we will cap the file-size to 10MB. If 100 concurrent uploads happen, it means, parsing all the files without streaming will load 100 x 10MB = 1GB in memory, which is not optimal, we will of course stream.










