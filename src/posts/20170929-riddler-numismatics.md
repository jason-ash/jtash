---
title: Riddler Numistmatics
slug: riddler-numismatics
date: "2017-09-29"
excerpt: It turns out you can identify a doctored coin with a fairly high degree of certainty... It just takes lots and lots of trials.
tags: ["puzzles", "python"]
status: published
---

If a puzzle involves flipping coins, then it is typically a good candidate for "solution by simulation". This problem, from the weekly
<a href="https://fivethirtyeight.com/features/rock-paper-scissors-double-scissors/">fivethirtyeight riddler classic</a> was fun because it involved equal parts probability theory and computation.

<blockquote>
On the table in front of you are two coins. They look and feel identical, but you know one of them has been doctored. The fair coin comes up heads half the time while the doctored coin comes up heads 60 percent of the time. How many flips — you must flip both coins at once, one with each hand — would you need to give yourself a 95 percent chance of correctly identifying the doctored coin?

Extra credit: What if, instead of 60 percent, the doctored coin came up heads some P percent of the time? How does that affect the speed with which you can correctly detect it?

</blockquote>

Let's start with the base case, in which a single coin has a 60% probability of landing on heads. Let's define two probability functions for each coin, $c_1$ and $c_2$.

$$
c_1 = 1\ with\ p=0.6
$$

$$
c_1 = 0\ with\ p=0.4
$$

$$
c_2 = 1\ with\ p=0.5
$$

$$
c_2 = 0\ with\ p=0.5
$$

We are really interested in a new variable, $X$, which is the difference between $c_1$ and $c_2$, tracked cumulatively over time. Therefore, at each point in time, $X$ can be incremented by 1, 0, or -1.

$$
X = 1\ with\ p=p_1\times{(1-p_2)}=0.3
$$

$$
X = 0\ with\ p=p_1\times{p_2} + (1-p_1)\times{(1-p_2)}=0.5
$$

$$
X = -1\ with\ p=(1-p_1)\times{p_2}=0.2
$$

$X$ can be simulated using python extremely efficiently using the following code. We are interested in the number of flips it will take for $X$ to be positive 95% of the time. Because one coin is biased towards heads we know that $X$ will be biased toward positive numbers over time. Therefore, our task is to identify the number of flips it takes for 95% of all scenarios to result in a positive value for $X$.

One way to do this is to flip coins a fixed number of times and record the value of $X$ after the final flip. The advantage in this approach is that we can vectorize this operation and run it very quickly. The disadvantage of this approach is that we have to predefine the number of flips we're interested in testing. If we don't test enough, then we may not gather enough evidence to achieve 95% certainty that a given coin is biased. The code below uses a default of 200 flips, which we find is plenty to meet our goal.

```python
import numpy as np

def model(simulations, flips=200, p1=0.6, p2=0.5):
    p = [p1*(1-p2),p1*p2+(1-p1)*(1-p2),(1-p1)*p2]
    out = np.random.choice([1,0,-1],size=(trials,flips),p=p).cumsum(1)
    return out

trials = 1000000
X = model(trials)
np.where((X > 0).sum(0) > 0)[0][0] + 1
>>> 143
```

Why do we check our distribution against the zero line? As long as there is a meaningful probability of $X\leq{0}$, we can't rule out the likelihood that the coins have equal probabilities. However, as soon as 95% of our simulations lie above zero, we can be 95% confident that one of the coins is biased.

<img src="/img/riddler-numismatics.png">

We can also extend this problem to test coins with different biases. With $p=60\%$, it takes 143 flips to detect the doctored coin. With higher values of $p$, we can detect the doctored coin sooner. With lower values of $p$ it takes many more trials. In general, we can use the normal approximation of our distribution, with mean $n\times{(p_1-p_2)}$ and variance $n[p_1(1-p_1) + p_2(1-p_2)]$. Using a confidence test at 95%, we can solve for the number of flips it would take to identify a doctored coin with any $p>50\%$.

For example, the normal approximation in our case has mean $143\times(0.6 - 0.5) = 14.3$ and variance $n\times(0.6\times0.4 + 0.5\times0.5)=70.07$. We can confirm that $X$ is positive after 143 flips by dividing the mean by the square root of the variance and testing at the 95% confidence level: 1.645. Because $\frac{14.3}{\sqrt{70.7}} > 1.645$, we confirm our result.
