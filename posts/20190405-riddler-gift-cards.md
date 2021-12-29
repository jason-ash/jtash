---
title: Riddler Gift Cards
slug: riddler-gift-cards
date: "2019-04-05"
excerpt: Another weekly Riddler, this time with both an analytical and simulated solution!
status: published
---

# Introduction

This week's Riddler falls into one of my favorite categories: a problem that can be solved analytically and via simulation. It's great to be able to solve the same problem in two different ways! Here's the full problem text.

<blockquote>
Lucky you! You’ve won two gift cards, each loaded with 50 free drinks from your favorite coffee shop, Riddler Caffei-Nation. The cards look identical, and because you’re not one for record-keeping, you randomly pick one of the cards to pay with each time you get a drink. One day, the clerk tells you that he can’t accept the card you presented to him because it doesn’t have any drink credits left on it.
<br><br>
What is the probability that the other card still has free drinks on it? How many free drinks can you expect are still available?
</blockquote>

# Analytical Solution

Let's define some terms first. Both cards start with $n$ drinks. The question specifically asks about $n=50$ but we can generalize to any $n$. We are interested in the number $k$ drinks remaining on either card when we try (and fail) to buy a drink with one of our cards. Note that $k$ can be zero, as in the case where we draw down each card equally after buying 100 drinks total. When we frame the question like this, it lets us define the only two possible outcomes, which are: <br>

1. Card A runs out of drinks first; card B has $k$ drinks remaining.
2. Card B runs out of drinks first; card A has $k$ drinks remaining.

These two terminating conditions are symmetric - outcome 1 is just as likely as outcome 2. Therefore, we can solve for the probability of outcome 1 and double it for our final answer.

If we run out of drinks on card A, we will have $k$ drinks remaining on card B, where $k$ is any number between 0 and our starting number, $n$. We know that for this to happen, we must have purchased $n$ drinks on the first card, $n-k$ drinks on the second card, and attempted $1$ more purchase on the first card, for a total of $2n - k + 1$. Of those purchases, $n$ must have occurred on a single card, which gives us an "n choose k" binomial formula. Here's the probability of our event 1 occurring:

$$P(n, k) = \binom{2n-k}{n}\left(\frac{1}{2}\right)^{2n-k+1}$$

Now we account for the fact that either card can run out of drinks, so we multiply this expression by 2 for our final answer. It has the effect of cancelling out the $+1$ in our exponent.

$$2\times P(n, k) = 2\times \binom{2n-k}{n}\left(\frac{1}{2}\right)^{2n-k+1} = \binom{2n-k}{n}\left(\frac{1}{2}\right)^{2n-k} $$

# Validation

Let's take our formula for a test drive, where we assume we start with 1 drink on each card. There are six possible outcomes, listed with their probabilities. For example, we can buy two drinks on card "A" in a row. If this happens, there will be one drink left on card B, and we know this occurs with 25% probability. Here's the full list.

- A, A -> 1 drink remains on B, probability = 0.25
- B, B -> 1 drink remains on A, probability = 0.25
- A, B, A -> 0 drinks remain on B, probability = 0.125
- A, B, B -> 0 drinks remain on A, probability = 0.125
- B, A, A -> 0 drinks remain on B, probability = 0.125
- B, A, B -> 0 drinks remain on A, probability = 0.125

Adding these up, we see that there is a 50% chance of ending with 1 drink, and a 50% chance of ending with 0 drinks. We can verify with our formula from above that there is a 50% chance of each outcome, so it seems like we've arrived at the right answer.

$$P(1, 1) = \binom{1}{1}\left(\frac{1}{2}\right)^{1} = 0.5$$
$$P(1, 0) = \binom{2}{1}\left(\frac{1}{2}\right)^{2} = 0.5$$

# Expected Value

The question asked us about the expected number of drinks remaining. Using our formula, we can calculate the probability for any combination of $n$ and $k$. Then, for every possible $k$, we multiply by $k$ and sum the results to arrive at the expected value. It looks like this:

$$\text{Expected Value} = \sum_{k=0}^n k\times{\binom{2n-k}{n}\left(\frac{1}{2}\right)^{2n-k}}$$

Using a bit of mathematical horsepower from <a href="https://www.wolframalpha.com/input/?i=%5Csum_%7Bk%3D0%7D%5En+k%5Ctimes%7B%5Cbinom%7B2n-k%7D%7Bn%7D%5Cleft(%5Cfrac%7B1%7D%7B2%7D%5Cright)%5E%7B2n-k%7D%7D">WolframAlpha</a>, we can simplify this expression to:

$$4^{-n}(2n + 1)\binom{2n}{n}-1$$

**When we substitute $n=50$, we calculate an expected value of $\approx7.0385$. This means that when either card runs out, we expect roughly 7 drinks to be available on the other card.**

We were also asked about the probability that there were _any_ drinks available on the other card when the first card expires. We can answer this by taking the complement of the probability that both cards end with zero drinks. For this, we use values of $n=50$ and $k=0$, and subtract the value from 1, which <a href="https://www.wolframalpha.com/input/?i=(100+choose+50)+%2F+2%5E100">gives us</a> **roughly 92% odds**.

# Simulated Solution

We can also solve the problem by writing a short Python script. We start with both cards loaded with 50 drinks each. Next, we randomly choose one card and subtract a drink from it. We repeat this process until one of the cards reaches -1, because it means we tried to buy a drink using an empty card. When this happens, we record the number of drinks left on the other card. If we simulate this process a large number of times, then the distribution of results should converge to our analytical solution above. Here's the function we'll use.

```python
from random import randint

def model(trials, n_drinks=50):
    """Simulate the Riddler Classic"""
    for _ in range(trials):
        cards = [n_drinks, n_drinks]
        while min(cards) > -1:
            cards[randint(0,1)] -= 1
        yield max(cards)

trials = 1000000
results = np.array(list(model(trials, n_drinks=50)))

# expected value
print(results.mean())
# 7.038671

# probability of any drinks remaining
print((results > 0).sum() / trials)
# 0.920398
```

Our result based on one million trials is **7.038671**, which is remarkably close to our analytical solution above! Looks like everything worked out the way it should. In addition to the expected value, we can also plot the full distribution of results, shown below.

<img src="/img/riddler-gift-cards.png">

Overall I was surprised the expected value is so low. There's a nearly a 50% chance that you end up with no more than 5 drinks on one of the cards using this approach! It looks like organizing and tracking gift cards may not be quite as important as one might think. Could this be a new life-hack? I doubt it, but it was a fun problem regardless.
