---
title: Riddler Solstice Coin
slug: riddler-solstice-coin
date: "2020-06-19"
excerpt: As a self-professed Bayesian enthusiast, this week's Riddler Express is right up my alley! We want to calculate the odds that a coin is magical after flipping it a given number of times. Specifically, we want to calculate the number of flips before we're 99% certain the coin is actually magical. We'll use Bayes's formula to find an exact solution.
tags: ["bayesian inference", "puzzles", "python"]
status: published
---

# Introduction

As a self-professed Bayesian enthusiast, this week's <a href="https://fivethirtyeight.com/features/can-you-flip-the-magic-coin/">Riddler Express</a> is right up my alley! We want to calculate the odds that a coin is magical after flipping it a given number of times. Specifically, we want to calculate the number of flips before we're 99% certain the coin is actually magical. We'll use Bayes's formula to find an exact solution.

<blockquote>
I have a coin with a sun on the front and a moon on the back. I claim that on most days, it’s a fair coin, with a 50 percent chance of landing on either the sun or the moon.

But once a year, on the summer solstice, the coin absorbs the sun’s rays and exhibits a strange power: It always comes up the opposite side as the previous flip.

Of course, you are skeptical of my claim. You figure there’s a 1 percent chance that the coin is magical and a 99 percent chance that it’s just an ordinary fair coin. You then ask me to “prove” the coin is magical by flipping it some number of times.

How many successfully alternating coin flips will it take for you to think there’s a 99 percent chance the coin is magical (or, more likely, that I’ve rigged it in some way so it always alternates)?

</blockquote>

# Solution

**It will take 14 consecutive alternating flips before we are at least 99% sure the coin is magical.** This problem is a classic fit for Bayesian methods. (We've seen another great example in a <a href="/riddler-bayes-millionaire">prior Riddler</a> based on "Who wants to be a millionaire") Let's start by reviewing Bayes's formula, then we'll parse the problem text to identify the information we need to solve it.

$$
P(A|B) \times P(B) = P(B|A) \times P(A)
$$

Typically, a problem like this will give us three of the four variables, and we'll need to solve for the fourth. As we go, we'll identify what we mean when we say $A$ and $B$ in the context of this problem. Let's write down the information we have:

- We want to find the number of flips it will take to be 99% sure the coin is magical. Let's use a variable, $N$, to represent this unknown number. In probability notation, this means we want to find $N$ such that $P(\text{magical coin | N alternating flips}) = 0.99$.
- Before we flip any coins, we believe the probability of a magical coin is 1%. We'll write this as $P(\text{magical coin}) = 1\%$.
- We know that _if_ the coin is magical, it will always alternate flips, no matter how many times we flip the coin. We'll re-use our variable $N$ and write $P(\text{N alternating flips | magical coin}) = 100\%$.
- Finally, we need to calculate the probability of observing $N$ alternating flips in a row. This depends on whether we are using a fair or a magical coin, so we'll take the weighted average of both possibilities: $P(\text{N alternating flips}) = 99\% \times \frac{1}{2^N} + 1\% \times 1$.

Now we've identified all four variables required for Bayes's formula above. Written out, we have:

$$
P(\text{magic | N flips}) \times P(\text{N flips}) = P(\text{N flips | magic}) \times P(\text{magic})
$$

When we plug in our values, we get:

$$
0.99 \times (\frac{0.99}{2^N} + 0.01) = 1 \times 0.01
$$

Rearranging so we have $N$ on one side, we get:

$$
2^N = \frac{\frac{99}{100}}{\frac{1}{99} - \frac{1}{100}}
$$

Conveniently, the fraction on the right equals $9801$. So we have:

$$
2^N = 9801
$$

We take the log of both sides to solve for $N$, which gives us $N=13.26$. Because we can't have fractions of coin flips, and we want to be _at least_ 99% sure before stopping, we should err on the side of caution and flip 14 times. This means that after 14 consecutive, alternating flips we can be 99.4% certain the coin is magical.
