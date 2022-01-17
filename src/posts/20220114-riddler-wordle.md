---
title: Riddler Wordle
slug: riddler-wordle
date: "2022-01-14"
excerpt: This week the Riddler takes on Wordle. I'll write code with the goal of solving any mystery word in three or fewer guesses.
tags: ["dynamic programming", "math", "optimization", "puzzles", "python"]
relatedPosts: ["riddler-countdown", "riddler-lingo"]
status: published
---

# Introduction

This week the <a href="https://fivethirtyeight.com/features/when-the-riddler-met-wordle/">Riddler</a> takes on <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>. Many of your social media feeds have likely been bombarded by images like this, showing the meandering path from first guess to solution, and you may have even played the game yourself.

<ul style="list-style: None; text-align: center; line-height: 1.25em;">
  <li>Wordle 208 4/6</li>
  <li>⬜🟨🟨⬜⬜</li>
  <li>🟨🟨⬜⬜⬜</li>
  <li>🟩🟩🟨⬜⬜</li>
  <li>🟩🟩🟩🟩🟩</li>
</ul>

I've enjoyed playing Wordle over the last few weeks too. My strategy is loosely guided by what I learned when the <a href="/riddler-lingo">Riddler tackled Lingo</a> - a similar word guessing game, but so far I've left the dictionary and code off to the side. It was only a matter of time before Riddler Nation asked what an optimal strategy might look like. As a result, this week, we're given the following task.

<blockquote>

Your goal is to devise a strategy to maximize your probability of winning Wordle in at most three guesses. In particular, please describe:

1. your strategy
2. the first word you would guess
3. your probability of winning in three or fewer guesses

</blockquote>

To help us with this week's puzzle, we're allowed to use Wordle's lists of <a href="wordle-guesses.txt" rel="external">valid guesses</a> (12,972 words) and <a href="wordle-solutions.txt" rel="external">daily solutions</a> (2,315 words). Note, the guess list includes all words from the solutions list.

<aside class="remark">
<strong>A quick note about this solution:</strong> I was fascinated by this week's puzzle, but a toddler makes it hard to write the polished code and explanation I'd really like in a few hours over a weekend. Instead, I'm going for "good enough" - knowing I left a bit of performance on the table and can save this for a rainy day. So please enjoy the reading, forgive the typos, and keep an eye out for a future update to this solution when time permits.
</aside>

# Setup

Before diving into the code and the solution, let's outline the concepts we need to solve this problem. The first key concept is something I'll call a **partition**.

A **partition** is the set of words that are still candidates to solve the puzzle, given the clues we have from our previous guesses. When we start the game, before making any guesses, all 2,315 words belong to a single partition, because any one of them could be the solution. When we guess new words, we shrink the partition as we learn new clues about the secret word. Hopefully, by the end, we'll have a partition with a single word, which is the secret word.

We can start asking interesting questions about partitions, like "what word will split this partition into the most sub-partitions?" With a bit of code, we can identify all the partitions that a given guess will create. For example, suppose our first guess is the word PARSE. Let's consider a few possible scenarios.

<ol>
  <li>
    None of the letters are a match (as in BUILT).
    <ul>
      <li>We know the secret word belongs to a partition of 270 words.</li>
      <li>The best next guess is the word CLINT, which subdivides the 270 words into 82 new partitions.</li>
      <li>Our average win rate simplifies to 82/270, or ≈30%.</li>
      <li>If the secret word were BUILT, we would have narrowed it down to {BUILT, GUILT, QUILT}, and we would guess randomly.</li>
    </ul>
  </li>
  <li>
    There is a P in the secret word, but it's not the first letter, and no other letters match (as in TOPIC).
    <ul>
      <li>We know the secret word belongs to a partition of 25 words.</li>
      <li>The best next guess is the word DIMLY, which subdivides the 25 words into 21 new partitions.</li>
      <li>Our average win rate simplifies to 21/25, or 84%.</li>
      <li>If the secret word were TOPIC, we would have narrowed it down to {INPUT, OPTIC, TOPIC, UNZIP}, and we would guess randomly. (One of the unlucky cases in this set.)</li>
    </ul>
  </li>
  <li>
    The letters A, R, and E are correct and in the right position, and no other letters match (as in BARGE).
    <ul>
      <li>We know the secret word belongs to a partition of 4 words.</li>
      <li>There are many equally good next guesses, but the first in alphabetical order is ALECK, which gives us enough information to create four partitions with a single word in each, guaranteeing a solve in three guesses.</li>
      <li>Our average win rate will be 100%!</li>
    </ul>
  </li>
