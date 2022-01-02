---
title: Riddler Lingo
slug: riddler-lingo
date: "2021-01-29"
excerpt: It's the 256th edition of the Riddler, and though I've taken many weekends off to spend time with my newborn, I became obsessed with this week's puzzle! We're asked to play the word guessing game from Lingo, a game show. It reminds me of another one of my favorite Riddlers where we identify the best strategy for playing the math game from Countdown, another game show. The puzzle is extremely challenging, and I couldn't find an exact solution. Instead, I used Python to implement the game engine, and used some heuristics to choose words that resulted in a high score.
status: published
---

# Introduction

It's the 256th edition of the <a href="https://fivethirtyeight.com/features/can-you-guess-the-mystery-word/">Riddler</a>, and though I've taken many weekends off to spend time with my newborn, I became obsessed with this week's puzzle! We're asked to play the word guessing game from Lingo, a game show. It reminds me of another <a href="https://www.jtash.com/riddler-countdown">one of my favorite Riddlers</a> where we identify the best strategy for playing the math game from Countdown, another game show. The puzzle is extremely challenging, and I couldn't find an exact solution. Instead, I used Python to implement the game engine, and used some heuristics to choose words that resulted in a high score.

<blockquote>
You are a contestant on the game show Lingo, where your objective is to determine a five-letter mystery word. You are told this word’s first letter, after which you have five attempts to guess the word. You can guess any five-letter word, even one that has a different first letter. After each of your guesses, you are told which letters of your guess are also in the mystery word and whether any of the letters are in the correct position.

As a contestant, your plan is to make a mockery of the game show by adopting a bold strategy: No matter what, before you are even told what the first letter of the mystery word is, you have decided what your first four guesses will be. Then, with your fifth guess, you will use the results of your first four guesses (and your encyclopedic knowledge of five-letter words!) to determine all remaining possibilities for the mystery word. If multiple mystery words are still possible, you will pick one of these at random.

Which four five-letter words would you choose to maximize your chances of victory? Assume that the mystery word is selected randomly from this word list, which is also the list your guesses must be chosen from.

**Extra credit:** For the four five-letter words you chose, what are your chances of victory?

</blockquote>

Note: the word pool for this puzzle contains 8636 words. A brute force solution to this puzzle would need to test all combinations of four words. This would mean testing

$$
8636\times8635\times8634\times8633=5,558,386,740,958,920
$$

combinations. That's 5 quadrillion! If each combination took 1 second to test, we'd need to wait around for 176 million years. So... we'll have to try something different!

# Solution

I couldn't find a perfect solution this week, so instead I developed some heuristics for choosing words until I was able to get a score that seemed good. Ultimately, I landed on these four words:

<p align="center"><strong>hater, funds, pigmy, block</strong></p>

With these four words, I was able to achieve a **94.7% win rate.**

This strategy guesses perfectly for **7803 of the 8636** total words. When we can't guess the secret word exactly, we have to guess randomly from the possible secret words we've narrowed it down to.

You might notice something interesting about these four words: out of the 20 letters total, there are no repeats. This is one of the key components for the strategy. Here are some of the things I considered to arrive at these four words.

1. Choose as many unique letters as possible in your four guesses. Unique letters tell you the most about what is included in the secret word. If you can identify all 5 letters in the secret word, even out of order, it can reduce the possibilities significantly.
2. Guess letters that appear the most in the word pool. My guesses skipped over `j`, `q`, `v`, `w`, `x`, `z` because they are rarer than other letters.
3. Try to guess letters where they most often appear. For example, if a word has the letter `a`, if most often appears in the second position, like in the word `tacit`.

None of these rules may seem surprising. There are a few more things that I considered, but it's hard to tell exactly how these should factor into your guesses.

