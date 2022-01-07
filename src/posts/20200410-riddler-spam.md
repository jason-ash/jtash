---
title: Riddler Spam
slug: riddler-spam
date: "2020-04-10"
excerpt: We're tracking spam messages in this week's Riddler. Spammers post messages on the column's comment board, and they also reply to each other's messages. Over a three-day time period, how many spam messages and replies should we expect to see? It turns out there are some fascinating connections with continuously compounding interest rates, which we'll derive from the differential equation. I'll also write a simulation using numpy and poisson distributions to verify our analytical approach.
tags: ["puzzles", "python"]
status: published
---

# Introduction

We're tracking spam messages in this week's <a href="https://fivethirtyeight.com/features/can-you-catch-the-free-t-shirt/">Riddler Classic</a>. Spammers post messages on the column's comment board, and they also reply to each other's messages. Over a three-day time period, how many spam messages and replies should we expect to see? It turns out there are some fascinating connections with continuously compounding interest rates, which we'll derive from the differential equation. I'll also write a simulation using numpy and poisson distributions to verify our analytical approach.

<blockquote>
Last week’s Riddler column garnered six comments on Facebook. However, every single one of those comments was spam. Sometimes, spammers even reply to other spammers’ comments with yet more spam. This got me thinking.

Over the course of three days, suppose the probability of any spammer making a new comment on this week’s Riddler column over a very short time interval is proportional to the length of that time interval. (For those in the know, I’m saying that spammers follow a Poisson process.) On average, the column gets one brand-new comment of spam per day that is not a reply to any previous comments. Each spam comment or reply also gets its own spam reply at an average rate of one per day.

For example, after three days, I might have four comments that were not replies to any previous comments, and each of them might have a few replies (and their replies might have replies, which might have further replies, etc.).

After the three days are up, how many total spam posts (comments plus replies) can I expect to have?

</blockquote>

# Solution

**Over a three-day period, we should expect just over 19 total spam messages, including original posts and replies.**

Why isn't the answer 7? At first glance, it might seem like we could estimate the spam messages by counting:

- Day 1: we expect one fresh spam message.
- Day 2: we expect one fresh spam message and one reply to the existing message. Three total.
- Day 3: we expect one fresh spam message and one reply each to our previous three. Seven total.

However, this approach oversimplifies the continuous nature of the problem. I'll try to explain in the next section.

# Analytical Approach

Instead of counting messages per day, we want to be slightly more nuanced. The process we're modeling is continuous, meaning there is a small probability of a message appearing at every instant over the three days. So instead of modeling days, we could model hours to be more accurate. Or instead of modeling hours, we could model minutes, and then seconds, and so on. Eventually, the intervals become infinitesimal (vanishingly small), and we think in terms of "continuous spam rates" rather than "messages per day".

At any instant, our spam rate is equal to $s+1$, where $s$ is the number of spam messages we've already received. This means that if we currently have 5 messages, our new spam rate is 6 per day. It's as if each spam message creates a new "channel" for other spammers to reply to, which increases the total rate of spam we expect.

We are dealing with instantaneous rates of change, so we can use notation like $\Delta s$ to indicate the rate of change of $s$. Our model can be written as: $\Delta s = \lambda(s+1)\Delta t$, meaning that the rate of spam ($\Delta s$) is equal to the base spam rate ($\lambda$) times the number of spam messages we've received plus one ($s + 1$) times the change in time ($\Delta t$).

We can rewrite this relationship as a <a href="https://en.wikipedia.org/wiki/Differential_equation">differential equation</a>: $\frac{\delta s}{\delta t} = \lambda (s + 1)$. But instead of $\frac{\delta s}{\delta t}$, we want $\frac{\delta t}{\delta s}$, which represents the derivative of time with respect to spam, so we have $\frac{\delta t}{\delta s} = \frac{1}{\lambda (s + 1)}$, also written as $t'(s) = \frac{1}{\lambda (s + 1)}$.

