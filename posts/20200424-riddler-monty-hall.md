---
title: Riddler Monty Hall
slug: riddler-monty-hall
date: "2020-04-24"
excerpt: The original Monty Hall Show featured three doors, two goats, and a brand new car. Contestants choose a door, Monty reveals a goat behind another door, and contestants are offered the chance to switch their original choice. After heated debate among probability nerds, it was eventually agreed that switching is the optimal strategy, which wins two out of three games. In this week's Riddler, we examine a variation of this game in which the number of goats is random. Does it change the decision to switch?
status: published
---

# Introduction

The original Monty Hall Show featured three doors, two goats, and a brand new car. Contestants choose a door, Monty reveals a goat behind another door, and contestants are offered the chance to switch their original choice. After <a href="https://priceonomics.com/the-time-everyone-corrected-the-worlds-smartest/">heated debate</a> among probability nerds, it was eventually agreed that switching is the optimal strategy, which wins two out of three games. In this week's <a href="https://fivethirtyeight.com/features/can-you-beat-the-goat-monty-hall-problem/">Riddler</a>, we examine a variation of this game in which the number of goats is random. Does it change the decision to switch? Here is the full problem text.

<blockquote>
The Monty Hall problem is a classic case of conditional probability. In the original problem, there are three doors, two of which have goats behind them, while the third has a prize. You pick one of the doors, and then Monty (who knows in advance which door has the prize) will always open another door, revealing a goat behind it. It’s then up to you to choose whether to stay with your initial guess or to switch to the remaining door. Your best bet is to switch doors, in which case you will win the prize two-thirds of the time.
<br><br>
Now suppose Monty changes the rules. First, he will randomly pick a number of goats to put behind the doors: zero, one, two or three, each with a 25 percent chance. After the number of goats is chosen, they are assigned to the doors at random, and each door has at most one goat. Any doors that don’t have a goat behind them have an identical prize behind them.
<br><br>
At this point, you choose a door. If Monty is able to open another door, revealing a goat, he will do so. But if no other doors have goats behind them, he will tell you that is the case.
<br><br>
It just so happens that when you play, Monty is able to open another door, revealing a goat behind it. Should you stay with your original selection or switch? And what are your chances of winning the prize?
</blockquote>

# Solution

As in the original Monty Hall problem, once the goat is revealed, **the optimal decision is to switch doors, leading to an expected win percentage of 50%.** Staying with our original door would result in an expected win percentage of 37.5%. In a fresh game, without the reveal of the goat, our odds of winning with a switching strategy are two thirds - the same as in the original game. However, once the first goat is revealed, we learn more about the game: in this case we've eliminated some favorable scenarios, notably the one where there are zero goats, so we must revise our expected win rate down.

# Methodology

This problem is concise enough to list all outcomes with their probabilities. The total probability in our table adds up to 100%, which ensures we counted all the possible scenarios. The outcome for a scenario, given our decision to switch or stay, is either a zero or a one - a loss or a win. Then the expected value of a given strategy is the product of the outcome and the probability summed over all scenarios. Here they are:

| # Goats | Original<br>Choice | Goat<br>Revealed?     | Switch<br>Value | Stay<br>Value | Probability |
| :------ | :----------------- | :-------------------- | :-------------- | :------------ | :---------- |
| 0       | 🚗                 | No                    | $1$             | $1$           | 25.0%       |
| 1       | 🚗                 | Yes                   | $1$             | $1$           | 16.6%       |
| 1       | 🐐                 | No                    | $1$             | $0$           | 8.3%        |
| 2       | 🚗                 | Yes                   | $0$             | $1$           | 8.3%        |
| 2       | 🐐                 | Yes                   | $1$             | $0$           | 16.6%       |
| 3       | 🐐                 | Yes                   | $0$             | $0$           | 25.0%       |
| &nbsp;  | &nbsp;             | **Expected<br>Value** | **66.6%**       | **50.0%**     | **100.0%**  |

This table tells us that the overall expected value of the switching strategy is 66.6%. This means if we switch doors, we win the prize two thirds of the time. If we stay with our original door, we win half the time. We get these expected values by multiplying the outcomes of each scenario with the probability of each scenario occurring.

However, that wasn't exactly what the question asked us. Instead, it asked how we should play, _given_ that a goat is revealed. As a result, we want to narrow our set of possible scenarios to only those in which a goat is revealed. We still use the table above, but we throw away the rows where "Goat Revealed" is "No". After we do that, our probabilities will no longer sum to 100%, but that's ok. What we're doing is taking a <a href="https://en.wikipedia.org/wiki/Conditional_probability">conditional probability</a>, which means we're interested in the scenarios where a certain condition has occurred: "goat revealed". Once we remove the scenarios we don't care about, we can rescale (or normalize) the probabilities, which means we we divide each one by the total of the remaining rows. After we do that, the new, scaled probabilities will sum to 100%.

Once we have the normalized probabilities, we can repeat the multiplication from before. We multiply the outcomes from switching and staying with the probability of each scenario, and we can answer the original question.

- Value of **Staying**, given a goat has been revealed: **37.5%**
- Value of **Switching**, given a goat has been revealed: **50.0%**

As we can see, the correct choice is still to switch doors, but our overall expected win percentage is lower. This is because we have eliminated the possibility of being in the "zero goat" universe, which would have been a guaranteed win. (<a href="https://xkcd.com/1282/">That is, of course, if you didn't want a goat to begin with...</a>)
