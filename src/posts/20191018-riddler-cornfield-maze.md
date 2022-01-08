---
title: Riddler Cornfield Maze
slug: riddler-cornfield-maze
date: "2019-10-18"
excerpt: I'm a sucker for a good maze problem from the Riddler Express. Let's over-engineer it using networkx and python to extend the problem and see what we can learn!
tags: ["puzzles", "python"]
status: published
---

# Introduction

I'm a sucker for a good maze problem from the <a href="https://fivethirtyeight.com/features/can-you-break-the-riddler-bank/">Riddler Express</a>. Let's over-engineer it using networkx and python to extend the problem and see what we can learn!

<blockquote>
The number in each box tells you how many spaces up, down, left or right you must move. (No diagonal moves, people.) Starting at the yellow six in the bottom left corner, can you make your way to the asterisk?
</blockquote>

<img src="/img/riddler-cornfield-original.png">

# Solution

**The shortest path from the highlighted 6 to the target square consists of 8 steps.**

<img src="/img/riddler-cornfield-solution.png">

What else can we learn about this maze? I think it would be interesting to see which square has the longest path to the target. Or for that matter, the path length from every square in the maze to the target. By treating the entire maze like a network, we can find the links between each and every square, then use the network to answer these questions. For example, each square is "linked" to up to four other squares moving up, down, left, or right. Using python and the fabulous `networkx` library, which I've used <a href="/riddler-colorful-maze">several</a> <a href="/riddler-state-superstrings">times</a> before, we can start to answer some of these other questions. My full code is available below, but I'll show interesting snippets as we go along.

The following shows us the number of steps from each square to the target. (-1 means no path exists.) The longest number of steps is 10, and actually comes from a box bordering the target! We can also quantify the _average_ number of steps to the target from any square, which is 6.64 (among squares where a path exists at all, and excluding the target itself.)

```python
>>> out = steps(maze, target=(6,2))
>>> out
array([[ 2,  4,  4,  3,  8,  8,  8,  3,  6,  8],
       [ 9,  6,  9,  6,  7,  7,  8,  8,  7,  7],
       [ 9,  8,  5,  4,  7,  8,  7,  8,  6,  7],
       [ 8,  5,  5,  6,  6,  7, -1,  4,  6,  7],
       [ 6,  5,  6,  4,  5,  6,  5,  7,  5,  6],
       [ 8,  7, 10,  9, -1,  7,  6,  9,  9,  8],
       [ 1,  9,  0,  5,  7,  9,  9,  7,  7,  6],
       [ 7,  6,  5,  7,  6,  6,  7,  6,  7,  6],
       [ 7,  7,  9,  5,  6,  8,  6,  8,  7,  8],
       [ 8,  8,  7,  5,  7,  6,  7,  8,  7,  8]])
>>> out[out > 0].mean()
6.639175257731959
```

What about the "best" or "worst" target square? Which target square is the easiest or hardest to hit? Suppose we cycle through each possible square and declare it the target, then calculate the average number of steps required to hit it. (Key caveat here is that we'll exclude cells with no path to our new targets. We'll also assume the original target cell has a value of zero, so it can't connect outward at all.)

The easiest target square is in the fifth row, fourth column: cell (4,3) when we count using zero-indexing. This cell has the value of 4. The hardest cell to reach is in the top row, eighth column, with a value of 7. The average number of steps to reach this target is a whopping 18.21! However, we could also argue that the most difficult target square is our yellow-highlighted six. It's unreachable from any other square in the maze!

```python
import pandas as pd

>>> out = {target: steps(maze, target=target) for target in graph(maze).nodes}
>>> out = {target: value[value > 0].mean() for target, value in out.items()}
>>> pd.Series(out).sort_values()
4  3     3.500000
2  1     3.572917
8  2     3.677083
0  6     3.677083
3  5     3.687500
          ...
2  2    15.791667
3  2    16.614583
   7    17.437500
0  7    18.208333
9  0          NaN
Length: 100, dtype: float64
```

# Full Code

Feel free to expand or use this code below to draw your own conclusions about this week's maze.

```python
import doctest
import numpy as np
import networkx as nx


maze = np.array([
    [6, 2, 1, 3, 6, 1, 7, 7, 4, 3],
    [2, 3, 4, 5, 7, 8, 1, 5, 2, 3],
    [1, 6, 1, 2, 5, 1, 6, 3, 6, 2],
    [5, 3, 5, 5, 1, 6, 7, 3, 7, 3],
    [1, 2, 6, 4, 1, 3, 3, 5, 5, 5],
    [2, 4, 6, 6, 6, 2, 1, 3, 8, 8],
    [2, 4, 0, 2, 3, 6, 5, 2, 4, 6],
    [3, 1, 7, 6, 2, 3, 1, 5, 7, 7],
    [6, 1, 3, 6, 4, 5, 4, 2, 2, 7],
    [6, 7, 5, 7, 6, 2, 4, 1, 9, 1],
])


def connections(loc, value, size=(10, 10)):
    """
    Returns the valid connections from a given point

    Parameters
    ----------
    loc : tuple(int, int), the location of the point, e.g. (3, 6)
    value : int, the value of the point, e.g. 6
    max_size : tuple(int, int), the size of the maze

    Returns
    -------
    locs : list of tuple(int, int) for valid connection points

    Examples
    --------
    >>> connections(loc=(5, 5), value=3)
    [(2, 5), (8, 5), (5, 2), (5, 8)]

    >>> connections(loc=(3, 3), value=6)
    [(9, 3), (3, 9)]

    >>> connections(loc=(0,0), value=5)
    [(5, 0), (0, 5)]
    """
    x_idx = [-value, value, 0, 0]
    y_idx = [0, 0, -value, value]
    locs = [(loc[0] + x, loc[1] + y) for x, y in zip(x_idx, y_idx)]
    return [loc for loc in locs if max(loc) < max(size) and min(loc) >= 0]

def graph(maze):
    """Create a graph from a maze"""
    G = nx.DiGraph()
    edges =  {
        loc: connections(loc, value, size=maze.shape)
        for loc, value in np.ndenumerate(maze)
    }
    for loc, values in edges.items():
        for v in values:
            G.add_edge(loc, v)
    return G

def paths(maze, target):
    """
    Returns a dictionary of path length from every
    node in the graph to a given target in the graph
    """
    G = graph(maze)
    out = {}
    for node in G.nodes:
        try:
            path = len(nx.shortest_path(G, source=node, target=target)) - 1
        except nx.NetworkXNoPath:
            path = -1
        out[node] = path
    return out

def steps(maze, target):
    """
    Returns an array the same shape as the maze where the values in the
    array represent the number of steps from the given node to the target
    """
    out = np.zeros_like(maze)
    for loc, value in paths(maze, target).items():
        out[loc] = value
    return out

if __name__ == '__main__':
    doctest.testmod()
```
