---
title: Riddler Game of Life
slug: riddler-game-of-life
date: "2020-04-17"
excerpt: In memory of John Conway, we explore a modified version of the famous "Game of Life" in this week's Riddler. I implemented the Game in python, which ended up being so much fun that many of the features aren't strictly required to solve the problem. Instead, they were amusing diversions that helped me explored this surprisingly nuanced game. It's probably just as Conway would have intended.
status: published
---

# Introduction

In memory of John Conway, we explore a modified version of the famous "Game of Life" in this week's <a href="https://fivethirtyeight.com/features/can-you-solve-the-chess-mystery/">Riddler Classic</a>. I implemented the Game in python, which ended up being so much fun that many of the features aren't strictly required to solve the problem. Instead, they were amusing diversions that helped me explored this surprisingly nuanced game. It's probably just as Conway would have intended.

<blockquote>
Riddler Nation was deeply saddened to hear of the loss of John Conway last week. It is only fitting that this week’s Classic is a spin on Conway’s Game of Life.
<br><br>
In the most common version of the game, there is an infinite grid of square cells, which are initially either alive or dead. Each square has eight neighbors — the eight squares that surround it. And after every step in time, or “tick,” all the cells are simultaneously updated according to the following rules:
<ul>
<li>A living cell with two or three living neighbors remains living.</li>
<li>A living cell with any other number of living neighbors dies (due to under- or overpopulation).</li>
<li>A dead cell with exactly three living neighbors comes alive (due to reproduction).</li>
</ul>
These relatively simple rules lead to some startlingly complex, emergent behaviors. For example, some formations of living cells are known as “oscillators,” which change form from one tick to the next, ultimately returning back to their original formation.
<br><br>
Now suppose we were to replace the infinite grid with a finite grid that has periodic boundary conditions, so that cells in the first row are neighbors with cells in the last row, and cells in the first column are neighbors with cells in the last column. If there are three rows and N columns, what is the smallest value of N that can support an oscillator?
</blockquote>

# Solution

**The smallest grid with an oscillation has just three rows and four columns, and there are two variations.** Each of these grids oscillates every other evolution, as shown in the gifs below.

<img src="/img/riddler-game-of-life1.gif">
<img src="/img/riddler-game-of-life2.gif">

# Methodology

One way of completing this puzzle was to build a "Game of Life" simulator, then test all the different starting grids we might expect. This turned out to be a fun programming challenge. I implemented the game using a class called `Grid`, which tracks alive and dead cells in an array and provides many different utility methods to evaluate the game.

Each `Grid` object takes a starting array of cells, coded by zeros and ones. The `__repr__` object of each `Grid` returns a unicode representation of the alive (black) and dead (white) cells. For example, this code snippet creates a `Grid` with four alive cells.

```python
cells = np.array([[0, 1, 0], [1, 0, 1], [0, 1, 0]])
Grid(cells)
```

⬜⬛⬜<br>
⬛⬜⬛<br>
⬜⬛⬜<br>

There are also a few convenience constructors. For example, we can create a randomly-generated `Grid` by calling the `random` classmethod.

```python
Grid.random(size=(5, 10), random_state=42)
```

⬜⬛⬜⬜⬜⬛⬜⬜⬜⬛<br>
⬜⬜⬜⬜⬛⬜⬛⬛⬛⬜<br>
⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛<br>
⬜⬜⬛⬛⬛⬜⬛⬜⬜⬜<br>
⬜⬜⬛⬛⬛⬛⬛⬜⬛⬛<br>

Once we have a Grid object, we can move forward in time using the `evolve` method. This method moves forward by `n` ticks and returns the updated `Grid`, following the well established rules of the Game.

```python
grid = Grid.random(size=(5, 10), random_state=42)
grid.evolve(1)
```

⬛⬜⬛⬜⬜⬜⬜⬜⬜⬛<br>
⬜⬛⬛⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬛⬛⬜⬜⬜⬜⬜⬜⬛<br>
⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬛⬛⬜⬜⬜⬜⬛⬛⬛⬛<br>

