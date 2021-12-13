---
title: How do you like them rectangles?
slug: riddler-rectangles
date: 2017-09-22
excerpt: This week's riddler reminds me of a cross between sudoku or kakuro puzzles and some good old fashioned geometry... you might call them geometric sudoku puzzles!
status: draft
---

I love sudoku puzzles, and I remember how excited I was to discover <a href="https://en.wikipedia.org/wiki/Kakuro">kakuro puzzles</a>. They combined the sudoku experience with math! This week, <a href="https://fivethirtyeight.com/features/how-do-you-like-these-rectangles/">fivethirtyeight's riddler</a> introduces what I think of as "geometric sudoku", because it combines the variable-finding elements of math puzzles with some good old fashioned geometry.

> This week, we’ve got two puzzles from the forthcoming puzzle book “[The Original Area Mazes](https://theexperimentpublishing.com/catalogs/fall-2017/the-original-area-mazes/){:target="\_blank"},” by Alex Bellos, Naoki Inaba and Ryoichi Murakami. The goal of these puzzles, which are also known by the Japanese term “menseki meiro,” is to figure out what the “?” equals. The only math you’ll need to know is that length times width equals area. Keep in mind that the diagrams aren’t necessarily to scale — this is about logic, not measuring.

Importantly, the figures may not be to scale, but I have it on <a href="https://twitter.com/ollie/status/911240547951693824">good authority</a> that we can trust the lines and edges.

### Riddler Express

<img class="img-fluid mx-auto d-block" alt="Riddler Express" src="../images/20170922-riddler1.png">

This puzzle was almost frustratingly simple, and I didn't trust my answer at first. But it is easy to show that $ ? = 4 $.

$$ 4x = 24 $$

$$ \therefore\ x = 6 $$

$$ (6 + 3 + 2)? = 44 $$

$$ \therefore\ ? = 4 $$

### Riddler Classic

<img class="img-fluid mx-auto d-block" alt="Riddler Classic" src="../images/20170922-riddler2.png">

This puzzle took a bit more effort, but it can be solved in several unique ways. At first, I solved for the size of the "missing" rectangle in the upper right in order to calculate the area of the entire rectangle. Later, I simplified this solution by writing two equations in terms of $x$ and $y$, which are the bottom and left edges of $?$, respectively. From there, with two equations and two missing variables, we can solve for our missing piece.

$$ ? = xy $$

$$ x(11-y) = 32 $$

$$ y(14-x) = 45 $$

Rearranging these equations, we can plot them as functions of x, set them equal to one another, and solve for the answer(s).

$$ y = 11 - \frac{32}{x} $$

$$ y = \frac{45}{14-x} $$

This yields two pairs of solutions, courtesy of [wolframalpha](<https://www.wolframalpha.com/input/?i=x(11-y)%3D32,+(14-x)y+%3D45>){:target="\_blank"} and verified by Python for good measure.

```python
import numpy as np

def y1(x): return 11 - 32/x
def y2(x): return 45 / (14-x)

x = np.arange(0.01,10.01,0.01)
line1 = y1(x)
line2 = y2(x)
```

<img class="img-fluid mx-auto d-block" alt="Intersection" src="../images/20170922-riddler.png">

$$ x = \frac{64}{11},\ y = \frac{11}{2},\ xy = 32 $$

$$ x = 7,\ y = \frac{45}{7},\ xy = 45 $$

Which one is correct? We know the total area of the rectangle must be $14\times{11} = 154$, which means the $?$ must be less than $154 - 45 - 34 - 32 = 43$. Only one solution meets this criteria, so we conclude that $? = 32$.

Looks like “[The Original Area Mazes](https://theexperimentpublishing.com/catalogs/fall-2017/the-original-area-mazes/){:target="\_blank"}” could be a great source of future puzzles (and posts...)!
