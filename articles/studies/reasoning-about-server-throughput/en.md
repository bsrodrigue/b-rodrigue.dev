---
title: "How to reason about server throughput"
date: "2026-07-03"
category: studies
tags:
  - studies
  - performance
  - nodejs
---

How do you scale a platform to support 100 concurrent users? And most importantly, what does it even mean? 

Thinking only in terms of users can be misleading because it hides important aspects like:
- A single user opening a page or doing a single action can trigger many requests (fan-out).
- Or the opposite, many users can stay on low activity pages that trigger almost no requests.
- Not all endpoints perform the same.
- It assumes the platform usage pattern is regular and steady. In the real world, servers experience spikes and low traffic periods.

This is a compelling reason to prefer to think in terms of requests per second, but even then, many engineers and technical writers never explain what it actually means. If you consider a server that handles 10 K of requests per second, does it mean that each request is processed in less than 0.1 milliseconds? 

For context, making a database query can take several milliseconds. Does it mean that handling 10 K requests per second is actually impossible?

On their website, *Deno* markets itself as being more capable at handling requests in comparison to *Node*:
- *Deno*: 105200 requests / second
- *Node*: 48700 requests / second

It means that *Deno* is processing each request in *0.0095 ms*. This is an insane amount of time to do HTTP parsing, JSON parsing, business logic and database queries.

> **Important update**
> After a recent check, it seems that *Deno's website (https://deno.com/)* has updated their benchmarks and is now clearer with better transparency. But the lesson I'm going to teach can still be valuable.

You might've guessed that I am exaggerating, but the point is to show that mere numbers can be misleading and prevent beginners from actually learning and making important decisions. When estimating the actual performance of a server, several components are often missing from discourses, either for marketing reasons, or out of genuine ignorance or lack of care.

Performance is the fruit of technical decisions and different components working together in harmony.
You cannot reason about performance without considering:
- Your hardware
- Your algorithms
- Your concurrency model
- Your network 
- Your workload

In my earlier example, it might've sounded crazy to handle each request in 1/10 of a millisecond. But it assumes you can only run one request at a time and that each request is doing meaningful work during its entire lifetime. What if you could run a thousand of requests at a time? 

Imagine the first requests arrive and immediately has to wait for a database connection, why not serving the next request? And so on... As long as you don't write code that blocks your thread, it will be able to pick up new requests and start handling them.

> **Be curious about your numbers**:
>  Even if you are not a huge fan of bench-marking and measurement, I'd recommend every software engineer to know the latency of everyday important system calls and operations that take place on their machines. For instance, I've just measured the time it took for an *accept()* system call to complete: **0.002 milliseconds**. It means that you could theoretically call this function *500,000* times in a single second. Of course, it doesn't mean you can handle *500,000 requests per second*.

But this is not possible for all types of servers and workloads, as I said earlier, your concurrency model matters too. 

If your workload is purely CPU-bound, unlocking *concurrency* will be hard because you will be directly limited by the number of your cores. Fortunately, most of the internet's workload is IO bound, that is, the servers spend more time waiting for IO operations to happen or to complete than actually crunching numbers. This allows us to leverage the *async* model to handle multiple clients concurrently.

With this in mind, the throughput number becomes clearer, especially if we use *Little's Law*:

**L=λ.W**

Where:
- L = average number of items in the system (concurrency)
- λ = arrival rate (throughput, items per unit time)
- W = average time in system (latency)

Let's take *Deno*, with a throughput of 100.000 requests per second. They didn't provide the average latency per request, which is important. A server that handles millions of requests per second but takes days to respond is worthless.

So let's assume as an example an average latency of 300 ms (it could be faster). If we convert the throughput into requests per milliseconds, we get *100 requests per millisecond*.

Applying the formula means *L = 100 x 300 = 30.000 concurrent requests*. In other terms, the *Deno* server must be able to handle *30 thousand* connections at the same time and service them in roughly *300 milliseconds* in order to achieve an average throughput of *100 thousand requests per second*. 

This is much clearer than just saying "Our system supports 10.000 concurrent users" or "Deno handles 100.000 requests per second." But keep in mind that this model fails as soon as your workload shifts towards CPU-bound tasks. In fact, it can even break it. The reason is due to how most *async* runtimes work. Under the hood, they implement a single threaded event loop that can switch tasks when it hits an IO operation. This is why it first has to execute the blocking and synchronous code before yielding control back to the event loop.

### Takeaway

The goal of this small post wasn't to teach you everything needed to design performant servers, but rather to give you heuristics and a decent mental model to start reasoning about server performance in the first place. This will also help you understand why certain types of workloads are hard to scale compared to others. Also, the next time you see benchmarks online, you are better equipped to question them.