All of this is implemented behind the scenes, as it were, by using a `padded_cells` array that handles the wrapping logic specified in the problem. The `padded_cells` array links the top row of cells to the bottom, the left to the right, and each corner to its opposite corner. To calculate each cell's "score" (the number of live neighbors), we use the `convolve2d` function from `scipy`, which is typically used to scan images and group boxes of pixels together in a process called <a href="https://en.wikipedia.org/wiki/Convolution">convolution</a>. (It's commonly used in deep learning for image recognition in <a href="https://en.wikipedia.org/wiki/Convolutional_neural_network">Convolutional Neural Networks</a>.) Once we know each cell's "score", we can simulate whether it lives or dies in the next evolution.

There are a few other convenience methods, like plotting the `Grid` and creating a .gif out of its evolutions.

For example, it can be fun to view the evolution of a larger grid to see what patterns emerge. This code generates a 30x30 cell array and lets it run for 100 iterations. You can see several static clumps of cells, and a few oscillators - notably the <a href="https://www.conwaylife.com/wiki/Blinker">"blinker"</a>.

<img src="/img/riddler-game-of-life3.gif">

However, my favorite feature, which has very little to do with the original problem, is a special constructor. You may have seen the <a href="https://xkcd.com/2293/">xkcd tribute to John Conway</a>. Calling `Grid.conway()` creates a Grid that follows this pattern.

```python
Grid.conway()
```

⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬛⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬛⬜⬛⬜⬛⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬛⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜<br>

And the .gif of this Grid's evolution matches the original comic. It was a fantastic tribute.

<img src="/img/riddler-game-of-life4.gif">

# Full Code

This code technically solves the Riddler Classic, but I had much more fun trying to implement a more complete version of the Game of Life that accepts a grid of any size. It still implements the wrapping (see `Grid.padded_cells`), and also implements a few visualization methods, like plotting and creating .gifs.