1. We are given the first letter of the secret word. I interpret this to mean that rule 3 above becomes less important for the first letter. For example, many words start with `s`, but many words also end with `s`. Each guess should try to get us as much **new** information as possible. If the word started with the letter `s`, we would know from the beginning, so it's more valuable to try to learn whether the word ends with `s` instead.
2. Try not to guess combinations of letters that logically follow from other things you know. For example, consider guessing the word `thing`. We are guessing that the secret word ends in the letter `g`. But if the secret word ends in the letter `g`, then it's very likely the second-to-last letter will be an `n`, and also likely the third-to-last letter will be `i`. (In fact, there are 88 words that end with the letter `g`, and 63 of those words also end in `ng`. 34 of them end in `ing`!) By guessing `ing` at the end of the word, we're duplicating what we could learn about the secret word. Instead, to learn as much as possible I think it makes more sense to guess irregular letter combinations, like `bourg`, which gets us the `g` ending but also adds a valuable `r` in the mix.
3. Try LOTS of combinations/anagrams of words :) There's probably a few small improvements I could make to these four words by jittering letters here and there.

# Methodology

I relied heavily on the computer to determine my four guesses. As I wrote above, a brute force solution is infeasible, so we'll have to rely on a hybrid approach, with code and intelligent guessing (fitting, for a puzzle about guessing words!)

First, I wrote a game engine in Python that plays the game. Given a secret word and a guess, the engine identifies the correct letters, the misplaced letters, letters than must be included in the secret word, and letters that must be excluded in the secret word. Later, the program returns a set of words that match all the criteria. Ultimately, if this list is narrowed down to a single word, then we know we can guess the secret word exactly.

For example, you write the following to show the facts you learn after guessing a single word.

```python
# example from the puzzle description
correct_letters(target="misos", guess="mosso")
# ('m', '', 's', '', '')
# first and third letters of our guess are correct

misplaced_letters(target="misos", guess="mosso")
# ('', 'o', '', 's', '')
# second and fourth letters are in the secret word, but not in those positions

included_letters(target="misos", guess="mosso")
# ('m', 'o', 'ss')
# this means the target word must have one `m`, one `o` and two `s`

excluded_letters(target="misos", guess="mosso")
# ('oo', )
# this means the target word cannot contain two 'o'
```

Then the game is played using a function called `solutions`. This function returns all the words that your guesses still permit. If there is only one word returned, then you know the secret word with certainty.

```python
words = get_words()  # get the list of 8636 5-letter words

# arguments are target word, any number of guesses, then a word list.
solutions("misos", "mosso", words=words)
# {'misos'}
# in this case, just guessing "mosso" was enough to solve the puzzle!

solutions("tacos", "teach", words=words)
# {'tacit', 'tacks', 'tacky', 'tacos', 'tacts', 'taroc', 'tical', 'triac'}
# in this case, guessing "teach" narrows down the search to 8 potential words
```

You can also write code to check how your four guesses perform on the entire word list. This is how I calculated the 94% accuracy and 7697 guaranteed correct guesses. Unfortunately, running through the entire word list takes ~15 seconds. (Work for the future!)

```python
words = get_words()  # get the list of 8636 5-letter words

# return a dictionary of all secret words and the list we narrow down to
results = {
    word: solutions(word, "hater", "funds", "pigmy", "block" words=words)
    for word in words
}

# how many can we guess correctly?
correct = sum(len(v) == 1 for v in results.values())
# 7803

# what is our accuracy? If there are multiple candidates, we guess randomly
accuracy = sum(1 / len(v) for v in results.values()) / len(words)
# 0.94719777

# what word was the hardest to guess?
stumper = max(results, key=lambda x: len(results[x]))
results[stumper]
# {'codec', 'coded', 'codex', 'coved', 'cowed', 'coxed'}
# any of these secret words can only be narrowed down to six alternatives
```

As for coming up with my words, I did a fair bit of data analysis:

1. Check for the most common letters overall
2. Check for the most common letters per position (first, second, ... fifth)
3. Use gibberish words to try to get a possible upper limit for the answer
4. Try to form valid words from the letters I want to use
5. Iterate... try new anagrams hoping for small improvements

