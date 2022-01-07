---
title: Riddler Flips
slug: riddler-flips
date: "2020-02-21"
excerpt: We tackle a solitaire game of coin flipping in this week's Riddler Classic. Using dynamic programming, we build a tree to explore all possible game states and work backwards to identify the ideal move at each state.
tags: ["dynamic programming", "puzzles", "python"]
relatedPosts:
  [
    "riddler-dowries",
    "riddler-pennies",
    "riddler-cycling",
    "riddler-guess-who",
    "riddler-bowling-dice",
    "riddler-chocolates",
  ]
status: published
---

# Introduction

We tackle a solitaire game of coin flipping in this week's <a href="https://fivethirtyeight.com/features/can-you-flip-your-way-to-victory/">Riddler Classic</a>. Using dynamic programming, we build a tree to explore all possible game states and work backwards to identify the ideal move at each state. Here is the full problem text.

<blockquote>
You have two fair coins, labeled A and B. When you flip coin A, you get 1 point if it comes up heads, but you lose 1 point if it comes up tails. Coin B is worth twice as much — when you flip coin B, you get 2 points if it comes up heads, but you lose 2 points if it comes up tails.

To play the game, you make a total of 100 flips. For each flip, you can choose either coin, and you know the outcomes of all the previous flips. In order to win, you must finish with a positive total score. In your eyes, finishing with 2 points is just as good as finishing with 200 points — any positive score is a win. (By the same token, finishing with 0 or −2 points is just as bad as finishing with −200 points.)

If you optimize your strategy, what percentage of games will you win? (Remember, one game consists of 100 coin flips.)

**Extra credit:** What if coin A isn’t fair (but coin B is still fair)? That is, if coin A comes up heads with probability p and you optimize your strategy, what percentage of games will you win?

</blockquote>

# Solution

**We can win this game with roughly 64% probability if we play optimally.** It is interesting to note that we could win a game with a single coin just 46% of the time. (Why not 50%? We need a _positive_ score to win, and we lose with a score of zero.) Therefore, the ability to choose between the coins as we play improves our odds of winning by nearly 20%!

# Methodology

Here is a snippet that shows the odds of winning a game with a single, fair coin, based on 100,000 simulated games. We only win 46% of the time because we need to have at least 51 winning flips.

```python
>>> import numpy as np
>>> trials = 100000
>>> scores = np.random.randint(2, size=(trials, 100)).sum(1)
>>> wins = (scores > 50).sum()
>>> wins / trials
0.46086
```

Now how do we solve the game with two coins? I'll turn to dynamic programming, a technique I've used on <a href="/riddler-dowries">several</a> <a href="/riddler-pennies">other</a> <a href="/riddler-cycling">problems</a>. That is, in order to model the probability of winning from our current position, we model the probability of winning from all the positions we could reach from our position, then choose the action that gives us the best expected result.

For this problem, the state of the game is expressed by the number of flips we've completed so far, which falls between 0 and 100, and the current score of the game, which falls between 0 and 200. Not every flip and score combination is valid - for example we can't have a score of 10 if we have only flipped twice, but these two variables completely express the state of our game. In python, we store the state of the game in an object called `GameState`. For example, `GameState(n_flip=30, score=-10)` means we have flipped 30 coins so far and our cumulative score is -10.

Once we know how to express the state of the game, we want to be able to calculate its expected value - that is, the likelihood of winning the game from this position. 100% implies we win the game in every case; 50% means we win half of the games we play, and so on.

In python, we calculate the expected value of a `GameState` by simulating all future positions we could reach - by flipping coin A and winning, flipping coin A and losing, flipping coin B and winning, or flipping coin B and losing. We take the average of the results from flipping coin A and compare it against the average of the results of flipping coin B and choose the coin that improves our odds the most.

Finally, we solve the problem by calculating the expected value of the game before we have flipped a single coin, which gives us just over 64%.

```python
>>> GameState(n_flip=0, score=0).expected_value()
0.6403174472759772
```

In addition, we can also plot the various states of the game and their associated winning probabilities using a heatmap. In the figure below, each `GameState` is plotted as a point: the x-axis is the number of flips we've completed, and the y-axis is our cumulative score. The color of the point represents how likely we are to win from that position, where yellow means almost a sure thing, and purple means we're virtually certain to lose. (I omitted many of the points that have more than 99% or less than 1% chances of winning to simplify the plot.)

<img src="/img/riddler-flips.png">

The extra credit this week asked how the game changes if we vary the probability that each coin turns up heads. In python we can run any number of scenarios by changing the class attributes `p_a` and `p_b`, which set the likelihood of winning and losing each flip for each coin. As expected, when coin A becomes more of a sure thing, our odds of winning the game increase, but I'll leave it as an exercise for the motivated reader to adjust the code and calculate the exact values!

# Full Code

Fairly short code for this week. We create a `GameState` class as a `namedtuple`, then extend its functionality by adding a method to calculate `expected_value` recursively. The solution to the puzzle is calculated by calling `GameState(0, 0).expected_value()`.

```python
from collections import namedtuple


class GameState(namedtuple("GameState", ("n_flip", "score"))):
    """
    The GameState object represents the state of the game, which is
    specified by the number of flips we've completed already (from
    zero to 100), and the current game score, which can be either
    positive or negative, but has bounds determined by the number of
    flips we've completed already.

    We add a method to solve for the expected value of the GameState,
    which is the number of games we would expect to win from this
    position given optimal play.
    """

    cache: dict = {}  # cache for expected value of GameStates
    p_a: float = 0.5  # probability that coin A wins (heads)
    p_b: float = 0.5  # probability that coin B wins (heads)
    v_a: int = 1      # value of a win from coin A
    v_b: int = 2      # value of a win from coin B

    def expected_value(self) -> float:
        """
        Return the expected percent of games won from this state,
        e.g. 0.85 implies you can win 85% of games from this position
        by playing optimally. To find the expected value of the game
        before it starts, call expected_value on the initial GameState

        Examples
        --------
        >>> GameState(99, 0).expected_value()
        0.5
        >>> GameState(0, 0).expected_value()
        0.6403174472759772
        """
        # search the cache to see if we've calculated this result before
        # otherwise, calculate the result and store it in the cache
        try:
            return self.cache[self]
        except KeyError:
            if self.n_flip == 100:
                # the game has ended; positive scores win; negative scores lose
                if self.score > 0:
                    self.cache[self] = 1.0
                else:
                    self.cache[self] = 0.0
            else:
                # we continue flipping coins; calculate the expected value of
                # flipping coin a and coin b, then choose the best one
                n, s = self.n_flip + 1, self.score
                a = (
                    self.p_a * GameState(n, s+ self.v_a).expected_value()
                    + (1 - self.p_a) * GameState(n, s - self.v_a).expected_value()
                )
                b = (
                    self.p_b * GameState(n, s + self.v_b).expected_value()
                    + (1 - self.p_b) * GameState(n, s - self.v_b).expected_value()
                )
                self.cache[self] = max(a, b)
            return self.cache[self]


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```
