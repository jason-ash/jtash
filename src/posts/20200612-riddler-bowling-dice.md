---
title: Riddler Bowling Dice
slug: riddler-bowling-dice
date: "2020-06-12"
excerpt: I can never resist a good dice problem, and this week's Riddler Express is no different. In a technique called "bowling", you can try to throw a dice so it lands on one of four sides, rather than six. How could we use this to our advantage in a simplified game of craps? We'll solve this with a bit of dynamic programming - my favorite!
tags: ["dynamic programming", "puzzles", "python"]
relatedPosts:
  [
    "riddler-guess-who",
    "riddler-pennies",
    "riddler-flips",
    "riddler-chocolates",
    "riddler-car-salesman",
  ]
status: published
---

# Introduction

I can never resist a good dice problem, and this week's <a href="https://fivethirtyeight.com/features/how-long-will-the-bacterial-colony-last/">Riddler Express</a> is no different. In a technique called "bowling", you can try to throw a dice so it lands on one of four sides, rather than six. How could we use this to our advantage in a simplified game of craps? We'll solve this with a bit of dynamic programming - my favorite!

<blockquote>
There’s a technique for rolling dice called “bowling,” in which you place your index finger and thumb on two opposite sides of the die and roll it along the table. If done correctly, the die will never land on the faces on which you were holding the die, leaving you with a 25 percent chance of landing on each of the remaining four faces.

You’d like to apply this technique to improve your chances of winning a simplified game of craps, in which your goal is simply to roll a 7 or 11 using two dice. With a standard rolling technique, your chances of rolling a 7 or 11 are 2/9, or about 22.2 percent.

Now suppose you’re using your bowling technique, and you roll the dice one at a time (i.e., you know the outcome of the first die before rolling the second). If you play to maximize your chances of rolling a 7 or 11, what will be your chances of winning?

**Extra credit:** Suppose you get one point for rolling a 7 or 11, but now you lose a point for rolling a 2, 3 or 12. With a standard rolling technique, you’d average 1/9 of a point. But if you “bowl” to maximize your expected score, what will that average be?

</blockquote>

# Solution

**With proper technique, your expected odds of rolling 7 or 11 are 37.5%. If you lose points for rolling a 2, 3, or 12, your expected value falls to 31.25%.** Both results are substantially higher than the standard odds from the prompt, which means bowling is a significant advantage.

In the game with no losing rolls, the best numbers to start with are 5 and 6. Each of these gives a 50% chance of winning once thrown, compared to a 25% chance of winning with starting values of 1, 2, 3, or 4. Therefore, we should start by placing our fingers on the 3 and 4 sides of the dice, which gives us the best chances of rolling a 5 or 6.

If we roll a 5 first, we should use the same technique, and roll for 1, 2, 5, or 6. This will win 50% of the time, either with a 2 (for 7 total) or a 6 (for 11 total). If we roll a 6 first, we also have 50% odds of winning, by rolling a 1 or a 5. Averaged out, we have a 37.5% chance of winning.

When we factor in losing numbers, we want to change strategy. Low numbers hurt us, so we want to roll with the 1 and 6 covered, for possible values of 2, 3, 4, or 5. A 5 is the best outcome again, giving us 50% odds of winning, while 2, 3, or 4 give us a 25% chance to win. Averaged out, we have a 31.25% expected value.

# Methodology

We want to work this problem backwards, from end to start. This technique is called dynamic programming, which I've used to solve <a href="/riddler-guess-who">several</a> <a href="/riddler-pennies">prior</a> <a href="/riddler-flips">puzzles</a>.

We want to determine what strategy to use, conditioned on the fact that we roll a particular starting number. For example, if our first number is 5, then we know how likely we will be to win or lose for each of the bowling arrangements. We do this for each possible starting number until we have a table like this (the expected value here is for the extra credit, with both winning and losing numbers.)