</ol>

Now that we understand partitions, let's review how we can use them to devise a strategy.

# Strategy

Let's assume we're about to make our third guess. We will have a partition of words with size $N$. If we're lucky enough to have a partition with a single word, we will win the game. However, if we have a partition of size $N > 1$, then we have to guess randomly, and we will win with probability $1 / N$. In any case, there is virtually no strategic decision when it comes to the third guess; we just pick a random word from the partition. Therefore, our goal should be to identify second guesses that maximize the number of partitions for our third guess, because it means each partition will be small and will give us the best chance to win.

Consequently, we want to pick first guesses that make our second guesses more effective. Roughly speaking, we want to search all possible first guesses, knowing how we'll handle second and third guesses based on the results. This is much easier said than done!

While I was able to get an answer that seems promising, I have a feeling there are a few small optimizations I may have missed, faster code I could have written, and larger groups of words I could have searched. But, caveats aside, let's proceed to the solution itself.

# Solution

Rather than follow a true dynamic programming approach, which would have taken too long to calculate, I used a few heuristics. First, I calculated the number of partitions each word would produce if it were guessed first. For example, PARSE creates 146 partitions. That's good, but the best I found was the word TRACE, which splits the solutions into 150 partitions, two better than the next best words, CRATE, and SALET. I wasn't able to prove exhaustively that these words are the optimal starting words, but they seemed like a great place to start.

Next, assuming that I chose TRACE as my first word, I went through each of the 150 partitions and chose the second word that splits each one into the most sub-partitions. Finally, I calculated the win probability based on the partition size for each of my third guesses.

**This strategy produces a win rate of $\frac{1383}{2315}$, or roughly 59.7%.**

At various points in my code I trimmed the list of words to search, hoping to produce results in a reasonable amount of time. However, I believe these shortcuts likely led to suboptimal performance. A true solution would consider the full set of valid guess words at each stage, and would result in a truly optimal strategy.

Given a bit more time and some more careful code, I think there is more performance to eek out of my algorithm. In any case, I enjoyed the challenge this weekend, and look forward to spare moments in the future when I can revisit this puzzle and improve my result.

# Fun Facts

Here are some of the best and worst words, based on the number of partitions they create as a first guess. Spoiler alert: don't use SQUIZ as your first guess! It provides the least possible information among all words that still have 5 unique letters.

| Word       | Partitions |
| ---------- | ---------- |
| TRACE      | 150        |
| CRATE      | 148        |
| SALET      | 148        |
| SLATE      | 147        |
| REAST      | 147        |
| PARSE      | 146        |
| ...        | ...        |
| OZEKI      | 44         |
| WAQFS [^1] | 42         |
| SQUIZ      | 39         |

[^1]: Yep, this is actually a valid Wordle guess.

# Full Code

Fortunately I was able to reuse much of the code I wrote to solve <a href="/riddler-lingo">Riddler Lingo</a> a year ago. I wasn't able to write the polished code I would have preferred, but here are some of the useful helper functions I used this week.

The basic idea is to create a set of partitions for a given first guess, then find the "best splitting word" for your second guess - the word that splits the first partition into as many sub-partitions as possible. Finally, we can calculate the probability of winning by summing the number of partitions from all branching paths and dividing by the number of total answers.

```python
# `solutions` is a function from riddler-lingo that returns a list of words
# that are still potential solutions to the puzzle, based on guesses so far
from riddler.lingo import solutions


def partitions(guess: str, words: Iterable[str]) -> List[Tuple[str, ...]]:
    """Return a list of partitions - words that are grouped together."""
    wordset = set(words)
    out = []

    while len(wordset) > 0:
        word = sorted(wordset)[0]
        partition = set(solutions(word, guess, words=words))
        out.append(tuple(sorted(partition)))
        wordset = wordset - partition
    return out


def best_splitting_word(
    partition: Iterable[str], words: Iterable[str]
) -> Tuple[str, int]:
    """Return the word that splits a partition into the most sub-partitions."""
    out = {}
    for word in words:
        p = partitions(word, partition)
        out[word] = len(p)
        if len(p) == len(partition):
            break
    return sorted(out.items(), key=lambda x: x[1], reverse=True)[0]
```
