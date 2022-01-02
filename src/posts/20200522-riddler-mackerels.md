---
title: Riddler Mackerels
slug: riddler-mackerels
date: "2020-05-22"
excerpt: This week's Riddler starts with a peculiar fact - "Ohio" doesn't share any letters with the word "mackerel", and it's the only state for which that is true. How many other state/word combinations can we find, and which states match with the longest words? We'll use python's super efficient sets, lists, and dictionaries to crunch millions of combinations in under two seconds to find the answer.
status: published
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/somethings-fishy-in-the-state-of-the-riddler/">Riddler</a> starts with a peculiar fact - "Ohio" doesn't share any letters with the word "mackerel", and it's the only state for which that is true. How many other state/word combinations can we find, and which states match with the longest words? We'll use python's super efficient sets, lists, and dictionaries to crunch millions of combinations in under two seconds to find the answer.

<blockquote>
Ohio is the only state whose name doesn’t share any letters with the word “mackerel.” It’s strange, but it’s true.

But that isn’t the only pairing of a state and a word you can say that about — it’s not even the only fish! Kentucky has “goldfish” to itself, Montana has “jellyfish” and Delaware has “monkfish,” just to name a few.

What is the longest “mackerel?” That is, what is the longest word that doesn’t share any letters with exactly one state? (If multiple “mackerels” are tied for being the longest, can you find them all?)

**Extra credit:** Which state has the most “mackerels?” That is, which state has the most words for which it is the only state without any letters in common with those words?

</blockquote>

# Solution

Fortunately I have a list of US states handy from a <a href="/riddler-state-superstrings">prior Riddler</a>, so that should save a bit of time :)

First, a comment on the word list: it contains 263,533 words, including such vernacular staples as "aa" (a form of lava flow), and "zzz" (a snoring sound), both of which are valid in Scrabble. If there's a better validation of a word than its inclusion in the Scrabble dictionary, I'm not aware of it!

Of those 263,533 words, the longest "mackerel" is a tie between the 23-letter powerhouses **counterproductivenesses**, which belongs to Alabama, and **hydrochlorofluorocarbon**, which belongs to Mississippi. (Sorry _pneumonoultramicroscopicsilicovolcanoconiosis_, your 45 letters were claimed by all 50 states.)

As for the extra credit, the mackereliest (not a valid scrabble word) state is... **Ohio!** It is the proud owner of 11,342 mackerels, ranging from "man" to "untranslatablenesses" (much like some of the longest words on this list.)

# Methodology

Like <a href="https://www.jtash.com/riddler-spelling-hexagons">other word puzzles</a> we've seen before, I was amazed at the power of my computer to solve this problem using brute force. The brute force approach tests the overlap between each word (263k) and each state (50) for more than 13 million comparisons in total. Fortunately, on my computer, these comparisons took less than two seconds! Here's how to solve it with efficient python code.

First, the setup: we need to download the word list. I'll use `urllib` to request the words and parse them into a list.

```python
from urllib.request import urlopen

def get_words(url: str = "https://norvig.com/ngrams/word.list") -> List[str]:
    """Downloads and returns a set of words from the web"""
    response = urlopen(url)
    return response.read().decode("utf-8").split("\n")
```

For the actual work, I took advantage of a few data structures in python that are well suited to this task: sets, lists, and dictionaries. For example, instead of comparing "Alabama" with "ambulance", it is much faster to compare the `set` of letters in each word. Sets are data containers with unique elements, so the set of letters in "alabama" is `{'a', 'b', 'l', 'm'}`. We can quickly test whether sets have any overlap in a lightning fast built-in function called `isdisjoint`.

```python
set("alabama")
# {'a', 'b', 'l', 'm'}

set("ambulance")
# {'a', 'b', 'c', 'e', 'l', 'm', 'n', 'u'}

# isdisjoint returns a boolean indicating if the sets have any overlap
# we should expect False here, because they share at least one letter.
set("alabama").isdisjoint(set("ambulance"))
# False

# verify that "ohio" doesn't share letters with "mackerel"
set("ohio").isdisjoint(set("mackerel"))
# True
```

Because we want to test every state for every word, it makes sense to store the sets of letters for each state. This saves a bit of time because we only convert the state names into sets of letters once. If we didn't do this small optimization, the program would take roughly four seconds instead of two. Still a small number, but worth a 50% speedup!

```python
# STATES is a list of states ["Alabama", "Alaska", ...]
# create sets of letters: case sensitive, so we call .lower(), and remove spaces
STATES = {state: set(state.lower().replace(" ", "")) for state in STATES}
```

Now, for a given word we want to find all the states that don't share any letters with it. If the result of `disjoint_states` is a list with a single state, then we know we've found a "mackerel". All that remains is to loop through the entire word list and filter for the words that only match with a single state, which we do in `get_mackerels`.

```python
def disjoint_states(word: str) -> List[str]:
    """
    Returns a list of states that share no letters with the given word.
    If no states meet the criteria, then returns an empty list, [].

    Examples
    --------
    >>> disjoint_states("mackerel")
    ['Ohio']

    >>> disjoint_states("abcdefghijklmnopqrstuvwxyz")
    []
    """
    word_letters = set(word)
    return [
        state for state, state_letters in STATES.items()
        if word_letters.isdisjoint(state_letters)
    ]


def get_mackerels() -> Dict[str, str]:
    """
    Returns a dictionary of "mackerels" - words that share letters with only one
    state and no others. Output will be {word: state} for all mackerel words.
    """
    # loop through the whole word list - it is still pretty quick for 250k words
    mackerels = {word: disjoint_states(word) for word in get_words()}
    return {word: state[0] for word, state in mackerels if len(state) == 1}
```

These functions create a dictionary of `{word: state}`, for the words that have no overlap with a single state. The puzzle asked for the longest of these words, so we need to do a little post-processing. Here we take the dictionary and sort it by the longest word. This snippet shows the top-10 longest words and the single state with which they have no overlap.

```python
results = get_mackerels()  # returns a dictionary of words and their states
sorted(results.items(), key=lambda x: len(x[0]), reverse=True)[:10]
# [('counterproductivenesses', 'Alabama'),
#  ('hydrochlorofluorocarbon', 'Mississippi'),
#  ('counterproductiveness', 'Alabama'),
#  ('unconscientiousnesses', 'Alabama'),
#  ('counterconditionings', 'Alabama'),
#  ('deoxycorticosterones', 'Alabama'),
#  ('expressionlessnesses', 'Utah'),
#  ('hyperconsciousnesses', 'Alabama'),
#  ('hypersensitivenesses', 'Alabama'),
#  ('incompressiblenesses', 'Utah')]
```

And lastly, to answer the extra credit, we want to count the number of times each state shows up in our dictionary. We run through the states in the dictionary, grouping them together and summing the number of occurrences for each. Lastly, we sort the results by the highest count, and show the top-10 results.

```python
from itertools import groupby

extra_credit = {k: len(list(v)) for k, v in groupby(sorted(results.values()))}
sorted(out.items(), key=lambda x: x[1], reverse=True)[:10]
# [('Ohio', 11342),
#  ('Alabama', 8274),
#  ('Utah', 6619),
#  ('Mississippi', 4863),
#  ('Hawaii', 1763),
#  ('Kentucky', 1580),
#  ('Wyoming', 1364),
#  ('Tennessee', 1339),
#  ('Alaska', 1261),
#  ('Nevada', 1229)]
```
