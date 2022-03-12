---
title: Riddler Dice
slug: riddler-dice
date: "2022-03-11"
excerpt: I followed a winding path to solve this week's Riddler. First, I was convinced it was easy; then, I discovered some hidden complexity; finally, I realized there is much more under the surface!
tags: ["puzzles", "Python"]
relatedPosts: []
status: published
---

# Introduction

I followed a winding path to solve this week's <a href="https://fivethirtyeight.com/features/can-you-score-some-basketball-tickets/">Riddler</a>. First, I was convinced it was easy; then, I discovered some hidden complexity; finally, I realized there is much more under the surface!

I even started writing this blog post with my first (incorrect) solution before I realized I missed some key details and had the wrong answer. The win rate I calculated was far too low. I went back to correct my mistakes, did a bit of extra work, and got a better result. Then, just to be sure, I tried a more exhaustive solution and realized I could improve the strategy even further. Every time I tried a new approach I appreciated the subtle, hidden complexity of this week's puzzle, and it is certainly one of my favorite Riddler's in recent memory.

As usual, I'll start with the solution and then dive deeper into my problem-solving approach. But this time I won't hide any of the wrong turns and false starts I had along the way. I hope you enjoy it! Here's the problem statement.

<blockquote>
We’re playing a game where you have to pick four whole numbers. Then I will roll four fair dice. If any two of the dice add up to any one of the numbers you picked, then you win! Otherwise, you lose.

For example, suppose you picked the numbers 2, 3, 4 and 12, and the four dice came up 1, 2, 4 and 5. Then you’d win, because two of the dice (1 and 2) add up to at least one of the numbers you picked (3).

To maximize your chances of winning, which four numbers should you pick? And what are your chances of winning?

</blockquote>

# Solution

<strong>We can maximize our odds of winning by choosing the numbers 4, 6, 8, and 10. This strategy wins 97.53% of all games.</strong>

We can prove this is the best strategy by running a brute force search against all sets of four numbers we could pick, evaluating their performance against all rolls we could see, and tallying the results. But before we get to that, let me take you down the winding path of wrong turns I took first.

## Approach 1: It can't be this easy, right?

At first, I was excited to solve this problem not because it was hard, but because I thought it was a great opportunity to use some of Python's excellent standard library functions. I knew I wanted to iterate through all possible dice rolls, then count the number of pairwise sums created by each roll. Here was the process I followed:

1. Loop through every possible roll, from (1, 1, 1, 1) to (6, 6, 6, 6).
2. For each roll, calculate the unique pairwise sums of the dice.
3. Keep a running total of the pairwise sums we see across all the rolls.
4. Find the top four numbers, and divide by the total.

I iterated through a list of the 1296 possible rolls of 4 dice, calculated the pairwise sums, then counted the number of times each number showed up. For example, the number 7 appears in 834 rolls, the numbers 6 and 8 appear in 727 rolls each, and so on. In total, the numbers 2 through 12 showed up 3075 times across all the rolls. (There are 1296 rolls, but each roll can produce multiple pairwise sums.) Because the problem asked for the <em>best</em> four numbers, I took the top four numbers, added them up, and divided by 3075. I calculated $(834 + 727 + 727 + 580) / 3075 = 53.95%$.

I even wrote some nice code to do this, using powerful functions like `itertools.product`, `itertools.combinations`, and `collections.Counter`.

```python
from collections import Counter
import itertools
import typing


def main(n_dice: int = 4) -> typing.Counter:
    """Return the most common pairwise-sums from a number of dice."""
    # set up an empty Counter object, then loop through all the possible dice
    # rolls we can have. For each roll, calculate the pairwise sums from each
    # pair of dice. Then add the results from that roll to the running total.
    counter = Counter()
    rolls = itertools.product(range(1, 7), repeat=n_dice)
    for roll in rolls:
        pairwise_sums = {sum(pair) for pair in itertools.combinations(roll, 2)}
        counter += Counter(pairwise_sums)
    return counter
```

