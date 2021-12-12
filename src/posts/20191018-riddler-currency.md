---
title: Riddler Currency Conversion
slug: riddler-currency
date: 2019-10-18
excerpt: This was a clever version of a classic problem for this week's Riddler Classic. With just two denominations of currency, what is the largest amount we can't create from a combination of bills?
status: draft
---

# Introduction

This was a clever version of a classic problem for this week's <a href="https://fivethirtyeight.com/features/can-you-break-the-riddler-bank/">Riddler Classic</a>. With just two denominations of currency, what is the largest amount we would be unable to create from a combination of bills?

> Riddler Nation has two coins: the Dio, worth 538, and the Phantus, worth 19. When visiting on vacation, Riddler National Bank will gladly convert your dollars into Dios and Phanti. For example, if you were to give a bank teller 614, they’d return to you one Dio and four Phanti, since 614 = 1 × 538 + 4 × 19. But if you tried to exchange one dollar more (i.e., 615), then alas, there is no combination of Dios and Phanti the teller could give you, and you won’t get your money’s worth in local currency.
> <br><br>
> To make the bank teller’s job (and your vacation) as miserable as possible, you decide to bring the largest dollar amount that cannot be converted into Riddler currency. How much money are we talking here? That is, what’s the largest whole number that cannot be expressed as a sum of 19s and 538s?
> <br><br> > **Extra Credit:** Word is that Riddler Nation is considering minting a third currency, worth 101. If they do, then what would be the largest dollar amount that cannot be converted into Riddler currency?

# Solution

**The largest amount we could fail to create is &#36;9665.**

It turns out this is a fivethirtyeight twist on a classic: the <a href="https://en.wikipedia.org/wiki/Coin_problem">coin problem</a>. It is also known as the Diophantine Frobenius Problem - hence the clever names for our two currencies, the "Dio" and "Phantus".

For any two relatively prime numbers - numbers that share no common divisors except 1 - there is a formula to solve our problem: $ab-a-b$. With $a=538$ and $b=19$, we get $538*19-538-19=9665$. Intuitively, the way I thought about this problem is that we eventually will find a string of numbers 19-long that we can create (for example, by looping through each starting point of 538, then 1076, etc.) From there, we could always add multiples of 19 to achieve any higher number. I think of it as "cycling through" the 19's until we have all remainders of zero.

For fun, to verify with python, I used the following function. The idea is to select a substantially large value for $n$, then identify the largest number that couldn't be created from the 19 and 538.

```python
import numpy as np

def model(n, a=538, b=19):
    """
    Returns the highest integer less than n which cannot be created
    by a positive number of
    """
    a, b = max(a, b), min(a, b)
    mask = np.ones(shape=n, dtype=bool)
    for idx in range(n//a+1):
        mask[idx*a::b] = False
    return np.arange(n)[mask].max()

>>> model(100000)
9665
```

Now, what about three numbers? This gets reasonably harder. There is no simple formula (that we've discovered yet). Instead I used another programmatic approach to solve the extra credit. Even though we add a third currency worth 101, we we can only cycle through our smallest currency a maximum of 19 times before we will find repeat values. Therefore, our maximum number should be less than $19\times101=1919$. We pick some arbitrarily high number, in this case 100,000 just to confirm our intuition, and check the largest number we were able to find that couldn't be created from the three values.

```python
def model(n, a=538, b=19, c=101):
    """
    Returns the highest integer less than n which cannot be created
    by a positive number of
    """
    a, b, c = sorted([a, b, c])
    mask = np.ones(shape=n, dtype=bool)
    for idx in range(n//b+1):
        mask[idx*b::a] = False
        mask[idx*c::a] = False
    return np.arange(n)[mask].max()

>>> model(100000)
1799
```

Usually there's some fancy tagline here about "and this is why it pays to know math", but I struggle to find a meaningful takeaway from solving for the _worst_ currency conversion outcome (losing our money in the process). I suppose we should let this serve as a warning for you travelers instead!
