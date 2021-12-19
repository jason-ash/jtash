---
title: Riddler Unstable Dice
slug: riddler-unstable-dice
date: "2020-03-27"
excerpt: Rolling and re-rolling dice is our task for this week's Riddler Classic. Each time we roll, we replace the sides of the dice with the values of our previous roll. This makes for a tricky probability space, but a very fun Python class to write and some markov chain analysis to crunch in order to solve it.
status: published
---

# Introduction

Rolling and re-rolling dice is our task for this week's <a href="https://fivethirtyeight.com/features/can-you-get-the-gloves-out-of-the-box/">Riddler Classic</a>. Each time we roll, we replace the sides of the dice with the values of our previous roll. This makes for a tricky probability space, but a very fun Python class to write and some markov chain analysis to crunch in order to solve it. Here's the full prompt.

<blockquote>
You start with a fair 6-sided die and roll it six times, recording the results of each roll. You then write these numbers on the six faces of another, unlabeled fair die. For example, if your six rolls were 3, 5, 3, 6, 1 and 2, then your second die wouldn’t have a 4 on it; instead, it would have two 3s.
<br><br>
Next, you roll this second die six times. You take those six numbers and write them on the faces of yet another fair die, and you continue this process of generating a new die from the previous one.
<br><br>
Eventually, you’ll have a die with the same number on all six faces. What is the average number of rolls it will take to reach this state?
<br><br>
<strong>Extra credit:</strong> Instead of a standard 6-sided die, suppose you have an N-sided die, whose sides are numbered from 1 to N. What is the average number of rolls it would take until all N sides show the same number?
</blockquote>

# Solution

**In the game starting with a fair, six-sided die, it takes an average of 9.66 rolls to reach a single number on all sides.**

| Sides | Expected Rolls |
| :---- | :------------- |
| 2     | 2.0            |
| 3     | 3.85714        |
| 4     | 5.77931        |
| 5     | 7.71198        |
| 6     | 9.65599        |
| 7     | 11.60815       |
| 8     | 13.56629       |
| 9     | 15.52909       |

While I haven't explicitly derived a formula for an $N$-sided dice, it feels reasonable to speculate that the pattern of "two extra turns per additional side of the dice" could continue for some time, though it likely falls off in magnitude as we increase the number of sides substantially. I'll have to save the formal analysis for another time.

# Methodology

Starting with a six-sided dice is computationally difficult, but solvable. The key challenge is calculating the many combinations of probabilities for the intermediate positions of the game. For example, when we start with a standard dice, we could end up with over 46,000 different roll permutations! Of course, many of those permutations can be treated the same for the sake of our game (e.g. [3, 3, 4, 4, 5, 5] is the same as [5, 4, 3, 3, 4, 5]), but grouping the probabilities is not easy.

The workhorse of this week's puzzle is the <a href="https://en.wikipedia.org/wiki/Multinomial_distribution">Multinomial Distribution</a>. The Multinomial Distribution lets us calculate the probability of various combinations of observed dice throws. For example, it can tell us the probability of observing $x_1$ ones, $x_2$ twos, $x_3$ threes, and so on, from six throws of a standard dice.

In a fairly simple case, suppose we have thrown the dice several times and now have two numbers remaining. Suppose those numbers are one and six, and we have 2 ones and 4 sixes on the sides of the dice. We can use the Multinomial Distribution to tell us the likelihood of observing different combinations of throws. In python, we use it like this.

```python
from scipy.stats import multinomial

# a six-sided dice with 2 ones and 4 sixes on the sides
# n is the number of sides; p is the probability of each number being rolled
dice = multinomial(n=6, p=[2/6, 4/6])

# what is the probability of rolling 6 sixes? Use the probability mass function
dice.pmf([0, 6])  # 0.08779149519890264

# what about rolling 6 ones?
dice.pmf([6, 0])  # 0.0013717421124828531

# what about rolling 4 ones and 2 sixes?
dice.pmf([4, 2])  # 0.0823045267489711
```

What we learn from this is that with this dice, we win the game roughly 9% of the time in one more turn. This represents the probability of rolling all 6 sixes plus the probability of rolling all six ones. Otherwise, we continue the game with the new number of ones and sixes according to our roll.

To make this easier, I wrote a class in Python called `Dice`, that handles all the probability calculations behind the scenes. A new game is started by creating a `Dice` with six sides, where each value on the sides shows up once:

```python
# create a six-sided dice with one of each number
Dice([1, 1, 1, 1, 1, 1])

# or we could create a six sided dice with 2 ones and 4 sixes, like before
# the actual numbers don't matter - what matters is the number of unique values
Dice([2, 4])

# we can calculate the probability of moving from one Dice to another easily
Dice([2, 4]).transition_vector()
# output is below, where Dice([1, 5]) is added to Dice([5, 1]) for simplicity
# {<Dice(6,)>: 0.0891632373113855,
#  <Dice(1, 5)>: 0.2798353909465022,
#  <Dice(2, 4)>: 0.4115226337448561,
#  <Dice(3, 3)>: 0.2194787379972568}

# we can also calculate the number of steps expected before the game ends
Dice([4, 2]).expected_value()
# we expect to have to roll 6.58 more times before the game ends
# 6.584840446909428
```

