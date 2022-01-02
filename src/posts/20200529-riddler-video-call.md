---
title: Riddler Video Call
slug: riddler-video-call
date: "2020-05-29"
excerpt: Suppose everyone in the United States wanted to join the same video call? If each of the 330 million participants joins and drops at a random time, how likely is it that at least one person overlaps with everyone else? This problem easily exceeds the limits of a practical simulation, but we'll write some code to develop intuition about the results before attempting to solve it analytically.
status: published
---

# Introduction

Suppose everyone in the United States wanted to join the same video call? If each of the 330 million participants joins and drops at a random time, how likely is it that at least one person overlaps with everyone else? This problem easily exceeds the limits of a practical simulation, but we'll write some code to develop intuition about the results before attempting to solve it analytically. Here's the full problem text from this week's <a href="https://fivethirtyeight.com/features/can-you-join-the-worlds-biggest-zoom-call/">Riddler</a>.

<blockquote>
One Friday morning, suppose everyone in the U.S. (about 330 million people) joins a single Zoom meeting between 8 a.m. and 9 a.m. — to discuss the latest Riddler column, of course. This being a virtual meeting, many people will join late and leave early.

In fact, the attendees all follow the same steps in determining when to join and leave the meeting. Each person independently picks two random times between 8 a.m. and 9 a.m. — not rounded to the nearest minute, mind you, but any time within that range. They then join the meeting at the earlier time and leave the meeting at the later time.

What is the probability that at least one attendee is on the call with everyone else (i.e., the attendee’s time on the call overlaps with every other person’s time on the call)?

**Extra credit:** What is the probability that at least two attendees are on the call with everyone else?

</blockquote>

# Solution

This is a challenging problem, in part because it exceeds the limits of a simulation that could run in reasonable time, and also because the underlying probability distributions are a little tricky. I'm still working on an analytical solution.

The following image helped me think about the probability distributions involved. Each blue bar represents one participant's time on the call, and we quickly build a stack of participants joining and dropping over time. However, we are especially interested in two participants: the person that _leaves the call first_, and the person that _arrives to the call last_.

These two people set the boundary on the minimum overlap time. In order to overlap with everyone, at least one person must _join_ the call before the first person leaves, and must _stay_ on the call until the last person joins. If those two conditions are met, then we're guaranteed to have at least one overlap.

<img src="/img/riddler-video-call.png">

<!-- # Methodology

From here, it gets more difficult! We need to do a few things:

1. Find the probability distribution for the time the first person leaves the call, and for the time the last person joins the call.
2. Find the probability that any participant started before the first person left, and stayed until after the last person arrived. This depends on the values we got from (1).

First, we know that each participant draws two random variables for the start and end time. The start time is the minimum of these values, $\text{min}(x_0, x_1)$, and the end time is the maximum, $\text{max}(x_0, x_1)$. What is the distribution of the start times for an individual participant? We want to find $P(\text{min}(x_0, x_1) < x)$. Because the values are drawn independently, this is the same as saying $P(x_0<x)\times P(x_1<x)$, which evaluates to $x^2$.

This is the <a href="https://en.wikipedia.org/wiki/Cumulative_distribution_function">cumulative distribution function</a> for this random variable. The <a href="https://en.wikipedia.org/wiki/Probability_density_function">probability density function</a> is the derivative, which is $2x$. We follow a similar process to solve for the end time of each participant.

Now, what is the distribution of the time of the first departure for anyone on the call? This is $P(\text{min}(\text{all end times}) < x)$. I'll spare the details here, but we get a cumulative distribution function of $1 - (1 - x^2) ^ n$, where $n$ is the number of participants on the call. Taking the derivative here, we see that $f(x) = 2nx(1 - x^2)^{n-1}$. This means we can calculate the distribution of the first departure from the call.

With this probability distribution, we can calculate the expected time of the first departure. With 10 participants, it's roughly equal to 0.27, meaning 27% of the way into the call. With 100 participants, it's roughly 8.8%, and with 1000, it's 2.8%. With 330 million participants, the first departure time is _extremely_ early.

If we have a value for the first departure time, we can calculate the odds that someone arrives before this time. Call the first departure time $\epsilon$. Because of the symmetry of this problem, we know that the first departure time and the last arrival can be represented by the same value of $\epsilon$.

For at least one participant to arrive before $\epsilon$ and depart after $1 - \epsilon$ we can use $1 - (1 - \epsilon^2)^n$. For 330 million participants, with an extremely small $\epsilon$ and extremely large $n$, we get roughly 48% odds that at least one person will overlap everyone else.

What's fascinating about this problem is that it appears the answer is the same regardless of the number of people on the call, whether it's 10, 100, 1000, or 100 million. They all appear to have the same value around 48%.

The extra credit analytical solution will have to wait for another time. However, my small-scale simulations showed values between 18-20% for any number of participants I tested. As a result, I'm assuming those values will hold, as they did before, for any number of people on the call. -->

# Sample Simulation

While it's impractical to simulate the entire 330-million-person call, I found that simulations with smaller values (100,000 to 50 million or more) consistently yielded values around 66% for at least one overlap, and around 40% for at least two overlaps.

I also had some fun this week playing with <a href="https://dask.org/">dask</a> to run large simulations on my machine. Dask lets you create a "local cluster" on your computer that can parallelize certain operations and run them much faster than you could on a single thread.

The code below creates a dask local cluster, then runs a large batch of simulations that align with the analytical results above.

```python
from dask import array as da
from dask.distributed import Client

# start a local cluster using all CPU threads
client = Client()


def model(trials: int, participants: int):
    """
    Returns the number of participants on a call who overlap
    with every other participant. This is solved efficiently
    using dask arrays for parallel simulations:

    1. Generate each person's start and end times. The start
       time is the min and the end time is the max.
    2. For a group of participants, find the latest start
       time and the earliest end time.
    3. Identify any participants that have a starting time
       before than the earliest end time and an end time
       after the latest start time.

    Returns
    -------
    result : an array of the number of participants in each
        trial who overlap every other participant.
    """
    times = da.random.uniform(size=(trials, participants, 2))
    starts = times.min(axis=2)
    ends = times.max(axis=2)

    latest_start = starts.max(axis=1)
    earliest_end = ends.min(axis=1)

    # check if any participants arrive before the first person
    # leaves and leave after the last person arrives.
    cond1 = starts.T < earliest_end
    cond2 = ends.T > latest_start
    return (cond1 & cond2).sum(axis=0)


# results here is a delayed object. Call `compute() for values
# here we run 1000 trials with 10 million participants
results = model(trials=1000, participants=10000000)
results.compute()
```
