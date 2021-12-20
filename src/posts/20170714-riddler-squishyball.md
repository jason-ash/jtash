---
title: National Squishyball League
slug: riddler-squishyball
date: "2017-07-14"
excerpt: As the owner of a dominant team looking to establish a dynasty, how can you stack the odds against your opponent? This week's fivethirtyeight Riddler Classic has a heavy dose of combinatorics.
status: published
---

This week's <a href="https://fivethirtyeight.com/features/can-you-eat-more-pizza-than-your-siblings/">Riddler Classic</a> challenges you to find a strategy that maximizes your team's winnings (though perhaps minimizes peoples' tolerance to sit through an absurdly long playoff season...)

<blockquote>
Congratulations! The Acme Axegrinders, which you own, are the regular season champions of the National Squishyball League (NSL). Your team will now play a championship series against the Boondocks Barbarians, which had the second-best regular season record. You feel good about Acme’s chances in the series because Acme won exactly 60 percent of the hundreds of games it played against Boondocks this season. (The NSL has an incredibly long regular season.) The NSL has two special rules for the playoffs:

1. The owner of the top-seeded team (i.e., you) gets to select the length of the championship series in advance of the first game, so you could decide to play a single game, a best two out of three series, a three out of five series, etc., all the way up to a 50 out of 99 series.
2. The owner of the winning team gets 1 million minus 10,000 for each of the victories required to win the series, regardless of how many games the series lasts in total. Thus, if the top-seeded team’s owner selects a single-game championship, the winning owner will collect 990,000. If he or she selects a 4 out of 7 series, the winning team’s owner will collect 960,000. The owner of the losing team gets nothing.

Since Acme has a 60 percent chance of winning any individual game against Boondocks, Rule 1 encourages you to opt for a very long series to improve Acme’s chances of winning the series. But Rule 2 means that a long series will mean less winnings for you if Acme does take the series.

How long a series should you select in order to maximize your expected winnings? And how much money do you expect to win?

</blockquote>

Let's go for an easy win right away: it's trivial to calculate the prize pool for a given series length: $ prize = 1,000,000 - 10,000n$, where $n$ is the number of wins required to win the series. A series of length 7, for example, requires 4 wins, and in general, a series of $z$ requires $\lfloor{z/2}\rfloor+1$ wins, which we can implement in python as `n = z//2+1`.

However, the more difficult part of the problem requires us to calculate the probability of winning a series of length 1, 3, 5, ..., 99. Let's start with simple cases and work our way up from there.

The probability of winning a "series" of 1 game is simply the probability of winning that single game, $p=0.6$. The probability of winning a series of 3 games is the probability of winning two games before our opponent wins two games. There are a few ways this can happen. We can win the first two games with probability $p^2$, or we can win one of the first two games plus the third game, with probability $\binom{2}{1}qp^2$. Therefore the probability of winning the series is $p^2 + \binom{2}{1}qp^2$.

Now we can derive a pattern for the probability of winning a series of length $z$. Let's take a series of 5:
$$\binom{2}{0}q^0p^3+\binom{3}{1}q^1p^3+\binom{4}{2}q^2p^3$$

and a series of 7:
$$\binom{3}{0}q^0p^4+\binom{4}{1}q^1p^4+\binom{5}{2}q^2p^4+\binom{6}{3}q^3p^4$$.

The pattern consists of four elements:

1. Each term in the pattern is multiplied by $p^n$, where n is the number of games required to win the series, e.g. 4 for a best-of-seven
2. Each term in the pattern is multiplied by $q$ raised to an increasing power, e.g. 0, 1, 2, ..., for the possible number of games the opponent can win without winning the series
3. The top term of the binomial sequence starts at one-minus the number of games required to win the series, e.g. 3 for a best-of-seven, and continues until one-minus the total number of games in the series, e.g. 6 for a best-of-seven
4. The bottom term of the binomial sequence starts at zero and continues to one-minus the number number of games required to win the series

Therefore, we can write a function that expresses the probability of winning a series for a given series length by calculating each of the four elements. For example, the probability of winning a series of 17:
$$\binom{8}{0}q^0p^9+\binom{9}{1}q^1p^9+\binom{10}{2}q^2p^9+\binom{11}{3}q^3p^9+\ ...\ +\binom{16}{8}q^8p^9$$.

This isn't the most elegant way of solving it, but it _is_ a fun application of arrays in python:

```python
import numpy as np

def win_pct(series_length, p=0.6):
    """
    Probability of winning a series of series_length,
    given a win percent, p, for any single game

    Parameters
    ----------
    series_length : int, the max length of the series
    p : float, between 0 and 1, the probability of
        winning any single game

    Returns
    -------
    win_pct : float, between 0 and 1, the probability
        of winning the overall series
    """
    a = np.arange(series_length//2,series_length)
    b = np.arange(series_length//2+1)
    c = comb(a,b) * (1-p)**b * p**(series_length//2+1)

    return c.sum()
```

Once we calculate the probability of winning series with lengths 1 through 99, we simply multiply by the prize amount for that series. We then select the series length that maximizes the expected winnings. In this case, a series of length 25, which requires 13 wins, will earn $870,000. The Acme Axegrinders will win a 25 game series 84.6% of the time, which translates to an expected value of **$736,222**.

<img class="img-fluid mx-auto d-block" src="src/assets/img/riddler-squishyball.png">