Step 3 was interesting. I knew I wanted to use the 20 most common letters, and I was curious how good my score would be if I could guess any letter in any position. Here was the best solution I came up with:

```python
results = {
    word: solutions(word, "tares", "vbopd", "ynikl", "gmuch", words=words)
    for word in words
}
# accuracy: 0.94789
# n_correct: 7803
```

Without any real sense of the maximum possible score, I felt like this was a good benchmark to try to hit. After all, coming up with real words that contained exactly one of those letters, and to try to get the right letters in the right spots, was not easy!

As it happens, with my four real words, I was able to exactly match the number of secrets guessed exactly (7803), but my accuracy is just a few basis points shy, likely because of a few shorter lists when we had to guess.

This puzzle captivated me over the weekend! Writing the code and coming up with the guess words were both incredibly fun - and totally different - challenges. Great hallmarks of a wonderful puzzle. Now the question is whether my skills might translate to playing on the show itself!

# Full Code

I'm sure there are some efficiencies to be gained here. It currently takes ~15 seconds to check a set of guesses against every secret word in the dictionary, so iterating on new guessing ideas is very time consuming. Fortunately, playing the game for fun with single words works great! You can run a single secret word with guesses in a few milliseconds, so you can use this code to play with your friends!

Future work I might like to tackle someday:

1. create better data structures for some of the repeated tasks (e.g. matching words by the first letter, sorting letters in a word, etc.)
2. Try to map the underlying words more intelligently, identifying some of the correlated information embedded in the words, like pairs of letters that always go together. Try to fine tune the guess words not to waste time searching highly correlated spaces.

