---
title: Sticks and stones
slug: riddler-sticks
date: 2017-09-15
excerpt: Just kidding, no stones in this week's riddler puzzle. But before you build your campfire, what shapes can you make with the sticks?
status: draft
---

Part of the fun of building a campfire is setting up the structure of the logs. I suppose that may have inspired this week's
<a href="https://fivethirtyeight.com/features/will-you-be-a-ghostbuster-or-a-world-destroyer/">riddler classic</a>. Perhaps the logic is that if you find sticks that can form triangles, you are more likely to build an aesthetically pleasing pyre...?

> This week’s Classic, from Spreck Rosekrans, continues our camping theme. Here are four questions of increasing difficulty about finding sticks in the woods, breaking them and making shapes:

> 1. If you break a stick in two places at random, forming three pieces, what is the probability of being able to form a triangle with the pieces?
> 2. If you select three sticks, each of random length (between 0 and 1), what is the probability of being able to form a triangle with them?
> 3. If you break a stick in two places at random, what is the probability of being able to form an acute triangle — where each angle is less than 90 degrees — with the pieces?
> 4. If you select three sticks, each of random length (between 0 and 1), what is the probability of being able to form an acute triangle with the sticks?

As is my tendency, I solved this problem through simulation. However, the calculus behind the analytical solution is interesting as well. I'll likely return to this and augment my answer to walk through both methods. However, from a programming perspective, I liked the structure of this problem. For example, I identified four key functions we need to be able to perform:

- Create a function to simulate "breaking" sticks

```python
def break_sticks(n):
    """
    Break a single stick of length 1 into
    3 smaller sticks. Repeat n times

    Returns
    -------
    s : np.array of shape (n,3), sorted
        from low to high by row
    """
    s = np.random.rand(n,3)
    s = np.sort(s,axis=1)
    s[:,2] = 1 - s[:,1]
    s[:,1] = s[:,1] - s[:,0]
    s = np.sort(s,axis=1)
    return s
```

- Create a function to simulate "gathering" sticks

```python
def gather_sticks(n):
    """
    Gather n groups of 3 sticks with sizes
    uniformly distributed between 0 and 1

    Returns
    -------
    s : np.array of shape (n,3), sorted
        from low to high by row
    """
    s = np.random.rand(n,3)
    s = np.sort(s,axis=1)
    return s
```

- Create a logical test to check whether three sticks form a triangle

```python
def triangle(sticks):
    """
    Checks whether the (n,3) array of sticks
    can form valid triangles.

    Valid if a+b > c

    Returns
    b : np.array of booleans
    """
    is_triangle = sticks[:,0] + sticks[:,1] > sticks[:,2]
    return is_triangle
```

- Create a logical test to check whether three sticks form an _acute_ triangle

```python
def acute(sticks):
    """
    Checks whether the (n,3) array of sticks
    can form valid acute triangles. (Triangles
    whose angles are all less than 90.)

    Valid if a**2 + b**2 > c**2
    and if a, b, & c can form a triangle

    Returns
    b : np.array of booleans
    """
    is_acute = (sticks[:,:-1]**2).sum(1) > sticks[:,-1]**2
    is_acute = is_acute & triangle(sticks)
    return is_acute
```

We can combine each "stick function" with a "logical test" in order to answer each of the questions. I created a dictionary and then displayed the results using a pandas DataFrame.

```python
trials = 50000000

# gather and break many groups of sticks
gathered_sticks = gather_sticks(trials)
broken_sticks = break_sticks(trials)

data = {
    'broken': {
        'triangle': triangle(broken_sticks).sum() / trials,
        'acute': acute(broken_sticks).sum() / trials,
    },
    'gathered': {
        'triangle': triangle(gathered_sticks).sum() / trials,
        'acute': acute(gathered_sticks).sum() / trials,
    }
}

pd.DataFrame.from_dict(data)
```

After a few seconds, running 50 million trials, this code returns a DataFrame with the following output. These numbers represent the probabilities in question. For example, the probability that you can form a triangle by breaking a single stick is roughly 25%. The probability that you can form an acute triangle from three sticks that you gather is roughly 21.4%. Something to keep in mind for your next camping trip!

|            | $Broken\ Sticks$ | $Gathered\ Sticks$ |
| ---------- | ---------------- | ------------------ |
| $Triangle$ | $0.250117$       | $0.499860$         |
| $Acute$    | $0.079432$       | $0.214616$         |
