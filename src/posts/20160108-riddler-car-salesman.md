---
title: Riddler Car Salesman
slug: riddler-car-salesman
date: 2016-01-08
excerpt: Just the code for this week's Riddler. Work in Progress.
status: draft
---

# Full Code

```python
import doctest
from functools import lru_cache
from itertools import permutations

@lru_cache(maxsize=None)
def _unseen_cards(*seen, n_cards=5, units=100):
    """
    Returns all potential unseen cards, given a list of seen cards

    Parameters
    ----------
    seen : list of cards seen so far, e.g. 1000, 1200
    n_cards : int, number of total cards available, default 5
    units : int, the increments added to the base value, N

    Returns
    -------
    unseen : list of potential cards remaining, given what we
        know from the cards we've seen so far

    Examples
    --------
    >>> _unseen_cards(1000, 1200)
    [[800, 900, 1100], [900, 1100, 1300], [1100, 1300, 1400]]

    >>> _unseen_cards(1000, 1200, 1300)
    [[900, 1100], [1100, 1400]]

    >>> _unseen_cards(1000, 1400)
    [[1100, 1200, 1300]]

    >>> _unseen_cards(1000, 1100, 1300, 1200, 1400)
    [[]]
    """
    low, high = min(seen), max(seen)
    cards = [
        range(i + units, i + n_cards*units + 1, units)
        for i in range(high - n_cards*units, low, units)
    ]
    unseen = [
        [x for x in sublist if x not in seen]
        for sublist in cards
    ]
    return unseen

@lru_cache(maxsize=None)
def _unseen_expectation(*seen, n_cards=5, units=100):
    """
    >>> _unseen_expectation(1000, 1100, 1200, 800)
    900.0

    >>> _unseen_expectation(1000, 1100, 1200, 900)
    1050.0

    >>> _unseen_expectation(1000, 1100, 1200, 1300)
    1150.0

    >>> _unseen_expectation(1000, 1100, 1200, 1400)
    1300.0

    >>> _unseen_expectation(1000, 1100, 1200)
    1033.3333333333333

    >>> _unseen_expectation(1000, 1400)
    1100.0
    """
    unseen = _unseen_cards(*seen, n_cards=n_cards, units=units)
    if unseen == [[]]:
        return float(seen[-1])
    else:
        all_unseen = [x for y in unseen for x in y]
        paths = [
            min(c, _unseen_expectation(*seen, c, n_cards=n_cards, units=units))
            for c in all_unseen
        ]
        return sum(paths) / len(paths)

@lru_cache(maxsize=None)
def strategy(*seen, n_cards=5, units=100):
    """
    Returns 'continue' or 'stop' for a given card

    Examples
    --------
    >>> strategy(1000)
    'continue'

    >>> strategy(1000, 1400)
    'continue'

    >>> strategy(1400, 1000)
    'stop'
    """
    # continue if the future expectation is lower than the current card
    if seen[-1] > _unseen_expectation(*seen, n_cards=n_cards, units=units):
        return 'continue'
    else:
        return 'stop'

def model(*cards, units=100):
    """
    Return what we would pick from an ordered sequence of cards

    Examples
    --------
    >>> model(1400, 1000, 1100, 1200, 1300)
    1000

    >>> model(1400, 1200, 1100, 1300, 1000)
    1100

    >>> model(1400, 1100, 1000, 1200, 1300)
    1100

    >>> model(1000, 1100, 1300, 1200, 1400)
    1400
    """
    # run through cards one-by-one until we reach a stopping point
    for i, c in enumerate(cards):
        if strategy(*cards[:i+1], n_cards=len(cards), units=units) == 'stop':
            return c

def summary(n_cards, units=100):
    """Print the summary of overpayment in a game with n_cards"""
    cards = permutations(range(1000, n_cards*units+1000, units))
    results = [model(*c) for c in cards]
    results = sum(results) / len(results)
    return results - 1000


if __name__ == '__main__':
    doctest.testmod()

    for n in range(2, 8):
        print(f'{n:2} cards : {summary(n):6,.2f}')
```