```python
"""
This module solves the Riddler Classic from January 29, 2020
https://fivethirtyeight.com/features/can-you-guess-the-mystery-word/
"""
from itertools import groupby
from urllib.request import urlopen
from typing import Iterable, Optional, Set, Tuple


# container for tuple of letters with the same length as the target word
Letters = Tuple[str, ...]


def get_words(length: int = 5) -> Set[str]:
    """Return a set of n-letter words from a large word list hosted online."""
    response = urlopen("https://norvig.com/ngrams/enable1.txt")
    words = response.read().decode("utf-8").split("\n")
    return set(word.lower() for word in words if len(word) == length)


def correct_letters(target: str, guess: Optional[str] = None) -> Letters:
    """
    Return a tuple identifying which letters in the target were correctly guessed.

    Examples
    --------
    >>> correct_letters("tacos")
    ('', '', '', '', '')
    >>> correct_letters("tacos", "tails")
    ('t', 'a', '', '', 's')
    >>> correct_letters("misos", "mosso")
    ('m', '', 's', '', '')
    >>> correct_letters("misos", "sassy")
    ('', '', 's', '', '')
    """
    if guess is None:
        return tuple('' for _ in target)
    return tuple(t if t == g else '' for t, g in zip(target, guess))


def misplaced_letters(target: str, guess: Optional[str] = None) -> Letters:
    """
    Return a tuple identifying which letters are present, but misplaced, in the target.

    When identifying misplaced letters, we only consider the first instance of a letter
    in the target. For example, with target 'misos' and guess 'mosso', the first 'o' in
    the guess is identified as a misplaced letter, but the second 'o' is ignored.

    Examples
    --------
    >>> misplaced_letters("tacos")
    ('', '', '', '', '')
    >>> misplaced_letters("tacos", "teach")
    ('', '', 'a', 'c', '')
    >>> misplaced_letters("misos", "sumps")
    ('s', '', 'm', '', '')
    >>> misplaced_letters("misos", "mosso")
    ('', 'o', '', 's', '')
    >>> misplaced_letters("misos", "sassy")
    ('s', '', '', '', '')
    """
    if guess is None:
        return tuple('' for _ in target)

    # before identifying misplaced letters, we need to account for correct letters
    # we only want to consider letters in the target that aren't in the correct spot.
    correct = correct_letters(target=target, guess=guess)
    available = [t for t, c in zip(target, correct) if c == '']

    misplaced = []
    for t, g in zip(target, guess):
        if t != g and g in available:
            # find misplaced letters in the target we haven't already counted
            misplaced.append(g)
            available.remove(g)
        else:
            misplaced.append('')
    return tuple(misplaced)


def included_letters(target: str, guess: Optional[str] = None) -> str:
    """
    Return a string of the letters that must be in the target, sorted alphabetically.

    If multiple of the same letter are included in the target, then we represent those
    letters together, e.g. 'ss' to mean the target includes at least two known 's'.

    Examples
    --------
    >>> included_letters("tacos")
    ('t',)
    >>> included_letters("tacos", "teach")
    ('a', 'c', 't')
    >>> included_letters("misos", "sumps")
    ('m', 'ss')
    >>> included_letters("misos", "mosso")
    ('m', 'o', 'ss')
    >>> included_letters("misos", "sassy")
    ('m', 'ss')
    """
    if guess is None:
        return tuple(target[0])

    # correct letters and misplaced letters are mutually exclusive groups that must be
    # present in the final word, so we include the union of both sets
    correct = correct_letters(target=target, guess=guess)
    misplaced = misplaced_letters(target=target, guess=guess)
    letters = sorted(letter for letter in correct + misplaced if letter)
    included = [k * len(list(v)) for k, v in groupby(letters)]

    # finally, before returning, ensure we include the starting letter of the target if
    # it's not already there, because it's known to the player from the start.
    if target[0] not in included:
        included = sorted(included + [target[0]])
    return tuple(included)


def excluded_letters(target: str, guess: Optional[str] = None) -> str:
    """
    Return a string of the letters that are not in the target, sorted alphabetically.

    Typically, letters that are not 'correct' or 'misplaced' will be excluded, as in
    letters 'e' and 'h' from target 'tacos' and guess 'teach'. However, we may also be
    able to exclude second or third occurrences of letters, like with target 'misos'
    and guess 'mosso': we know that the target word must contain exactly one 'o'. We
    express this by excluding 'oo', which must not occur in the sorted target word.

    Examples
    --------
    >>> excluded_letters("tacos")
    ()
    >>> excluded_letters("tacos", "teach")
    ('e', 'h')
    >>> excluded_letters("misos", "sumps")
    ('p', 'u')
    >>> excluded_letters("misos", "mosso")
    ('oo',)
    >>> excluded_letters("misos", "sassy")
    ('a', 'sss', 'y')
    """
    if guess is None:
        return tuple()

    guessed = set(k * len(list(v)) for k, v in groupby(sorted(guess)))
    included = set(included_letters(target=target, guess=guess))
    return tuple(sorted(guessed - included))


def solutions(target: str, *guesses: str, words: Iterable[str]) -> Set[str]:
    """
    Return a set of the possible solutions, given any number of guesses and a target.

    Internally, this function will check each guess for the following:
        1. correct letters - letters in the right place
        2. misplaced letters - letters present in the target but in the wrong place
        3. included letters - letters we know must be in the target word
        4. excluded letters - letters we know must not be in the target word

    Then we take what we know from steps 1-4 and apply it to the word list, returning
    the set of words that meet all the criteria we identified.
    """
    # proceed recursively, one guess at a time, through each of the criteria, shrinking
    # the word list each time until we narrow down the surviving candidate words.
    if len(guesses) == 0:
        guesses = [None]

    for guess in guesses:
        correct = correct_letters(target=target, guess=guess)
        misplaced = misplaced_letters(target=target, guess=guess)
        included = included_letters(target=target, guess=guess)
        excluded = excluded_letters(target=target, guess=guess)
        words = {
            w for w in words if
            w[0] == target[0]
            and all(x in "".join(sorted(w)) for x in included)
            and all(x not in "".join(sorted(w)) for x in excluded)
            and all((x or z) == z and y != z for x, y, z in zip(correct, misplaced, w))
        }
    return words
```