<aside class="remark">
One of my favorite parts about this code is that it makes use of the fact that `Counter` objects can be added together! This means we can count all the pairwise sums from each roll, then sum each of those counters into a running total counter that we return at the end of the loop. Even though this isn't the correct solution to the problem, I had a fun time using these powerful Python standard library tools!
</aside>

I got my answer and started writing this post, thinking the whole time: "It can't be this easy, right?" I'm never 100% sure I've actually solved a Riddler until the next week when I read the solution, but I usually try to validate my answer using a different approach to see if I missed anything. In this case, it turns out I had.

## Let's just double check that...

The first thing that I knew I needed to justify was my choice of denominator: 3075. I knew there were 1296 possible rolls, and 3075 was the total of all the pairwise sums produced from all the rolls. Each roll was equally likely, but it didn't seem quite right that I was dividing by the total of <em>pairwise sums</em> rather than the <em>number of rolls</em>.

To chase this down further I created a list of all the rolls and their pairwise sums in Python. I often use an interactive terminal, specifically iPython, when I'm exploring a problem for the first time.

```python
def pairwise_sums(*roll: int) -> Set[int]:
    """Return the sum of each pair of dice from a group of rolls."""
    return {sum(pair) for pair in itertools.combinations(roll, 2)}

rolls = itertools.product(range(1, 7), repeat=4)
targets = [pairwise_sums(*roll) for roll in rolls]
```

Now I had the list of the pairwise sum values from each of the 1296 rolls. I did a quick check to see how many of the values had a 7 in them, and then divided it by the total number of rolls.

```python
sum(7 in target for target in targets) / len(targets)
# 0.6435185185185185
```

That's strange... if there's a 7 in 64% of all the rolls, then my answer of 53% from earlier couldn't be right. If the <em>only</em> number I was allowed to pick was 7, then I should win 64% of the time. This was my first realization: I was double-counting numbers! There are cases where a 7 and an 8 would <em>both</em> be in the roll, so I can't just add thhose numbers together.

I also realized that I should have been thinking about how many of the 1296 rolls I could <em>eliminate</em> by choosing a 7. If 64% of the rolls had a 7 in them, then I should look at the remaining 36% of rolls and choose the number that shows up most often among those. I had it! I had uncovered the twist of this problem and was well on my way to a solution - or so I thought.

## Approach #2: Getting closer

I kept working with my list of pairwise sums, which I called "targets". I removed the 834 rolls that contained a 7, then counted the targets that showed up most in the remaining rolls. Unsurprisingly, the numbers 6 and 8 were at the top of the list. Of the remaining 462 rolls, 6 and 8 each showed up 249 times. So if I picked 7 and 6, I should cover $834 + 249 = 1083$ total cases, which was 83.6% of all rolls. I kept going with this approach, eliminating rolls by choosing the number that covered the most remaining occurrences, and I picked the top four values: 7, 6, 8, and 4.

After doing this, I realized I had used the wrong denominator, and oversimplified the problem. But my final group of four numbers was pretty close to what I had originally: instead of (7, 6, 8, 5), I got an answer of (7, 6, 8, 4). I also updated my win rate calculation. With 7, 6, 8, and 4, we should win in 1235 out of 1296 rolls, for a 95.3% win rate. Case closed!

(Almost.)

## Approach #3: It's a Riddler after all

I felt much better about my approach - after all I was predicting a 95% win rate - but I had a nagging feeling that I was still missing something. I had made some assumptions, like starting with the number 7 because it occurred the most often. Could I actually prove that was the best strategy? In problems like this, sometimes assumptions like that can be misleading. Sometimes, a group of "sub-optimal" choices can outperform what initially appears to be the intuitive, or "optimal" strategy.

I was reminded of <a href="https://youtu.be/LJS7Igvk6ZM">this scene from "A Beautiful Mind"</a>, when John Nash realizes that in game theory, a group making decisions together may produce better outcomes than individuals acting purely in their own self interests. Perhaps in this case, a group of numbers other than 7 might outperform a strategy that starts by choosing 7...