Ultimately, to answer the question for a six-sided Dice, we use just one line:

```python
>>> Dice([1, 1, 1, 1, 1, 1]).expected_value()
9.655991483885606
```

# Full Code

Quite a bit of code for this week's solution. We have a utility function, `multinomial_domain` that lists all the possible permutations of dice rolls we could see. But the heavy lifting is done by the `Dice` class, which has methods for calculating roll probabilities, state transitions, a complete directed graph of nodes and edges, a transition matrix, and ultimately an `expected_value` method, which returns the number of expected rolls to end the game.

At this point, the code works well for small dice, but for anything more than 10 sides, the brute force nature of calculating probabilities breaks down.

```python
"""
Solution to the Riddler Classic from March 27, 2020
https://fivethirtyeight.com/features/can-you-get-the-gloves-out-of-the-box/
"""
from typing import Iterator, List, Tuple, Union
import networkx as nx
import numpy as np
from scipy.stats import multinomial


def multinomial_domain(n: int, k: int) -> Iterator[list]:
    """
    Yields all lists of length `k` whose values sum to `n`. This comprises the
    entire domain space of the multinomial distribution. For example, if we have
    n=2 and k=3, we want to generate all lists of length 3 with values that sum
    to 2, including all permutations which is
    [[0, 0, 2], [0, 1, 1], [0, 2, 0], [1, 0, 1], [1, 1, 0], [2, 0, 0]]

    Parameters
    ----------
    n : int, the number of multinomial trials to run
    k : int, the number of categories that could be chosen for each trial

    Yields
    ------
    x : a list of integers

    Examples
    --------
    >>> list(multinomial_domain(n=2, k=3))
    [[0, 0, 2], [0, 1, 1], [0, 2, 0], [1, 0, 1], [1, 1, 0], [2, 0, 0]]

    >>> list(multinomial_domain(n=6, k=2))
    [[0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1], [6, 0]]
    """
    # we solve this recursively, so if we have only one slot remaining, then we
    # fill it with whatever value is left. Otherwise, we loop backwards through
    # all permutations calling this function to fill lists of smaller sizes
    if k == 1:
        yield [n]
    else:
        for value in range(n + 1):
            for permutation in multinomial_domain(n - value, k - 1):
                yield [value] + permutation


class Dice:
    """
    Models an n-sided dice for the purposes of solving the Riddler Classic.

    We construct a dice by specifying the number of unique values written on the
    sides. For example, if we call Dice([1, 1, 1, 1, 1, 1]), then it means we
    have a dice with six sides and each side has a unique value. Dice([2, 2, 2])
    also represents a six-sided dice, but with only three unique values.

    We track the number of unique values rather than the values themselves
    because it lets us calculate transition probabilities from one state to the
    next. A transition probability tells us the probability that we end up with
    a Dice with X unique values, given that we start with a Dice with Y uniques.

    Behind the scenes we model this dice using a multinomial distribution, where
    each side of the dice has an equal likelihood (but each value's probability
    is in proportion to the number of occurrences on the sides of the dice.)

    For example, suppose we have a standard 6-sided Dice. We create a new Dice
    instance by calling `Dice([1, 1, 1, 1, 1, 1])`. We want to solve for the
    expected number of throws until the Dice only has one unique value remaining
    which is a Dice([6]) instance.

    We call `Dice([1, 1, 1, 1, 1, 1]).expected_value()`, which gives the result
    of 9.655991483885606, meaning it takes 9.66 turns on average to reach the
    end of the game.

    Parameters
    ----------
    uniques : Tuple[int, ...] a tuple containing the number of unique values on
        the sides of the dice. The sum of the values in `uniques` should match
        the number of sides of the dice. For example, a six-sided dice with the
        values [1, 2, 2, 4, 5, 5] would be passed as uniques=(1, 1, 2, 2)

    Examples
    --------
    >>> # unique values are sorted and zeros are dropped upon instantiation
    >>> Dice([2, 1, 2, 1, 0, 0]).uniques
    (1, 1, 2, 2)

    >>> # two dice with the same unique sides are equal
    >>> a = Dice([1, 1, 2, 0, 1])
    >>> b = Dice([0, 2, 1, 1, 1])
    >>> a == b
    True

    >>> Dice([1, 1, 1, 1, 1, 1]).expected_value()
    9.655991483885606
    """

    def __init__(self, uniques: Union[List[int], Tuple[int, ...]]):
        self.uniques = tuple(sorted(u for u in uniques if u > 0))
        self.total_sides = sum(self.uniques)
        self.unique_sides = len(self.uniques)
        self.distribution = multinomial(
            n=self.total_sides, p=[u / self.total_sides for u in self.uniques]
        )

    def __eq__(self, other) -> bool:
        """Ensure that two Dice with the same sorted unique sides are equal"""
        return self.uniques == other.uniques

    def __lt__(self, other) -> bool:
        """Sort Dice objects by their `uniques` tuple values"""
        return self.uniques < other.uniques

    def __hash__(self) -> int:
        """
        The Dice hash is the same as the hash for the uniques tuple. We need to
        define the hash for this object so it can be used as a dictionary key.
        """
        return hash(self.uniques)

    def __repr__(self) -> str:
        """String representation of the Dice object"""
        return f"<Dice{self.uniques}>"

    def domain_permutations(self) -> Iterator[list]:
        """
        Yields all permutations of the domain of this dice. For example, suppose
        we have a six-sided dice with only two numbers left. We yield all valid
        orderings of the rolls we could get
        """
        return multinomial_domain(n=self.total_sides, k=self.unique_sides)

    def domain(self) -> set:
        """
        Returns a set of sorted tuples that fully describe the possibility space
        of rolling the Dice. For example, if we have a six-sided Dice with two
        unique values on the sides, then the domain set is all permutations of
        the numbers we could roll. We return Dice objects for each possibility.

        Examples
        --------
        >>> # a dice with two unique sides and six sides total
        >>> Dice((2, 4)).domain()
        {<Dice(1, 5)>, <Dice(3, 3)>, <Dice(6,)>, <Dice(2, 4)>}
        """
        return {Dice(p) for p in self.domain_permutations()}

    def transition_vector(self) -> dict:
        """
        Returns a dictionary of the domain set and the transition probabilities
        to each one. Keys are Dice objects, and values are floats that sum to 1.

        Examples
        --------
        >>> # a dice with two unique sides and six sides total
        >>> vector = Dice((2, 4)).transition_vector()
        >>> for key, probability in vector.items():
        ...     print(f"{key}: {probability:.6f}")
        <Dice(6,)>: 0.089163
        <Dice(1, 5)>: 0.279835
        <Dice(2, 4)>: 0.411523
        <Dice(3, 3)>: 0.219479
        """
        vector: dict = {}
        for p in self.domain_permutations():
            key = Dice(p)
            vector[key] = vector.get(key, 0.0) + self.distribution.pmf(p)
        return vector

    def graph(self) -> nx.DiGraph:
        """
        Returns a directed graph mapping the transition from each Dice object to
        other Dice objects. Edge weights are transition probabilities.
        """
        def _graph(dice) -> nx.DiGraph:
            G = nx.DiGraph()
            for new_state, probability in dice.transition_vector().items():
                G.add_edge(dice, new_state, weight=probability)
            return G

        G = nx.DiGraph()
        for new_state in self.transition_vector():
            G = nx.compose(G, _graph(new_state))

        return G

    def transition_matrix(self) -> Tuple[np.array, list]:
        """
        Returns a square transition matrix that defines transition probabilities
        from each Dice to each other dice. The matrix is sorted from high unique
        values to low unique values, meaning the right-most column is the ending
        state. Rows sum to one. Also returns the node index as an array.

        Examples
        --------
        >>> values, idx = Dice((3, 3)).transition_matrix()
        >>> values
        array([[0.40252058, 0.20897634, 0.05358368, 0.33491941],
               [0.27983539, 0.41152263, 0.21947874, 0.08916324],
               [0.1875    , 0.46875   , 0.3125    , 0.03125   ],
               [0.        , 0.        , 0.        , 1.        ]])
        >>> idx
        [<Dice(1, 5)>, <Dice(2, 4)>, <Dice(3, 3)>, <Dice(6,)>]
        """
        G = self.graph()
        nodelist = sorted(G.nodes)
        return nx.to_numpy_array(G, nodelist=nodelist), nodelist

    def expected_value(self) -> float:
        """
        Return the expected number of throws before all sides of this dice have
        the same value. Uses the Dice's directed graph to perform a markov chain
        analysis of the time it takes to reach the end of the game.

        Examples
        --------
        >>> Dice((1, 1, 1, 1, 1, 1)).expected_value()
        9.655991483885606

        >>> Dice((1, 5)).expected_value()
        4.623000562655744

        >>> Dice((2, 4)).expected_value()
        6.584840446909428

        >>> Dice((3, 3)).expected_value()
        7.205027730889816
        """
        if self.unique_sides == 1:
            return 0.0

        # here we solve the expected number of rolls to end with a single-value
        # dice using a transition matrix and some linear algebra
        M, nodelist = self.transition_matrix()
        results = np.linalg.inv(np.eye(len(M) - 1) - M[:-1, :-1]).sum(1)
        return results[nodelist.index(self)]


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```
