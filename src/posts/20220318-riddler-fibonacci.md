---
title: Riddler Fibonacci
slug: riddler-fibonacci
date: "2022-03-18"
excerpt: In this week's Riddler, I use Python to encode and decode numbers in Fibonacci-like sequences. In lieu of clever observations, I asked the computer to churn through possibilities until it found the best result.
tags: ["puzzles", "Python"]
relatedPosts: []
status: published
---

# Introduction

In this week's <a href="https://fivethirtyeight.com/features/is-it-anyones-birthday/">Riddler</a>, I use Python to encode and decode numbers in Fibonacci-like sequences. In lieu of clever observations, I asked the computer to churn through possibilities until it found the best result.

<blockquote>
A postal worker and his customer joke about the various ways the customer could mathematically encode her post office box number.

The customer realizes that every integer greater than 1 can be encoded via at least one Fibonacci-like sequence using an ordered triple (m, n, q). The encoded number is the qth member of the sequence after the first two positive integers m and n, where each term is the sum of the previous two terms. For example, 7 has the encodings (3, 4, 1) and (1, 3, 2).

In an attempt to stump the postal worker, the customer prefers encodings with a maximal value of q. What encoding should she use for the number 81?

<strong>Extra credit:</strong> What encoding should she use for the number 179?

</blockquote>

## First, a deeper dive into the encoding scheme

I needed to read the problem several times to understand exactly how this encoding scheme worked. In the end, I created a few more examples to make sure I was on the right track. Here is how I made sense of it.

We start by creating any Fibonacci-like sequence - that is, a sequence where any given term is equal to the sum of the prior two terms. We say Fibonacci-<em>like</em> because we can start with any two initial values, rather than the canonical (0, 1) of the Fibonacci sequence. Furthermore, we're limited to only positive numbers, so only ones or greater.

The encoding scheme specifies those two seed values as well as an index, q, which is the position of the integer in that sequence, using 1-based indexing.

```
# in this sequence, the number 13 could be encoded as:
# (1, 1, 5) or (1, 2, 4) or (2, 3, 3) or (3, 5, 2) or (5, 8, 1)
 n  m
 |  |
[1, 1]  2  3  5  8  13  21  34
        |  |  |  |   |   |   |
q -->   1  2  3  4   5   6   7


# it's also valid to have m < n, as shown below, where we can encode 11 as:
# (5, 3, 2), or (3, 8, 1)
 n  m
 |  |
[5, 3]  8  11
        |   |
q -->   1   2
```

Now that we have a better understanding of this encoding scheme, we can jump to the solution for the puzzle and the code I used to get there.

# Solution

Unfortunately I didn't have much insight to add to this week's puzzle. I'm not aware of an easy way to find the highest q-value encoding of an integer directly, so I simply generated all possible encodings for each target by looping through values of $n$ and $m$. This approach has $\mathcal{O}(n^2)$ time complexity, which doesn't scale well, but handles the small values of this puzzle just fine.

| Target | Max-q Encoding |
| ------ | -------------- |
| 81     | (3, 2, 7)      |
| 179    | (11, 7, 6)     |

Overall, I found 142 valid encodings for the number 81, but only one with a q-value of 7: (3, 2, 7). And I found 314 valid encodings of the number 179, where the highest q-value is 6: (11, 7, 6). Interestingly, both of these solutions take advantage of the fact that $m$ is permitted to be a lower number than $n$. It seems like this is a sneaky way of increasing the q-index by first dipping down before heading up (fast) forever, like in the normal Fibonacci sequence.

# Methodology

Once I understood the encoding scheme, I knew I ultimately needed a way to encode an arbitrary integer. For example, if I had the number 20, I could write many trivial encodings with q-values of 1, such as (1, 19, 1), (2, 18, 1), etc. But it wasn't immediately clear to me how I could generate higher q-value encodings, like its max encoding, (5, 1, 4). I could potentially work backwards, maybe using a dynamic programming approach, but it seemed simpler to loop through all possible values of $n$ and $m$ and choose the one with the highest q-value. After all, with target numbers less like 81 and 179, I would only need to check several thousand possibilities, which is easy for a computer.

To do this, I wrote a few helper functions. First, I wrote a Python generator that yields values from a Fibonacci-like sequence forever. Generators are useful here because they store the "recipe" of how to generate subsequent values in the sequence, without actually creating them until they are needed. Here is an example of yielding values from a sequence with $n=1$ and $m=2$.

