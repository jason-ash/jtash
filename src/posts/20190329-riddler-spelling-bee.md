---
title: Riddler Spelling Bee
slug: riddler-spelling-bee
date: "2019-03-29"
excerpt: I have a distinct memory of participating in my elementary school's spelling bee when I was in second grade. I was the unlikely runner-up, even though I was competing against children in third and fourth grade. What was the secret to my over-performance? Not my natural spelling ability, but rather the rules of the game - a participant is eliminated from the spelling bee after failing to spell a word correctly, which means that going last is an advantage. I was lucky enough to be the near the tail-end of the participants in my spelling bee, which surely improved my final ranking. This week's Riddler asks us to quantify that advantage.
tags: ["puzzles", "python"]
status: published
---

# Introduction

I have a distinct memory of participating in my elementary school's spelling bee when I was in second grade. I was the unlikely runner-up, even though I was competing against children in third and fourth grade. (For what it's worth, I will never forget how to spell the word that ultimately bested me, "gingham".) What was the secret to my over-performance? Not my natural spelling ability, but rather the rules of the game: a participant is eliminated from the spelling bee after failing to spell a word correctly, which means that going last is an advantage. I was lucky enough to be the near the tail-end of the participants in my spelling bee, which surely improved my final ranking.

This week's riddler asks us to quantify the "going last" advantage. Fortunately we can solve it with python, which is perhaps easier than competing in a spelling bee itself. Here's the full question text:

<blockquote>
You are competing in a spelling bee alongside nine other contestants. You can each spell words perfectly from a certain portion of the dictionary but will misspell any word not in that portion of the book. Specifically, you have 99 percent of the dictionary down cold, and your opponents have 98 percent, 97 percent, 96 percent, and so on down to 90 percent memorized. The bee’s rules are simple: The contestants take turns spelling in some fixed order, which then restarts with the first surviving speller at the end of a round. Miss a word and you’re out, and the last speller standing wins. The bee words are chosen randomly from the dictionary.

First, say the contestants go in decreasing order of their knowledge, so that you go first. What are your chances of winning the spelling bee? Second, say the contestants go in increasing order of knowledge, so that you go last. What are your chances of winning now?

</blockquote>

# Problem Setup

As the problem states, we can identify participants by their probabilities of spelling words correctly. For example, we have a "99%" speller all the way through a "90%" speller. We'll organize the participants into numpy arrays, where we can sort from best to worst or worst to best.

```python
# best to worst
spellers = np.arange(99, 89, -1) / 100
# array([0.99, 0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.9 ])

# worst to best
spellers = np.arange(90, 100) / 100
# array([0.9 , 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99])
```

# Spelling Bee Simulation

Next, we need a way to simulate one round of the spelling bee. A 99% speller only misses 1% of the words she attempts. We can simulate this by drawing random numbers from 0 to 1. If the number is greater than 0.99, which occurs 1% of the time, then the participant is eliminated. Otherwise, she moves to the next round. We generate random numbers for each participant, keep the ones who spell correctly, and remove the others. Importantly, if every participant is eliminated during the round, we know that the final participant would have won, so we return this person instead of an empty array. Here's the function that implements this logic.

```python
def single_round(spellers):
    """
    Play a single round of the spelling bee; draw a random number for each speller,
    then compare the number vs. their rate. Each speller that answers correctly
    is retained in the array, while incorrect spellers are removed. Returns a new
    array of the spellers that advance to the next round.

    NOTE : if the function would return an empty array, (in the case that every speller
    failed to spell the word correctly) it instead returns the speller listed last in
    the original array, who would have won without having to spell a word.
    """
    r = np.random.rand(len(spellers))
    out = spellers[r < spellers]
    if len(out) > 0:
        return out
    else:
        return spellers[-1:]
```

To simulate the entire spelling bee, we'll run as many rounds as it takes to eliminate all but one participant.

```python
def bee(spellers):
    """
    Run a spelling bee with as many rounds as it takes to eliminate all but one
    speller.
    """
    while len(spellers) > 1:
        spellers = single_round(spellers)
    return spellers[0]
```

# Results

Now that we have the tools to simulate a single spelling bee, we're interested in the distribution of results for a large number of them. This will help us understand how much of an advantage it is to go last. Therefore, we run 1 million spelling bees in which participants are ordered from best to worst, and 1 million in which they are ordered from worst to best. We calculate the number of bees won by each participant under each ordering, and show the results below in a table. The numbers represent a participant's chance of winning a spelling bee under both sets of orderings.

The question asked us (as the fantastic 99% speller that we are) how our chances of winning change based on whether we go first or last. Unsurprisingly, we have a significant edge over our opponents, winning more than half of all simulated bees regardless of ordering. But if we want that extra edge, **going last will increase our chances of winning from 51.9% to 52.5%**.

| Speller  | Best to Worst | Worst to Best |    Change     |
| :------: | :-----------: | :-----------: | :-----------: |
| **0.90** |   0.004534    |   0.004140    |   0.000394    |
| **0.91** |   0.006646    |   0.006159    |   0.000487    |
| **0.92** |   0.009734    |   0.008977    |   0.000757    |
| **0.93** |   0.014766    |   0.013655    |   0.001111    |
| **0.94** |   0.022588    |   0.021717    |   0.000871    |
| **0.95** |   0.036309    |   0.035115    |   0.001194    |
| **0.96** |   0.060632    |   0.060064    |   0.000568    |
| **0.97** |   0.109423    |   0.108333    |   0.001090    |
| **0.98** |   0.215985    |   0.216553    |   -0.000568   |
| **0.99** | **0.519383**  | **0.525287**  | **-0.005904** |

# Reference: Full Python Code

```python
# -*- coding: utf-8 -*-
"""
Solves the fivethirtyeight Riddler Classic problem from March 29, 2019

Each speller is identified by their probability of spelling a word correctly,
such as "0.99" to represent a 99% correct speller. The program simulates a
large number of spelling bees and returns the winner of each bee.
"""
import numpy as np


def single_round(spellers):
    """
    Play a single round of the spelling bee; draw a random number for each speller,
    then compare the number vs. their rate. Each speller that answers correctly
    is retained in the array, while incorrect spellers are removed. Returns a new
    array of the spellers that advance to the next round.

    NOTE : if the function would return an empty array, (in the case that every speller
    failed to spell the word correctly) it instead returns the speller listed last in
    the original array, who would have won without having to spell a word.
    """
    r = np.random.rand(len(spellers))
    out = spellers[r < spellers]
    if len(out) > 0:
        return out
    else:
        return spellers[-1:]

def bee(spellers):
    """
    Run a spelling bee with as many rounds as it takes to eliminate all but one
    speller.
    """
    while len(spellers) > 1:
        spellers = single_round(spellers)
    return spellers[0]

def model(spellers, trials):
    """
    Run any number of spelling bees and return the winner for each one.
    Results returned as a numpy array.
    """
    return np.array([bee(spellers) for _ in range(trials)])

def summary(spellers, trials):
    """
    Return a dictionary with key=speller, value=wins from the simulated results

    NOTE : the order of "p" matters, because the last speller has an advantage
    each round. However, the results are shown after sorting the array from
    lowest to highest so that different orders of "p" can be compared easily.
    """
    results = model(spellers, trials)
    return {x: sum(results == x) / trials for x in np.sort(spellers)}

if __name__ == '__main__':

    # spellers arranged from best to worst
    spellers = np.arange(99, 89, -1) / 100
    print(summary(spellers, trials=1000000))

    # spellers arranged from worst to best
    spellers = np.arange(90, 100) / 100
    print(summary(spellers, trials=1000000))
```
