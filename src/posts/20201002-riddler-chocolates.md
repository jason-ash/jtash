---
title: Riddler Chocolates
slug: riddler-chocolates
date: "2020-10-02"
excerpt: I've taken a short break from solving the Riddlers because I've recently become a father! Our daughter, Emerson, was born in September, and I've been working on a new set of puzzles related to parenthood. However, a classic probability question from the Riddler drew me back in with the prospect of writing a dynamic programming solution.
tags: ["dynamic programming", "puzzles", "python"]
relatedPosts:
  ["riddler-bowling-dice", "riddler-guess-who", "riddler-pennies", "riddler-flips"]
status: published
---

# Introduction

I've taken a short break from solving the Riddlers because I've recently become a father! Our daughter, Emerson, was born in September, and I've been working on a new set of puzzles related to parenthood. However, a classic probability question <a href="https://fivethirtyeight.com/features/can-you-eat-all-the-chocolates/">this week</a> drew me back in with the prospect of writing a dynamic programming solution.

<blockquote>
I have 10 chocolates in a bag: Two are milk chocolate, while the other eight are dark chocolate. One at a time, I randomly pull chocolates from the bag and eat them — that is, until I pick a chocolate of the other kind. When I get to the other type of chocolate, I put it back in the bag and start drawing again with the remaining chocolates. I keep going until I have eaten all 10 chocolates.

For example, if I first pull out a dark chocolate, I will eat it. (I’ll always eat the first chocolate I pull out.) If I pull out a second dark chocolate, I will eat that as well. If the third one is milk chocolate, I will not eat it (yet), and instead place it back in the bag. Then I will start again, eating the first chocolate I pull out.

What are the chances that the last chocolate I eat is milk chocolate?

</blockquote>

# Solution

The result this week certainly surprised me (assuming I answered correctly...) **The probability of drawing a milk chocolate last from the bag is 50%!** That's higher than I thought it would be. What's even more interesting is that once we have more than a few chocolates of each kind in the bag, the results are almost always the same. A bag of 4 chocolates each? 50%! 10 chocolates each? 50%! 20 dark chocolates and 5 milk chocolates? 50%! Unless I'm missing something, the dynamics of this puzzle seem to be remarkably insensitive to starting conditions.

As with <a href="/riddler-bowling-dice">many</a> <a href="/riddler-guess-who">other</a> <a href="/riddler-pennies">prior</a> <a href="/riddler-flips">puzzles</a>, I approached this with possibly my favorite solving technique: dynamic programming. Rather than solving for a bag of 10 chocolates right away, we can solve the problem for a bag of 1 chocolate, 2 chocolates, and other small numbers first. Then, once we have those building blocks in place, we can start to tackle larger and more complicated situations.

For example, a bag of 4 dark chocolates and 4 milk chocolates with the last chocolate being "dark" could become a bag of 3 dark chocolates and 4 milk chocolates if we drew a dark chocolate, or could stay as a bag of 4 each if we draw a milk chocolate. Each of those two outcomes leads to two more outcomes each, on and on, until we eventually reach the terminating states in those chains where only one kind of chocolate remains.

This is a problem that didn't take a lot of time to code, but will certainly occupy a lot of my time trying to understand. Well done to the puzzle's creator, Henk Tijms!

# Code

This is a classic example of dynamic programming. We create a function that calls itself recursively until it reaches a state where the outcome is known. Once that happens, we can calculate the expected value of the chain of events that led to that outcome, which is our answer. A problem like this often benefits from <a href="https://en.wikipedia.org/wiki/Memoization">memoization</a>, where the results from sub-problems are saved and looked up rather than recalculated, but wasn't necessary for this problem because of the low number of calculations.

```python
from typing import Optional


def model(dark: int, milk: int, last: Optional[str] = None) -> float:
    """
    Solves the Riddler Classic using dynamic programming. We start with a given number
    of chocolates in the bag, and we draw one at a time. We track the last chocolate we
    drew, and if we draw the same one, we eat it. Otherwise, we put it back in the bag
    and reset the "last" value to None.

    For example, `model(8, 2, None)` will return the probability of drawing a milk
    chocolate last if we start with a bag of 8 dark and 2 milk chocolates.

    Parameters
    ----------
    dark : int, the number of dark chocolates
    milk : int, the number of milk chocolates
    last : Optional[str], the type of chocolate we drew last, either "dark", "milk", or
        None (for example, if we're starting fresh)

    Returns
    -------
    expected_value : float, the probability of drawing a milk chocolate last, given our
        strategy of choosing chocolates.
    """
    if dark == 0:
        return 1.0
    if milk == 0:
        return 0.0
    p = dark / (dark + milk)
    if last == "dark":
        return p * model(dark - 1, milk, "dark") + (1 - p) * model(dark, milk, None)
    if last == "milk":
        return p * model(dark, milk, None) + (1 - p) * model(dark, milk - 1, "milk")
    return p * model(dark - 1, milk, "dark") + (1 - p) * model(dark, milk - 1, "milk")
```
