---
title: Riddler Dungeon Dice
slug: riddler-dungeon-dice
date: 2020-05-15
excerpt: This week's Riddler asks us to determine the best dice-rolling strategy for our weekly Dungeons and Dragons game. With the option to roll once, or roll multiple times with various combinations of maximums and minimums, how can we optimize the odds of rolling the number we want?
status: draft
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/can-you-find-the-best-dungeons-dragons-strategy/">Riddler</a> asks us to determine the best dice-rolling strategy for our weekly Dungeons and Dragons game. With the option to roll once, or roll multiple times with various combinations of maximums and minimums, how can we optimize the odds of rolling the number we want?

<blockquote>
The fifth edition of Dungeons & Dragons introduced a system of “advantage and disadvantage.” When you roll a die “with advantage,” you roll the die twice and keep the higher result. Rolling “with disadvantage” is similar, except you keep the lower result instead. The rules further specify that when a player rolls with both advantage and disadvantage, they cancel out, and the player rolls a single die. Yawn!
<br><br>
There are two other, more mathematically interesting ways that advantage and disadvantage could be combined. First, you could have “advantage of disadvantage,” meaning you roll twice with disadvantage and then keep the higher result. Or, you could have “disadvantage of advantage,” meaning you roll twice with advantage and then keep the lower result. With a fair 20-sided die, which situation produces the highest expected roll: advantage of disadvantage, disadvantage of advantage or rolling a single die?
<br><br>
Extra Credit: Instead of maximizing your expected roll, suppose you need to roll N or better with your 20-sided die. For each value of N, is it better to use advantage of disadvantage, disadvantage of advantage or rolling a single die?
</blockquote>

# Solution

There are a few questions we have to answer this week. First, which of the three rolls produces the highest expected value? Rolling "disadvantage of advantage" produces an expected roll of 11.17 - the highest among our three options. Here, we roll 4 dice, taking the maximum of each group of two, then the minimum of those results.

For the extra credit, it is easiest to view the results in a table. Below, the bold number in each row represents the highest odds of rolling at least that value. If we're trying to roll 14 or more, we should choose a single dice. Otherwise, we should choose the "disadvantage of advantage" technique.

| Metric             | Single Roll | Advantage of Disadvantage | Disadvantage of Advantage |
| :----------------- | ----------: | ------------------------: | ------------------------: |
| Expected Value     |        10.5 |                 9.8333375 |            **11.1666625** |
| Roll 1 or greater  |        100% |                      100% |                  **100%** |
| Roll 2 or greater  |         95% |                     99.0% |                 **99.5%** |
| Roll 3 or greater  |         90% |                     96.4% |                 **98.0%** |
| Roll 4 or greater  |         85% |                     92.3% |                 **95.6%** |
| Roll 5 or greater  |         80% |                     87.0% |                 **92.2%** |
| Roll 6 or greater  |         75% |                     80.9% |                 **87.9%** |
| Roll 7 or greater  |         70% |                     74.0% |                 **82.8%** |
| Roll 8 or greater  |         65% |                     66.6% |                 **77.0%** |
| Roll 9 or greater  |         60% |                     59.0% |                 **70.1%** |
| Roll 10 or greater |         55% |                     51.3% |                 **63.6%** |
| Roll 11 or greater |         50% |                     43.8% |                 **56.3%** |
| Roll 12 or greater |         45% |                     36.4% |                 **48.7%** |
| Roll 13 or greater |         40% |                     29.4% |                 **41.0%** |
| Roll 14 or greater |     **35%** |                     23.0% |                     33.4% |
| Roll 15 or greater |     **30%** |                     17.2% |                     26.0% |
| Roll 16 or greater |     **25%** |                     12.1% |                     19.1% |
| Roll 17 or greater |     **20%** |                      7.8% |                     13.0% |
| Roll 18 or greater |     **15%** |                      4.4% |                      7.7% |
| Roll 19 or greater |     **10%** |                      2.0% |                      3.6% |
| Roll 20 or greater |      **5%** |                      0.5% |                      1.0% |

We can also visualize these results. The first chart shows the probability mass function - the probability of rolling exactly N. Each of the sub-charts' bars sums to 100%. We would use this chart to select the type of roll that gives us the best chance of rolling exactly N.

<img class="img-fluid mx-auto d-block" src="../images/20200515-riddler1.png">

And for the extra credit, we can visualize the probability of rolling at least N. Each sub-chart starts at 100%, because a roll is guaranteed to produce at least 1. Then each type of roll decreases from there, with the curves differing slightly by the type of roll. For situations where we need a number of 14 or above, we should roll a single dice for the best odds. Otherwise, we should roll "disadvantage of advantage".

<img class="img-fluid mx-auto d-block" src="../images/20200515-riddler2.png">

# Methodology

There are lots of ways to solve this week's Riddler. I used python, but pen and paper, spreadsheets, or other software would work just as well. Here are a few functions that I used.

```python
from itertools import groupby, product


# here is an example of calculating the "advantage" roll. We simulate all
# combinations of rolls: (1, 1), (1, 2), ..., (20, 19), (20, 20), then we
# calculate the outcome by taking the maximum. We group the results by the
# outcomes and sum the occurrences of each. We get a result that looks like
# {1: 1, 2: 3, 3: 5, ..., 19: 37, 20: 39}.
advantage = (max(x) for x in product(range(1, 21), repeat=2))
advantage = {k: len(list(v)) for k, v in groupby(sorted(advantage))}


# here is an example of calculating the "disadvantage of advantage" roll,
# abbreviated as "d_upon_a". We simulate rolling four dice, taking the max
# of each group of two, then the min of those. As before, we group the
# results by the number we get, counting the number of occurrences. We get
# a result that looks like {1: 799, 2: 2385, ..., 19: 4255, 20: 1521}.
d_upon_a = (min(max(x[:2]), max(x[2:])) for x in product(range(1, 21), repeat=4))
d_upon_a = {k: len(list(v)) for k, v in groupby(sorted(d_upon_a))}


# then, given these dictionaries, we can calculate things like expected value.
# if we call >>> expected_value(advantage), it returns 13.825.
def expected_value(rolls: dict) -> float:
    """Returns the expected value of a dictionary of rolls"""
    return sum(k*v for k, v in rolls.items()) / sum(rolls.values())
```
