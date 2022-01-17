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

This week the <a href="https://fivethirtyeight.com/features/when-the-riddler-met-wordle/">Riddler</a> takes on <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>. Many of you have likely been bombarded by unicode images like this, showing the meandering path from first guess to solution, and you may have even played the game yourself.

<ul style="list-style: None; text-align: center; line-height: 1.25em;">
  <li>Wordle 208 4/6</li>
  <li>⬜🟨🟨⬜⬜</li>
  <li>🟨🟨⬜⬜⬜</li>
  <li>🟩🟩🟨⬜⬜</li>
  <li>🟩🟩🟩🟩🟩</li>
</ul>

I've enjoyed playing Wordle over the last few weeks, loosely guided by what I learned when the <a href="/riddler-lingo">Riddler tackled Lingo</a> - a similar word guessing game. Up to this point I've left the dictionary and code to the side. However, it was only a matter of time before Riddler Nation wondered what an optimal strategy might look like. <a href="https://twitter.com/LaurentLessard/status/1478443959756152846?s=20">optimizing one's play</a>. As a result, this week, we're given the following task (paraphrased from the original).

<blockquote>

Your goal is to devise a strategy to maximize your probability of winning Wordle in at most three guesses. In particular, please describe:

1. your strategy
2. the first word you would guess
3. your probability of winning in three or fewer guesses

</blockquote>

To help us with this week's puzzle, we're allowed to use Wordle's lists of <a href="wordle-guesses.txt" rel="external">valid guesses</a> (12,972 words) and <a href="wordle-solutions.txt" rel="external">daily solutions</a> (2,315 words), both sorted alphabetically. Note, the guess list includes all words from the solutions list.

<aside class="remark">
<strong>A quick note about this solution:</strong> I was fascinated by this week's puzzle, but a toddler makes it hard to write the polished code and explanation I'd really like in a few hours over a weekend. Instead, I'm going for "good enough" - knowing I left a bit of performance on the table and can save this for a rainy day. So please enjoy the reading, forgive the typos, and stay tuned for an update to this solution when time permits.
</aside>

# Key Concept - Partitions

Before diving into the code and the solution, let's outline the concepts we need to solve this problem. The first key concept is something I'll call a **partition**.

A **partition** is a group of words comprised of the actual solution and any words we haven't been able to rule out based on the guesses we're already made. When we start the game, before making any guesses, all 2,315 words belong to a single partition, because any one of them could be the solution. We create smaller partitions by guessing and learning clues about the secret word. Hopefully, by the end, we'll have a partition with a single word, which we know is the solution.

With a bit of code, we can identify all the partitions that a given guess will create. For example, suppose our first guess is the word PARSE. Let's consider a few possible scenarios.

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

Now that we understand partitions, let's review how we can use them to devise a strategy. Dynamic programming is a problem solving method that helps identify the ideal decisions to make under uncertainty. I've used this technique on several prior puzzles, and I find it to be one of the most rewarding ways to solve a problem. It involves breaking a complex problem down into simpler sub-problems, solving them individually, and composing each of the parts into an overall optimized strategy.

Let's assume we're about to make our third guess. We will have a partition of words with size $N$. If we're lucky enough to have a partition with a single word, we will win the game. However, if we have a partition of size $N > 1$, then we have to guess randomly, and we will win with probability $1 / N$. In any case, there is virtually no strategic decision when it comes to the third guess; we just pick a random word from the partition. Therefore, our goal should be to identify second guesses that maximize the number of partitions for our third guess, because it means each partition will be small and will give us the best chance to win.

Finally, knowing how we will proceed with our second and third guesses, the goal for the first guess is to identify this single word that maximizes the win probability over all subsequent second and third guesses. Easier said than done!

While I was able to get an answer that seems promising, I feel certain that there are a few small optimizations I may have missed, faster code I could have written, and larger groups of words I could have searched. But, caveats aside, let's proceed to the solution itself.

# Solution

Rather than follow a true dynamic programming approach, which would have taken too long to calculate, I used a few heuristics. First, I calculated the number of partitions each word would produce if it were guessed first. For example, PARSE creates 146 partitions. That's good, but the best I found was the word TRACE, which splits the solutions into 150 partitions, two better than the next best words, CRATE, and SALET. I wasn't able to prove exhaustively that these words are the optimal starting words, but they seemed like a great place to start.

Next, assuming that I chose TRACE as my first word, I went through each of the 150 partitions and chose the guess that would split each one into the most sub-partitions. The final score simplifies to the number of sub-partitions within each original partition.

**Following this process, I calculated a win rate of $\frac{1327}{2315}$, or roughly 57.3%.**

Unfortunately, at various stages of my program, I only considered limited sets of candidate words, which I believe leads to suboptimal performance. Given a bit more time and some more careful code, I think there is more performance to eek out of the algorithm. In any case, I enjoyed the challenge this weekend, and look forward to spare moments in the future when I can revisit this puzzle and improve my result.

# Extra

Here are some of the best and worst words, based on the number of partitions they create as a first guess.

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

[^1]: Yep, this is actually a valid guess.

# Full Code

Fortunately I was able to reuse much of the code I wrote to solve <a href="/riddler-lingo">Riddler Lingo</a> a year ago. But a single weekend wasn't quite enough to write the polished code I would have preferred. Instead, I have a lot of scratch work that I'll try to clean up when I have a moment.