Now, to calculate $t$ we integrate $\frac{1}{\lambda (s + 1)}$, which, for constant $\lambda$ is equal to $\frac{ln(s+1)}{\lambda}$, which gives us $t=\frac{ln(s+1)}{\lambda}$. Solving for $s$ gives us $s=e^{\lambda t} - 1$. When $t=3$ (for a three day time period), we calculate an expected spam total of 19.0855.

**It is not surprising that $e$ shows up in our answer. This problem is exactly like <a href="https://en.wikipedia.org/wiki/Compound_interest#Continuous_compounding">continuously compounding interest</a>, where the spam rate is the interest rate, and each spam message earns "interest" (i.e. attracts additional spam) continuously at a constant rate.**

# Simulation

We can also simulate this process. While it is impossible to simulate a continuous process exactly, we can <a href="https://en.wikipedia.org/wiki/Discretization">discretize</a> the process into many small, finite steps. The more steps we have, the more accurate our model will be.

Assume we want to model the likelihood of receiving a spam message or reply during each second of each of the three days. We will model 259,200 intervals (the number of seconds in three days.) During each second, the rate of spam we expect is equal to the number of messages we've received so far plus one, divided by the length of the interval (in days) $\frac{s+1}{\text{interval length}}$. During the first second, the probability we receive a spam message is $\frac{1}{86,400}$, or roughly 0.000012. In the simulation code, we flip a theoretical coin, and if it lands on heads (with probability 0.000012), we add one spam message to our total. Then the next interval will have a different spam rate, and we continue the process for all the intervals, adding the spam messages as we go.

When the number of intervals is sufficiently large (e.g. 100 or more intervals per day), and the number of simulations is also large (e.g. 1000 or more), we find that the average number of spam messages converges to $e^{\lambda t} - 1$, or 19.0855.

```python
# using the `model` function (source code below)
# results will vary because of the random nature of the simulation
# the output is an array of samples - the mean tells us the expected value
>>> model(trials=100000, intervals_per_day=1000).mean()
19.03231
```

# Full Code

The code this week is a partly vectorized simulation function. We break the three-day time period into thousands of small intervals and simulate the spam messages received in each interval. It runs relatively quickly up to roughly one million trials and converges very closely to the analytical solution, $e^x-1$ for $x=3$.

```python
"""
Solution to the Riddler Classic from April 10, 2020
https://fivethirtyeight.com/features/can-you-catch-the-free-t-shirt/
"""
import numpy as np


def model(
    trials: int,
    spam_rate: float = 1.0,
    n_days: int = 3,
    intervals_per_day: int = 1000,
) -> np.ndarray:
    """
    Solves the Riddler Classic via simulation. Breaks each day into intervals,
    then draws from a poisson distribution for each interval, summing the total
    spam messages over the course of n_days. The simulation is vectorized across
    trials, and is quite fast for 1+ million trials.

    Parameters
    ----------
    trials : int, the number of simulations to run, e.g. 1000
    spam_rate : float, default 1.0, the average number of spam messages received
        over the course of a full day
    n_days : int, default 3, the number of days to simulate
    intervals_per_day : int, default 1000, the number of intervals each day is
        broken into for the purposes of simulation

    Returns
    -------
    spam : np.ndarray of the total number of spam received over the time period
        for each trial; will have shape == (trials,)
    """

    # we want to loop through each interval of the simulation, keeping track of
    # how many spam messages we receive and what the current spam rate is (which
    # goes up as we receive more spam.) At each interval, we randomly draw from
    # a poisson distribution to determine how much more spam we receive.
    spam = np.zeros(trials)

    for _ in range(n_days * intervals_per_day):
        lam = (spam + 1) * spam_rate / intervals_per_day
        spam += np.random.poisson(lam=lam)

    return spam


if __name__ == "__main__":
    results = model(1_000_000)
    print(f"Average spam: {results.mean():,.4f}")  # ~19.0512 depending on seed
```