```python
def fibonacci_sequence(n: int, m: int) -> Generator[int, None, None]:
    """Yield values in a Fibonacci-like sequence forever."""
    while True:
        yield n + m
        n, m = m, n + m


sequence = fibonacci_sequence(n=1, m=2)
next(sequence)  # 3
next(sequence)  # 5
next(sequence)  # 8
next(sequence)  # 13
# you can keep doing this forever (or until your laptop battery dies)
```

Next, I wanted to be able to test if an integer would <em>ever</em> appear in a sequence. For example, we know that the number 13 appears in the canonical Fibonacci sequence. What about the number 648? An easy way to get the answer is to run through the sequence and see if it includes the number 648. After the initial few numbers, we would eventually see 55, 89, 144, 233, 377, 610, 987. The number 648 isn't included in that list, and is guaranteed never to appear later because the sequence is strictly increasing. Therefore, we know the number 648 is not in this sequence.

If a number does appear in the sequence, then we ideally want to know its index (the q-value in this problem). To make things simple, I wrote both of these logical checks in a single function: if a number appears in a sequence, the function returns its q-value. If it doesn't appear, then the function returns 0.

```python
def get_index(x: int, n: int, m: int) -> int:
    """Return the 1-based index of an integer in a sequence if it exists."""
    for q, value in enumerate(fibonacci_sequence(n=n, m=m)):
        if value == x:
            return q + 1
        if value > x:
            return 0


# does 8 appear anywhere in the (1, 1) sequence?
get_index(8, 1, 1)  # 4

# does 7 appear anywhere in the (1, 3) sequence?
get_index(7, 1, 3)  # 2
```

Finally, I wanted to find all valid encodings of an integer. I loop through all values of $n$ and $m$ from 1 to the target, checking to see if the integer appears in the sequence. If it does, then I record the q-value and store the full encoding in a list returned at the end.

```python
def all_encodings(x: int) -> List[FibonacciEncoding]:
    """Return a list of all the encodings of an integer."""
    out: List[FibonacciEncoding] = []
    for n in range(1, x):
        for m in range(1, x):
            q = get_index(x, n, m)
            if q > 0:
                out.append((n, m, q))
    return out


all_encodings(7)
[(1, 3, 2),
 (1, 6, 1),
 (2, 1, 3),
 (2, 5, 1),
 (3, 2, 2),
 (3, 4, 1),
 (4, 3, 1),
 (5, 1, 2),
 (5, 2, 1),
 (6, 1, 1)]
```

To solve the problem, we need to find the encoding with the maximum q-value. I wrote a convenience function to do this, called `max_encoding`. However, I could have called it `solve_the_riddler` because that's exactly what it does!

```python
def max_encoding(x: int) -> FibonacciEncoding:
    """Find the encoding of an integer with the highest value of q."""
    return max(all_encodings(x), key=lambda v: v[-1])


max_encoding(81)   # (3, 2, 7)
max_encoding(179)  # (11, 7, 6)
```

These functions run instantly because the numbers are small, but even numbers as high as 5,000 are solved within a couple seconds on my laptop.

```python
>>> max_encoding(5000)
(40, 10, 11)
```

# Full Code

I certainly wouldn't call the code this week "clever", but it does make use of some nice Python features - notably generators. Being able to yield values from a generator rather than store values in a list is a huge advantage when you aren't sure how many you will need ahead of time. Other than that, I enjoyed how the building block functions like `fibonacci_sequence` and `get_index` eventually built up to convenient functions like `max_encoding`, which, like I said above, is essentially the "solve the puzzle" function this week.

```python
"""
Solving the Riddler Classic from March 18, 2022.
https://fivethirtyeight.com/features/is-it-anyones-birthday/
"""
from typing import Generator, List, Tuple


FibonacciEncoding = Tuple[int, int, int]


def fibonacci_sequence(n: int, m: int) -> Generator[int, None, None]:
    """Yield values in a Fibonacci-like sequence forever."""
    while True:
        yield n + m
        n, m = m, n + m


def get_index(x: int, n: int, m: int) -> int:
    """Return the 1-based index of an integer in a sequence if it exists."""
    for q, value in enumerate(fibonacci_sequence(n=n, m=m)):
        if value == x:
            return q + 1
        if value > x:
            return 0


def all_encodings(x: int) -> List[FibonacciEncoding]:
    """Return a list of all the encodings of an integer."""
    out: List[FibonacciEncoding] = []
    for n in range(1, x):
        for m in range(1, x):
            q = get_index(x, n, m)
            if q > 0:
                out.append((n, m, q))
    return out


def max_encoding(x: int) -> FibonacciEncoding:
    """Find the encoding of an integer with the highest value of q."""
    return max(all_encodings(x), key=lambda v: v[-1])
```