In this case, with a bit of digging, I realized that even though 7 appears in the most individual rolls, we can actually improve our win rate by choosing a group of other numbers.

<figure>
  <img src="/img/riddler-dice.png">
  <figcaption>The number 7 realizing it can be beaten by 4, 6, 8, and 10.</figcaption>
</figure>

## So how does it work?

To test my theory, I created a list of all possible groups of four numbers we could choose, from (2, 3, 4, 5) to (9, 10, 11, 12) and everything in between. I had code that would give me the `win_rate` of a group of numbers, so I looped through each of the groups, calculated their win rates, and returned a sorted list of results. Finally, I had written enough code and felt like I understood the problem well enough to trust my solution. Instead of assuming or using heuristics, I knew that this brute force approach left nothing up for discussion. It's hard to argue with an exhaustive search of all possibilities!

I created a Python dictionary where each key is a group of four numbers I could pick, and the value is the number of wins I would expect out of the 1296 total rolls. Here are the top 10 results:

```python
[((4, 6, 8, 10), (1264, 1296)),
 ((2, 6, 8, 10), (1246, 1296)),
 ((4, 6, 8, 12), (1246, 1296)),
 ((4, 6, 7, 9), (1238, 1296)),
 ((5, 7, 8, 10), (1238, 1296)),
 ((4, 7, 8, 9), (1236, 1296)),
 ((5, 6, 7, 10), (1236, 1296)),
 ((4, 6, 7, 8), (1235, 1296)),
 ((4, 6, 7, 10), (1235, 1296)),
 ((4, 7, 8, 10), (1235, 1296))]
```

Choosing (4, 6, 8, 10) is the clear best strategy, with a 97.53% win rate. This strategy uses a wider spread of numbers, ignoring the high concentration of wins we get from 7, in favor of covering more possible rolls. The result is a slight edge over my second approach.

After going through this process, the answer made sense. There is a high degree of overlap between the rolls that have 7 and the rolls that have 8. In fact, 478 rolls out of 1296 have <em>both</em> a 7 and an 8. So we can improve the spread of our guesses by choosing (4, 6, 8, 10), while still covering almost all the rolls we would have covered if we included the number 7.

It might go without saying, but the best part of solving Riddlers isn't always the answer itself, but the process used to get there. In this case, I went from, "this is too easy," to, "there's some subtle complexity here," and finally, "I learned more than I expected to!" And it's hard to ask much more from a puzzle!

# Full Code

All my work was done in Python, mostly in an interpreter as I tried different ideas. But I kept coming back to a few core functions, still making use of the Python standard library: `itertools` in particular. The code below reproduces the sorted dictionary above.

```python
"""
Solving the Riddler Classic from March 11, 2022.
https://fivethirtyeight.com/features/can-you-score-some-basketball-tickets/
"""
import itertools
from typing import Dict, Set, Tuple


def pairwise_sums(*roll: int) -> Set[int]:
    """Return the sum of each pair of dice from a group of rolls."""
    return {sum(pair) for pair in itertools.combinations(roll, 2)}


def win_rate(*numbers: int) -> Tuple[int, int]:
    """Return the win rate of a group of numbers from 2-12."""
    rolls = itertools.product(range(1, 7), repeat=4)
    targets = (pairwise_sums(*roll) for roll in rolls)
    candidates = set(numbers)
    wins = [not candidates.isdisjoint(target) for target in targets]
    return sum(wins), len(wins)


def main() -> Dict[Tuple[int, int, int, int], Tuple[int, int]]:
    """Return a sorted dict of results for each set of numbers we could pick."""
    # generate all the groups of four numbers we could pick, from (2, 3, 4, 5)
    # to (9, 10, 11, 12), making sure we don't have duplicate numbers.
    candidates = itertools.combinations(range(2, 13), 4)

    # create a dictionary with <candidate>: <win_rate>, then return
    return {candidate: win_rate(*candidate) for candidate in candidates}


if __name__ == "__main__":
    print(sorted(main().items(), key=lambda x: x[1], reverse=True)[:10])
```
