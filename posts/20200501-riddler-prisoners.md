---
title: Riddler Prisoners
slug: riddler-prisoners
date: "2020-05-01"
excerpt: This week's Riddler uses probability to design the ultimate jailbreak. Prisoners are given the opportunity to flip coins, and if all flipped coins are heads, each prisoner is released. Without communicating, what strategy should the prisoners use to maximize their odds of success?
status: published
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/can-you-flip-your-way-to-freedom/">Riddler</a> uses probability to design the ultimate jailbreak. Prisoners are given the opportunity to flip coins, and if all flipped coins are heads, each prisoner is released. Without communicating, what strategy should the prisoners use to maximize their odds of success? Here is the full problem text.

<blockquote>
You are locked in the dungeon of a faraway castle with three fellow prisoners (i.e., there are four prisoners in total), each in a separate cell with no means of communication. But it just so happens that all of you are logicians (of course).
<br><br>
To entertain themselves, the guards have decided to give you all a single chance for immediate release. Each prisoner will be given a fair coin, which can either be fairly flipped one time or returned to the guards without being flipped. If all flipped coins come up heads, you will all be set free! But if any of the flipped coins comes up tails, or if no one chooses to flip a coin, you will all be doomed to spend the rest of your lives in the castle’s dungeon.
<br><br>
The only tools you and your fellow prisoners have to aid you are random number generators, which will give each prisoner a random number, uniformly and independently chosen between zero and one.
<br><br>
What are your chances of being released?
<br><br>
<i>Extra credit:</i> Instead of four prisoners, suppose there are N prisoners. Now what are your chances of being released?
</blockquote>

# Solution

**The ideal strategy allows the four prisoners to escape 28.5% of the time.** To achieve this outcome, each prisoner generates a random number. If the prisoner's random number is less than 0.34, the prisoner should flip a coin. Otherwise, the prisoner should return the coin unflipped. This strategy seeks to minimize the total number of coins flipped (because that gives the greatest odds that _all_ coins flipped will be heads), while seeking to ensure that at least one coin is flipped.

Why the threshold of 0.34? This maximizes the overall probability of success. The chart below shows how the odds of success (the lines) change for different threshold values on the x-axis. We see that the odds of success for a group of four prisoners is maximized when x = 0.34.

We also see that larger groups of prisoners should choose smaller thresholds, because they want to keep the total number of coins low. Ultimately, large groups of N prisoners should expect roughly 25% odds of success.

<img src="/img/riddler-prisoners.png">

# Methodology

In a perfect world, with full communication, a group of prisoners would flip just one coin, giving overall odds of success of 50%. (For example, they would nominate the oldest prisoner to be the only one to flip a coin.) However, without the ability to communicate, the prisoners have to design a system to minimize the number of coins flipped without being so stingy that no coins are flipped. Fortunately, because our prisoners are all logicians, they can design a strategy that relies on perfect group behavior.

To limit the number of coins, a prisoner only flips if their random number is less than some value, $p$. Then the total number of coins flipped is a <a href="https://en.wikipedia.org/wiki/Binomial_distribution">binomial distribution</a>. For four prisoners and a threshold of $p$, the likelihood of k coins being flipped is:

$$P(k\ \text{coins}\ |\ \text{threshold}=p)={N \choose k}p^k(1-p)^{N-k}$$

So, for example, if $p=0.3$, the probability of 2 coins being flipped is

$$P(2\ \text{coins}\ |\ \text{threshold}=0.3)={4 \choose 2}0.3^2(0.7)^{2} = 0.2646$$

In python, we do the same thing with the `binom` distribution from `scipy.stats`. Here, the `pmf` method represents the probability mass function, which is the probability that a distribution takes a certain discrete value.

```python
>>> from scipy.stats import binom
>>> binom(p=0.3, n=4).pmf(2)
0.2646
```

We also know that if we flip 2 coins, the probability of both being heads is 25%. Therefore, if we set a threshold of 0.3, we flip 2 coins with probability 0.2646 and both of them are heads with probability 0.25. The probability of success is their product, 0.06615. Of course, we could have flipped 0, 1, 2, 3, or 4 coins, so we do the same calculation for each number. The only exception is that 0 coins is a guaranteed failure, so we can omit it. The sum of all possible numbers of coins is our final answer.

Mathematically, we want to find the value of $p$ that maximizes this function, where $N$ is the number of prisoners.

$$P(\text{success}\ |\ \text{threshold}=p)=\sum_{k=1}^{N} \frac{{N \choose k}p^k(1-p)^{N-k}}{2^k}$$

Usually, we find the maximum of a function by taking its derivative and solving for the point where the derivative equals zero. However, this equation is somewhat unwieldy. We can turn to a <a href="https://www.wolframalpha.com/input/?i=maximize+4p*%281-p%29%5E3%2F2+%2B+6p%5E2*%281-p%29%5E2%2F4+%2B+4p%5E3*%281-p%29%2F8+%2B+p%5E4%2F16">calculator</a> instead. We find that four prisoners maximize their odds of success when $p\approx0.342$.

In python, I wrote a function that calculates the odds of success, given a threshold, $p$, and a number of prisoners, $N$. By calculating this function for many values of $p$, we generate the lines in the chart above, and can use any solver to identify the value of $p$ that maximizes the output. We can also change the value of $N$ to explore strategies for larger numbers of prisoners. These larger groups pursue similar strategies, but the threshold value, $p$, gets lower and lower. Ultimately, the probability of success for an infinitely large groups appears to converge to 25%.

```python
from scipy.stats import binom


def model(threshold: float, prisoners: int = 4):
    """
    Returns the probability that the prisoners will be released.

    Solves the Riddler Classic from May 1, 2020:
    fivethirtyeight.com/features/can-you-flip-your-way-to-freedom/

    The prisoners will be released if every coin flipped by a
    prisoner is heads. Each prisoner decides to flip a coin if
    they draw a random number less than `threshold`; otherwise,
    they will decide not to flip a coin. If no prisoners flip
    a coin, which occurs when `threshold == 0`, then it results
    in a failure.

    Examples
    --------
    >>> # no prisoners flip coins; should be a failure
    >>> model(0.0)
    0.0

    >>> # all prisoners flip coins; should be 2**-prisoners
    >>> model(1.0, prisoners=4)
    0.0625

    >>> # one prisoner should always flip a coin
    >>> model(1.0, prisoners=1)
    0.5
    """

    # determine the number of coins that will be flipped based
    # on the threshold value. This is a binomial distribution,
    # with p=threshold and n=prisoners. As a shortcut, we omit
    # the possibility of zero dice, because it would result in
    # an automatic loss. For each number of coins we multiply
    # by the probability of flipping all heads: 2 ** -k.
    dist = binom(p=threshold, n=prisoners)
    return sum(
        dist.pmf(k) / 2 ** k for k in range(1, prisoners + 1)
    )


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```