```python
"""Solution to the Riddler Classic from April 17, 2020"""
from itertools import product
from typing import Iterator, Optional, Tuple
import gif  # https://github.com/maxhumber/gif, `pip install gif`
from matplotlib import pyplot as plt
import numpy as np
from scipy.signal import convolve2d


class Grid:
    """
    Grid object representing Conway's Game of Life. Can model the Riddler
    variation of the game by passing `wrapped=True`, which will connect the
    edges of the grid with the opposite sides, creating a continuous surface.

    Parameters
    ----------
    cells : np.ndarray with integer or boolean dtype, specifies the size of the
            grid and alive cells (1) and dead cells (0)
    wrapped : boolean, default True, indicates whether the Riddler wrapping
              conditions apply to this Grid. If True, then the grid "wraps" so
              edges connect to opposite edges and corners connect to opposite
              corners. If False, the grid is assumed to be infinite and empty
              outside of the array passed when the Grid is instantiated.

    Examples
    --------
    >>> cells = np.array([[0, 1, 1, 0, 0],
    ...                   [0, 0, 0, 1, 1],
    ...                   [1, 1, 0, 1, 0]])
    >>> Grid(cells)
    ⬜⬛⬛⬜⬜
    ⬜⬜⬜⬛⬛
    ⬛⬛⬜⬛⬜

    >>> Grid(cells) == Grid(cells)
    True

    >>> # initialize a random grid, but set a seed for reproducibility
    >>> grid = Grid.random((3, 5), random_state=42)
    >>> grid
    ⬜⬛⬜⬜⬜
    ⬛⬜⬜⬜⬛
    ⬜⬜⬜⬜⬛

    >>> # iterate one step and return a new Grid object
    >>> grid.evolve(1)
    ⬜⬜⬜⬜⬛
    ⬛⬜⬜⬜⬛
    ⬜⬜⬜⬜⬛
    """

    def __init__(self, cells: np.ndarray, wrapped: bool = True) -> None:
        self.cells = cells
        self.wrapped = wrapped

    def __repr__(self) -> str:
        """Represent each element of the grid as a 'pixel'"""
        read_row = lambda row: "".join("⬛" if x else "⬜" for x in row)
        return "\n".join(read_row(row) for row in self.cells)

    def __eq__(self, other) -> bool:
        """Two Grids are equal if they have the same `cells` array"""
        return (self.cells == other.cells).all()

    @classmethod
    def conway(cls, wrapped: bool = False):
        """
        Specific constructor that creates a Grid object in the shape of the xkcd
        tribute to John Conway, found here: https://xkcd.com/2293/

        Examples
        --------
        >>> Grid.conway()
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬛⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬛⬜⬛⬜⬛⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬛⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬛⬜⬛⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
        """
        x = [6, 7, 8, 6, 8, 6, 8, 7, 4, 6, 7, 8, 5, 7, 9, 7, 10, 6, 8, 6, 8]
        y = [
            9, 9, 9, 10, 10, 11, 11, 12, 13, 13, 13,
            13, 14, 14, 14, 15, 15, 16, 16, 17, 17
        ]
        cells = np.zeros(shape=(21, 15))
        cells[y, x] = 1
        return Grid(cells, wrapped=wrapped)

    @classmethod
    def random(
        cls,
        size: Tuple[int, int],
        wrapped: bool = True,
        random_state: Optional[int] = None
    ):
        """
        Create a randomly-initialized Grid of a given size

        Examples
        --------
        >>> grid = Grid.random((3, 5), random_state=42)
        >>> grid
        ⬜⬛⬜⬜⬜
        ⬛⬜⬜⬜⬛
        ⬜⬜⬜⬜⬛
        """
        np.random.seed(random_state)
        return Grid(np.random.randint(2, size=size), wrapped=wrapped)

    @property
    def padded_cells(self) -> np.ndarray:
        """
        Helper attribute that adds a padding layer around the cells in the grid.
        This padded  array is used later for calculating the score of each cell,
        and also handles the wrapping methodology if applicable.

        Examples
        --------
        >>> grid = Grid.random((3, 5), random_state=123)
        >>> grid
        ⬜⬛⬜⬜⬜
        ⬜⬜⬛⬛⬜
        ⬛⬛⬜⬛⬜
        >>> grid.padded_cells
        array([[0, 1, 1, 0, 1, 0, 1],
               [0, 0, 1, 0, 0, 0, 0],
               [0, 0, 0, 1, 1, 0, 0],
               [0, 1, 1, 0, 1, 0, 1],
               [0, 0, 1, 0, 0, 0, 0]])
        >>> Grid(grid.padded_cells, wrapped=True)
        ⬜⬛⬛⬜⬛⬜⬛
        ⬜⬜⬛⬜⬜⬜⬜
        ⬜⬜⬜⬛⬛⬜⬜
        ⬜⬛⬛⬜⬛⬜⬛
        ⬜⬜⬛⬜⬜⬜⬜
        >>> grid = Grid.random((3, 5), random_state=123, wrapped=False)
        >>> Grid(grid.padded_cells)
        ⬜⬜⬜⬜⬜⬜⬜
        ⬜⬜⬛⬜⬜⬜⬜
        ⬜⬜⬜⬛⬛⬜⬜
        ⬜⬛⬛⬜⬛⬜⬜
        ⬜⬜⬜⬜⬜⬜⬜
        """
        # first we create an array with an extra padding layer
        rows, cols = self.cells.shape
        padded = np.zeros(shape=(rows + 2, cols + 2), dtype=int)

        # copy the original cell values into the middle
        padded[1:-1, 1:-1] = self.cells

        # if we aren't wrapping the grid, just return this padded array
        if not self.wrapped:
            return padded

        # otherwise, handle wrapping conditions
        # first, copy each edge onto the opposite (padded) side
        padded[0, 1:-1] = self.cells[-1]     # bottom to top
        padded[-1, 1:-1] = self.cells[0]     # top to bottom
        padded[1:-1, 0] = self.cells[:, -1]  # right to left
        padded[1:-1, -1] = self.cells[:, 0]  # left to right

        # copy each corner to the opposite corner
        padded[0, 0] = self.cells[-1, -1]
        padded[0, -1] = self.cells[-1, 0]
        padded[-1, 0] = self.cells[0, -1]
        padded[-1, -1] = self.cells[0, 0]

        return padded

    def cell_score(self):
        """
        Returns the number of living neighbor cells for each cell on the grid.

        Examples
        --------
        >>> grid = Grid.random((3, 5), random_state=123)
        >>> grid
        ⬜⬛⬜⬜⬜
        ⬜⬜⬛⬛⬜
        ⬛⬛⬜⬛⬜
        >>> grid.cell_score()
        array([[3, 3, 5, 3, 3],
               [3, 4, 4, 2, 3],
               [2, 3, 5, 2, 3]])
        """
        # the convolution scanner is a 3x3 array of ones, expect a middle zero
        scanner = np.ones(shape=(3, 3), dtype=int)
        scanner[1, 1] = 0
        return convolve2d(self.padded_cells, scanner, mode="same")[1:-1, 1:-1]

    def evolve(self, steps: int = 1):
        """
        Move the simulation forward by n steps, default 1

        Examples
        --------
        >>> grid = Grid.random((3, 5), random_state=123)
        >>> grid
        ⬜⬛⬜⬜⬜
        ⬜⬜⬛⬛⬜
        ⬛⬛⬜⬛⬜
        >>> grid.evolve(1)
        ⬛⬛⬜⬛⬛
        ⬛⬜⬜⬛⬛
        ⬛⬛⬜⬛⬛
        >>> grid.evolve(2)
        ⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜
        """

        def _evolve(grid):
            "Iterate a single step"
            scores = grid.cell_score()
            evolution = np.zeros_like(grid.cells)

            # live cells stay alive if they have exactly 2 or 3 alive neighbors
            idx = (grid.cells == 1) & (scores > 1) & (scores < 4)
            evolution[idx] = 1

            # live cells die if they have any other number of neighbors
            idx = (grid.cells == 1) & (scores < 2) & (scores > 3)
            evolution[idx] = 0

            # dead cells spawn if they have exactly three live neighbors
            idx = (grid.cells == 0) & (scores == 3)
            evolution[idx] = 1

            return Grid(evolution, wrapped=self.wrapped)

        grid = self
        for _ in range(steps):
            grid = _evolve(grid)
        return grid

    def period(self, limit: int = 20) -> int:
        """
        If this Grid produces an identical grid after `n` evolutions, then
        its period is equal to `n`. If it does not, then return -1.

        `n` may be one for a grid that doesn't change after an evolution.

        Parameters
        ----------
        limit : int, the maximum number of evolutions to search for a pattern

        Examples
        --------
        >>> cells = np.zeros(shape=(4, 4), dtype=int)
        >>> cells[1:-1, 1:-1] = 1
        >>> grid = Grid(cells)
        >>> grid
        ⬜⬜⬜⬜
        ⬜⬛⬛⬜
        ⬜⬛⬛⬜
        ⬜⬜⬜⬜
        >>> grid.period()
        1

        >>> cells = np.zeros(shape=(5, 5), dtype=int)
        >>> cells[2, 1:-1] = 1
        >>> grid = Grid(cells)
        >>> grid
        ⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜
        ⬜⬛⬛⬛⬜
        ⬜⬜⬜⬜⬜
        ⬜⬜⬜⬜⬜
        >>> grid.period()
        2
        """
        for i in range(1, limit + 1):
            if self == self.evolve(i):
                return i
        return -1

    def plot(self):
        """Plot the grid in matplotlib"""
        _, ax = plt.subplots(figsize=(7, 7))
        plt.axis('equal')

        ax.pcolor(
            self.cells[::-1], edgecolors="0.92", linewidth=1.2, cmap="Blues"
        )

        ax.xaxis.set_visible(False)
        ax.yaxis.set_visible(False)
        for s in ["top", "bottom", "left", "right"]:
            ax.spines[s].set_visible(False)

        return ax

    def create_gif(self, frames: int, filename: str, duration: int):
        """
        Creates a .gif file with each frame moving forward one evolution.
        Adds a few extra frames of the starting position to the beginning.
        Uses the `gif` library: https://github.com/maxhumber/gif

        Parameters
        ----------
        frames : int, the number of evolutions to simulate
        filename : str, the name of the file, e.g. "life.gif"
        duration : int, the delay between frames, in microseconds
        """

        @gif.frame
        def _plot(grid):
            return grid.plot()

        start = [_plot(self.evolve(0)) for _ in range(5)]
        images = [_plot(self.evolve(n)) for n in range(frames)]
        gif.save(start + images, filename, duration=duration)


def grid_generator(columns: int, rows: int = 3) -> Iterator[Grid]:
    """
    Generator function that yields all permutations of Grids
    that could be made with a (rows x columns) shape.

    Examples
    --------
    >>> list(grid_generator(2, 1))
    [⬜⬜, ⬜⬛, ⬛⬜, ⬛⬛]
    """
    generator = product((0, 1), repeat=rows*columns)
    for cells in generator:
        yield Grid(np.array(cells).reshape(rows, columns))


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```
