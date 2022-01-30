---
title: Riddler Transmission
slug: riddler-transmission
date: "2022-01-28"
excerpt: asdf
tags: []
relatedPosts: []
status: published
---

# Introduction

<a href="https://fivethirtyeight.com/features/can-you-tune-up-the-truck/">Riddler</a>

<blockquote>
You want to change the transmission fluid in your old van, which holds 12 quarts of fluid. At the moment, all 12 quarts are “old.” But changing all 12 quarts at once carries a risk of transmission failure.

Instead, you decide to replace the fluid a little bit at a time. Each month, you remove one quart of old fluid, add one quart of fresh fluid and then drive the van to thoroughly mix up the fluid. (I have no idea if this is mechanically sound, but I’ll take Travis’s word on this!) Unfortunately, after precisely one year of use, what was once fresh transmission fluid officially turns “old.”

You keep up this process for many, many years. One day, immediately after replacing a quart of fluid, you decide to check your transmission. What percent of the fluid is old?

</blockquote>

# Solution

<strong>This process will eventually result in 35.2% of the transmission fluid being "old".</strong> In fact, this will happen after just 12 months, and the transmission will reach a steady state, where this ratio never changes, provided we continue to replace one liter of fluid each month.

I first solved this problem by writing several functions in Python to model the process. We can model the transmission as an array of values representing the amount of oil of each age. This array will have 13 values, for ages 0, 1, 2, ..., 11 months, and a final value for oil that is "old" - at least 12 months in age. Each of the steps of removing oil, refilling oil, and moving us forward in time are handled by separate functions. Finally, we compose the functions together and repeat the process in a loop until we reach the steady state.

The `simulate` function returns the array of transmission fluid ages after a number of months. Here, we simulate 100 months.

```python
>>> simulate(months=100)
[1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.50, 0.46, 0.42, 0.38, 4.22]
```

This array shows us that we have 1.0 liter of fluid that is brand new, represented by the first element in the array. We have 0.92 liters of fluid that is one month old, and 4.22 liters of fluid that is at least 12 months old. The total amount of fluid stays a constant 12.0 liters, so we know the proportion of "old" fluid is 4.22 / 12, or 35.2%.

Of course, we only reach this steady state after a number of times repeating this process. But how many times? The output below shows that we reach the steady state after just 12 months of the process, which is faster than I would have guessed before starting the problem. (We know we've reached a steady state after 12 months because the 13th month produces the same array as the 12th month.)

```
 0: [0.0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 12.0]
 1: [1.0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 11.0]
 2: [1.0, 0.92, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10.1]
 3: [1.0, 0.92, 0.84, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 9.24]
 4: [1.0, 0.92, 0.84, 0.77, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 8.47]
 5: [1.0, 0.92, 0.84, 0.77, 0.71, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 7.77]
 6: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 7.12]
 7: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.00, 0.00, 0.00, 0.00, 0.00, 6.53]
 8: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.00, 0.00, 0.00, 0.00, 5.98]
 9: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.50, 0.00, 0.00, 0.00, 5.48]
10: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.50, 0.46, 0.00, 0.00, 5.03]
11: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.50, 0.46, 0.42, 0.00, 4.61]
12: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.50, 0.46, 0.42, 0.38, 4.22]
13: [1.0, 0.92, 0.84, 0.77, 0.71, 0.65, 0.59, 0.54, 0.50, 0.46, 0.42, 0.38, 4.22]
```

# Observations

One thing I observed about this problem is that the series of numbers appears to follow a pattern: $(\frac{11}{12})^{i}$ for values of $i$ starting at zero. This makes sense: because we remove oil proportionally from all ages, the value of the oil at each timestep is $\frac{11}{12}$ of its prior value. The only difference is that the problem lumps all oil greater than 12 months into a single bucket, rather than tracking the exact age of each liter. But if we remove this constraint, and instead track the age of all liters exactly, then we would get the infinite series of $(\frac{11}{12})^{i}$. Therefore, another way of answering this problem is to solve the following equation, which tells us the amount of oil at least 12 months old.

$$
\sum_{i=12}^{\infty} (\frac{11}{12})^i
$$

The sum of this infinite series when $i$ starts at 0 is $\frac{1}{1 - \frac{11}{12}} = 12$. So to solve for the sum when $i$ starts at 12, we subtract the values from 0 to 11. In python, this can be done with a list comprehension:

```python
>>> sum((11 / 12) ** x for x in range(12))
7.776052463830353
```

This represents the amount of fluid that is less than 12 months old. If we want to know the proportion of fluid at least 12 months old, we can extend this code as shown below, and we calculate 35.2% as before.

```python
>>> (12 - sum((11 / 12) ** x for x in range(12))) / 12
0.35199562801413725
```

# Full Code

I enjoyed writing a functional, pure-Python approach to this problem. This style of code uses "pure functions" that have no side effects: they don't affect global state, and they don't mutate the input values, and they are "idempotent": the same inputs will always produce the same outputs, no matter how many times we run the functions.

Other approaches, like using vectors and matrices from `numpy` would also work here, or we could get fancy with other array-based structures like the `deque` from <a href="https://docs.python.org/3/library/collections.html#collections.deque">Python's standard library</a>. But part of developing is knowing when enough is enough, and this code does the job just fine.

```python
from typing import List


def initialize(liters: float = 12.0, cutoff: int = 12) -> List[float]:
    """Return the initial array, given a starting size and cutoff for 'old'."""
    # return a list with [0.0, 0.0, 0.0, ..., liters]
    return [0.0] * cutoff + [liters]


def remove(transmission: List[float], liters: float = 1.0) -> List[float]:
    """Remove some amount of fluid from the transmission proportionally."""
    total = sum(transmission)
    return [x * (1 - liters / total) for x in transmission]


def shift(transmission: List[float], step: int = 1) -> List[float]:
    """Shift the transmission array by a number of steps to the right."""
    step = min(step, len(transmission))
    out = [0.0] * step + transmission[:-step]
    out[-1] += sum(transmission[-step:])
    return out


def refill(transmission: List[float], liters: float = 1.0) -> List[float]:
    """Refill the transmission with some amount of fluid."""
    return [x + liters if i == 0 else x for i, x in enumerate(transmission)]


def simulate(
    months: int, initial: float = 12.0, replace: float = 1.0, step: int = 1
) -> List[float]:
    """Simulate a number of months of removing/refilling transmission fluid."""
    t = initialize(initial)
    for _ in range(months):
        t = refill(shift(remove(t, replace), step), replace)
    return t
```