| First Roll | Bowling Dice | Expected Value |
| :--------: | :----------: | :------------: |
|     1      | {2, 3, 4, 5} |     -0.25      |
|     1      | {1, 3, 4, 6} |      0.0       |
|     1      | {1, 2, 5, 6} |     -0.25      |
|     2      | {2, 3, 4, 5} |      0.25      |
|     2      | {1, 3, 4, 6} |     -0.25      |
|     2      | {1, 2, 5, 6} |      0.0       |
|     3      | {2, 3, 4, 5} |      0.25      |
|     3      | {1, 3, 4, 6} |      0.25      |
|     3      | {1, 2, 5, 6} |      0.0       |
|     4      | {2, 3, 4, 5} |      0.25      |
|     4      | {1, 3, 4, 6} |      0.25      |
|     4      | {1, 2, 5, 6} |      0.0       |
|     5      | {2, 3, 4, 5} |      0.25      |
|     5      | {1, 3, 4, 6} |      0.25      |
|     5      | {1, 2, 5, 6} |      0.5       |
|     6      | {2, 3, 4, 5} |      0.25      |
|     6      | {1, 3, 4, 6} |      0.0       |
|     6      | {1, 2, 5, 6} |      0.25      |

Importantly, we get to choose how to roll after we've seen the first number. This means we can choose the type of roll that gives the highest expected value. With a starting roll of 5, for example, we should choose to roll the {1, 2, 5, 6}, which wins 50% of the time. On the other hand, with a starting roll of 1, we should chose to roll the {1, 3, 4, 6} for an expected value of 0.

Now that we know 5 is a great starting roll, and 1 is not so great, we can choose the first roll that gives us the best chances of seeing a 5 and the lowest chances of seeing a 1. This means we should start the game by rolling for {2, 3, 4, 5}. If we do, our expected win percent is 31.25%.

These problems are often very fun to program, and can be extended to any number of rolls. The `expected_value` function takes a number of rolls and sets of winning and losing numbers and returns the expected value for optimal play. We can see the results from above verified in code, and we can even try something more complicated, like 4 rolls and different winning and losing numbers, or 15 rolls with a target of 50!

```python
>>> # expected value of two sequential rolls with no losing numbers
>>> expected_value(n_rolls=2, winners=(7, 11), losers=())
0.375

>>> # expected value of two sequential rolls with a few losing numbers
>>> expected_value(n_rolls=2, winners=(7, 11), losers=(2, 3, 12))
0.3125

>>> # something more complicated: four rolls and doubled-targets
>>> expected_value(n_rolls=4, winners=(14, 22), losers=(4, 6, 24))
0.2265625

>>> # what if we want to hit 50 after 15 rolls?
>>> expected_value(n_rolls=15, winners=(50,), losers=())
0.1427854159846902
```

# Full Code

This problem can be solved with a single function. Essentially we play the game from end to start, assuming we make the optimal decision for each roll. Finally, we return the expected win percentage.

```python
from functools import lru_cache


@lru_cache()
def expected_value(
    n_rolls: int = 2,
    winners: Tuple[int] = (7, 11),
    losers: Tuple[int] = (2, 3, 12),
) -> float:
    """
    Returns the expected value of the simplified craps game, where we use
    the bowling technique for a number of rolls in a row, and win or lose
    depending on the total of the dice once they've been rolled.

    Using the bowling technique, we "guarantee" the dice will land on one
    of four sides, rather than one of six. On a normal dice, the opposite
    sides add up to seven, so the three bowling options are to roll with
    sides {2, 3, 4, 5}, {1, 3, 4, 6}, or {1, 2, 5, 6}.

    Parameters
    ----------
    n_rolls : int, the number of dice to roll. We roll sequentially
    winners : Tuple[int], the winning numbers, each worth 1 point
    losers : Tuple[int], the losing numbers, each worth -1 point

    Examples
    --------
    >>> # verify a simple example with one roll
    >>> expected_value(n_rolls=1, winners=(5, 6), losers=(1,))
    0.25

    >>> # expected value with two rolls and no losing numbers
    >>> expected_value(n_rolls=2, winners=(7, 11), losers=())
    0.375

    >>> # expected value with two rolls and some losing numbers
    >>> expected_value(n_rolls=2, winners=(7, 11), losers=(2, 3, 12))
    0.3125
    """
    # these are the rolling options available to us at every step
    options = ((2, 3, 4, 5), (1, 3, 4, 6), (1, 2, 5, 6))

    # with just one roll remaining, we choose the best option
    if n_rolls == 1:
        totals = [
            sum(n in winners for n in option)
            - sum(n in losers for n in option)
            for option in options
        ]
        return max(totals) / 4

    # if we have more than one roll remaining, we want to "try" each
    # option to see which produces the best outcome, recursively.
    return max(
        sum(expected_value(
            n_rolls - 1,
            tuple(x - n for x in winners),
            tuple(x - n for x in losers),
        ) for n in option) / 4
        for option in options
    )


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```
