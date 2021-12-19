---
title: Who wants to Bayes a Millionaire
slug: riddler-bayes-millionaire
date: "2019-10-04"
excerpt: Forgive the pun - this was a fantastic Riddler Express challenging you to calculate your odds of winning a million dollars!
status: published
---

# Introduction

Forgive the pun - this was a fantastic <a href="https://fivethirtyeight.com/features/who-wants-to-be-a-riddler-millionaire/">Riddler Express</a> challenging you to calculate your odds of winning a million dollars!

> You’ve made it to the &#36;1 million question, but it’s a tough one. Out of the four choices, A, B, C and D, you’re 70 percent sure the answer is B, and none of the remaining choices looks more plausible than another. You decide to use your final lifeline, the 50:50, which leaves you with two possible answers, one of them correct. Lo and behold, B remains an option! How confident are you now that B is the correct answer?

# Solution

**After the 50-50, we should be 87.5% confident that the correct answer is B.**

We started the problem by estimating our confidence in the answer, B. But when new information is revealed to us, we should revise our estimate. In general, when we receive new information about a situation, we should try to update our beliefs about the expected outcomes. The primary tool to do this is <a href="https://en.wikipedia.org/wiki/Bayes%27_theorem">Bayes's Theorem</a>.

$$P(A|B) = \frac{P(B|A) \times P(A)}{P(B)}$$

In the formula, $A$ and $B$ represent events, such as "B is the correct answer". $P(A|B)$, called a <a href="https://en.wikipedia.org/wiki/Conditional_probability">conditional probability</a>, is the likelihood that event $A$ occurs, given $B$ has also occurred. Typically it is easy for us to solve for one of the conditional probabilities, for example $P(B|A)$, but hard for us to solve for the other, $P(A|B)$. Bayes's theorem gives us a way to translate one into the other.

The problem asks us to estimate the probability that B is correct, given that it remains after the 50-50 elimination. In math terms, we want to solve for the conditional probability $P(\text{B is correct}|\text{B remains})$. Now that we have defined the conditional probability, we can write our version of the formula as follows:

$$P(\text{B is correct}|\text{B remains}) = \frac{P(\text{B remains}|\text{B is correct}) \times P(\text{B is correct})}{P(\text{B remains})}$$

Remember how I said that one of the conditional probabilities tends to be easy to solve? In our case, the conditional probability $P(\text{B remains}|\text{B is correct})$, is the easy one. We know if B is the correct answer, it can never be eliminated by the 50-50, so this probability is 100%. We also assumed B was the correct answer with 70% confidence, so $P(\text{B is correct})=0.7$. Therefore, our formula becomes:

$$P(\text{B is correct}|\text{B remains}) = \frac{1.0 \times 0.7}{P(\text{B remains})}$$

Once we calculate $P(\text{B remains})$, we will be able to solve the problem. How do we calculate the probability that B remains on the board after the 50-50? Let's use an example.

Suppose the true answer to the question is D. It would be impossible to eliminate the true answer for the 50-50, so the remaining options are to eliminate one of the three pairs, AB, AC, or BC. We will assume each of the pairs is eliminated with equal probability. Therefore B remains on the board one third of the time. The same holds if we assume the true answer is A, or if the true answer is C. If the true answer is B, then we know B can't be eliminated. When we combine each of these possibilities, we get this weighted sum:

$$P(\text{B remains}) = 3\times 0.1 \times \frac{1}{3} + 0.7\times1=0.8$$

Finally, we can solve for our desired quantity:

$$P(\text{B is correct}|\text{B remains}) = \frac{1.0 \times 0.7}{0.8}=\frac{7}{8}=87.5\%$$

It certainly pays to know Bayes's Theorem!
