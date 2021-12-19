---
title: Riddler Spelling Hexagons
slug: riddler-spelling-hexagons
date: "2020-01-03"
excerpt: This week's Riddler Classic was a fun way to welcome the new year. We're asked to find seven letters that maximize the score from the New York Times Spelling Bee puzzle. I use pure Python (lists, sets, and dictionaries only) to find the optimum pool of seven words.
status: published
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/can-you-solve-the-vexing-vexillology/">Riddler Classic</a> was a fun way to welcome the new year. We're asked to find seven letters that maximize the score from the New York Times <a href="https://www.nytimes.com/puzzles/spelling-bee">Spelling Bee</a> puzzle. I use pure Python (lists, sets, and dictionaries only) to find the optimum pool of seven words.

> The New York Times recently launched some new word puzzles, one of which is <a href="https://www.nytimes.com/puzzles/spelling-bee">Spelling Bee</a>. In this game, seven letters are arranged in a honeycomb lattice, with one letter in the center.
> <br><br>
> The goal is to identify as many words that meet the following criteria:
>
> <ol>
> <li>The word must be at least four letters long.</li>
> <li>The word must include the central letter.</li>
> <li>The word cannot include any letter beyond the seven given letters.</li>
> </ol>
> Which seven-letter honeycomb results in the highest possible game score? To be a valid choice of seven letters, no letter can be repeated, it must not contain the letter S (that would be too easy) and there must be at least one pangram.

# Solution

Using a brute-force approach in Python, I found the seven letters **A, E, G, I, N, R, T**, with a center letter of **R**, which has the highest potential score of **3898**. Even enterprising wordsmiths among us will have a hard time finding all 537 valid words. The choice of **R** as the center letter matters quite a bit: if we changed the center letter to **G**, the maximum potential score would drop to **3095**.

# Methodology

There are at least two ways of approaching this problem, which I'll call the "bottoms-up" approach and the "top-down" approach.

- **Bottoms-up approach:** we assemble every valid seven-letter pool, then build word lists from them, summing the total score as we go. We aren't allowed to use the letter "s" for this Riddler, so we can choose $25\choose6$ combinations, which is 3,364,900 possibilities. This isn't impossible, but it's a daunting task.
- **Top-down approach:** we can narrow the field of valid seven-letter pools because we have the master word list. The rules state that we must be able to create at least one pangram, so we know the winning seven-letter pool must be found within at least one word on the list. It turns out there are 7,986 unique seven-letter pools represented by words in the list, which is a manageable list to check compared to the bottoms-up approach.

On my computer, in pure python, it takes roughly 4 seconds to check each seven-letter group, as well as to check all possible center letters for each group. The code below returns the top 10 groups of letters. Good luck to New York Times readers if any of these puzzles show up in the paper!

# Full Code

This week's post is shorter on text and longer on code. It was so fun to write, I hope it speaks for itself!

```python
from collections import namedtuple
from itertools import combinations
from typing import Sequence
from urllib.request import urlopen


def get_words() -> Sequence[str]:
    """Download and yield a sequence of valid words"""
    source = urlopen("https://norvig.com/ngrams/enable1.txt")
    for word in source:
        word = word.strip().decode("utf-8").lower()
        if "s" in word: continue
        if len(word) < 4: continue
        if len(set(word)) > 7: continue
        yield word


def word_score(word: str) -> int:
    """Return the score of a word"""
    if len(word) == 4:
        return 1
    return len(word) + 7 * (len(set(word)) == 7)


def get_letterset() -> dict:
    """Returns a dictionary of the sets of letters and their scores"""
    letterset = {}
    for word in get_words():
        key, score = frozenset(word), word_score(word)
        letterset[key] = letterset.get(key, 0) + score
    return letterset


class Puzzle(namedtuple('Puzzle', ('letters', 'center'))):

    letterset = get_letterset()
    pangrams = {x for x in letterset if len(x) == 7}

    @classmethod
    def max_scores(cls) -> dict:
        """Return all possible Puzzles and their maximum scores"""
        scores = {
            (pangram, center): Puzzle(pangram, center).score()
            for pangram in cls.pangrams for center in pangram
        }
        return sorted(scores.items(), key=lambda x: -x[1])

    def subsets(self) -> list:
        """Return a list of all sub-puzzles"""
        letters = frozenset(self.letters)
        for n in range(len(letters) + 1):
            for c in combinations(letters, n):
                if self.center in c:
                    yield frozenset(c)

    def score(self) -> int:
        """Returns the maximum possible score for this Puzzle"""
        return sum(
            self.letterset.get(subset, 0)
            for subset in self.subsets()
        )


if __name__ == "__main__":

    # print the top 10 highest-scoring puzzles
    results = Puzzle.max_scores()
    for result in results[:10]:
        print(result)
```
