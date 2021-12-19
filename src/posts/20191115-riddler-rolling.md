---
title: Riddler Rolling
slug: riddler-rolling
date: "2019-11-15"
excerpt: This week's Riddler tested our ability to think recursively, but surprisingly not of the coding variety. Instead, we'll use a series of equations to solve the problem analytically. Brings back memories of high school proofs... which I may or may not remember with complete fidelity.
status: published
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/how-low-can-you-roll/">Riddler</a> tested our ability to think recursively, but surprisingly not of the coding variety. Instead, we'll use a series of equations to solve the problem analytically. Brings back memories of high school proofs... which I may or may not remember with complete fidelity.

> To start the game, you roll the die. Your current “score” is the number shown, divided by 10. For example, if you were to roll a 7, then your score would be 0.7. Then, you keep rolling the die over and over again. Each time you roll, if the digit shown by the die is less than or equal to the last digit of your score, then that roll becomes the new last digit of your score. Otherwise you just go ahead and roll again. The game ends when you roll a zero.
> <br><br>
> For example, suppose you roll the following: 6, 2, 5, 1, 8, 1, 0. After your first roll, your score would be 0.6, After the second, it’s 0.62. You ignore the third roll, since 5 is greater than the current last digit, 2. After the fourth roll, your score is 0.621. You ignore the fifth roll, since 8 is greater than the current last digit, 1. After the sixth roll, your score is 0.6211. And after the seventh roll, the game is over — 0.6211 is your final score.
> <br><br>
> What will be your _average_ final score in this game?

# Solution

**The expected value of this game is 9/19, roughly 0.473684.**

At first, the problem seems like a deeply nested recursive brain-melter. While that might be true, there is a pattern we can exploit in order to find a clean solution. We'll solve the problem by proving a simple base case, then build upon the base case to solve for the final answer.

The simplest base case we can start with is a game with a one-sided dice. (Indulge me, and suspend your rational faculties for a moment.) In this "game", we will always have a score of zero. Formally, we can say that $E(0)=0$, meaning the expected value of this game is equal to zero.

Now, let's build on the base case. Suppose we increase the complexity and have a two-sided dice with the numbers zero and one. (One might even say it resembles a coin...) What can happen in this game? We can roll a zero immediately and end with a score of zero, or we can roll a one and continue. If we roll a one, we increment our score in the appropriate decimal place, after which we will find ourselves in a familiar position: we can either flip a zero or a one again.

We can now write an expression for $E(1)$ that takes both of these outcomes into account.

$$E(1) = \frac{1}{2}\times{E(0)} + \frac{1}{2}\times{(\frac{1}{10} + \frac{E(1)}{10})}$$

With 50% probability, we will receive the expected value of 0 and the game will end. With the other 50% probability we will roll a one and add $\frac{1}{10}$ to our total, then move to the next decimal place, where we will expect to add $\frac{E(1)}{10}$ to our score again. We divide $E(1)$ by ten to account for the fact that we move to the next decimal place each time we roll again.

Now, after plugging in $E(0)=0$, we can solve the equation for $E(1)$. We get $E(1)=\frac{1}{19}$.

$$E(1) = \frac{1}{20}\times{(1 + E(1))}$$
$$20E(1) = 1 + E(1)$$
$$E(1) = \frac{1}{19}$$

What about the next case, $E(2)$? With 33% probability we can roll a zero and end the game; with 33% probability we can roll a one, and we'll find ourselves in the $E(1)$ universe again; with 33% probability we can roll a two and stay in the $E(2)$ universe.

$$E(2) = \frac{1}{3}\times{E(0)} + \frac{1}{3}\times{(\frac{1}{10} + \frac{E(1)}{10})} + \frac{1}{3}\times{(\frac{2}{10} + \frac{E(2)}{10})}$$

With some algebra, we can solve this equation for $E(2)$, which gives $\frac{2}{19}$. See a pattern? It looks like $E(N)=\frac{N}{19}$. Let's attempt to confirm by expanding the equation for $E(N)$. For a dice with $N$ sides we can expand the formula as follows. For simplicity we'll omit the $E(0)$ term because we know it evaluates to zero.

$$E(N) = \frac{1}{N+1}\times{(\frac{1}{10} + \frac{E(1)}{10})} + \frac{1}{N+1}\times{(\frac{2}{10} + \frac{E(2)}{10})} + ... + \frac{1}{N+1}\times{(\frac{N}{10} + \frac{E(N)}{10})}$$

We can factor the $N$'s and 10's from the denominator for a simpler expression:

$$E(N) = \frac{\sum_{i=1}^N (i+E(i))}{10(N+1)}$$

We will attempt to prove $E(N)=\frac{N}{19}$ using induction. We've already verified that $E(1)=\frac{1}{19}$. Now we must verify that $E(N+1)=\frac{N+1}{19}$. We will use the fact that $\sum_{i=1}^N i = \frac{N(N+1)}{2}$ to remove the summations from the numerator.

$$\frac{N+1}{19}=\frac{\frac{(N+1)(N+2)}{2} + \frac{(N+1)(N+2)}{38}}{10(N+2)}$$

Next, we multiply both sides by $10(N+2)$:

$$\frac{10(N+1)(N+2)}{19}=\frac{(N+1)(N+2)}{2} + \frac{(N+1)(N+2)}{38}$$

Now, remove the common $(N+1)(N+2)$ terms, and verify both sides are equal.

$$\frac{10}{19}=\frac{1}{2} + \frac{1}{38}$$

Therefore we have proven by mathematical induction that $E(N)=\frac{N}{19}$. Our original problem was for $N=9$, so we confirm our answer of $E(9)=\frac{9}{19}$.

# Proof

Because LaTeX is not my specialty, I also wrote an old-fashioned proof as well. Enjoy!

<img class="img-fluid mx-auto d-block" src="src/assets/img/riddler-rolling.png">
