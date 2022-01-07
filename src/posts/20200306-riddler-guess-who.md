---
title: Riddler Guess Who
slug: riddler-guess-who
date: "2020-03-06"
excerpt: We take all the "guess work" out of a classic board game in this week's Riddler - solving for the optimal strategy in Guess Who! My trusted technique of dynamic programming makes a (predictable) reappearance.
tags: ["dynamic programming", "puzzles", "python"]
relatedPosts:
  [
    "riddler-flips",
    "riddler-dowries",
    "riddler-pennies",
    "riddler-bowling-dice",
    "riddler-chocolates",
  ]
status: published
---

# Introduction

We take all the "guess work" out of a classic board game in this week's <a href="https://fivethirtyeight.com/features/how-good-are-you-at-guess-who/">Riddler</a> - solving for the optimal strategy in Guess Who! My trusted technique of dynamic programming makes a (predictable) reappearance.

<blockquote>
In the game of “Guess Who,” each player first randomly (and independently of their opponent) selects one of N character tiles. While it’s unlikely, both players can choose the same character. Each of the N characters is distinct in appearance — for example, characters have different skin tones, hair color, hair length and accessories like hats or glasses.

Each player also has access to a board with images of all N characters. The players alternate taking turns, and during each turn a player has two options:

- Make a specific guess as to their opponent’s selected character. If correct, the player who made the guess immediately wins. Otherwise, that player immediately loses.
- Ask a yes-or-no question about their opponent’s chosen character, in order to eliminate some of the candidates. Importantly, if only one possible character is left after the question, the player must still wait until their next turn to officially guess that character.

Assume both players are highly skilled at choosing yes-or-no questions, so that they can always craft a question to potentially rule out (or in) any desired number of candidates. Also, both are playing to maximize their own probability of winning.

Let’s keep things (relatively) simple, and suppose that N = 4. How likely is it that the player who goes first will win?

**Extra credit:** If N is instead 24 (the number of characters in the original “Guess Who” game), now how likely is it that the player who goes first will win?

**Extra extra credit:** If N is instead 14, now how likely is it that the player who goes first will win?

</blockquote>

# Solution

**Going first is a meaningful advantage in this game. For the 4-card variant, the player going first is expected to win 56.25% of games played. For 24 cards, it is 55.56%, and for 14 cards it is 56.12%.**

How can we make this a bit more equitable? One option is to assign more cards to the player going first. For example, if the player going second has 24 cards, then the player going first would need 32 cards to make it a fair game.

# Strategy

Now that we know the optimal win percentages, what moves should we actually play?

- **4 vs. 4:** The ideal strategy if going first is to ask a question to rule out either 1 or 3 characters. This results in a 75% win percent if we eliminate 3 characters (33% chance), and a 50% win rate if we only eliminate 1 character (66% chance). Therefore the expected value of this move is a win percentage of 56.25%. On the other hand, if we eliminated two characters instead, we would win just 50% of the time.
- **24 vs. 24:** We have some flexibility in our approach for this game. Our best play is to ask a question to eliminate anywhere from 8 to 16 characters. Any of those choices results in a 55.56% expected win percent. Suppose we choose $n=12$. Then we will have 12 characters face up, our opponent will have 24, and it will be their turn. Their best move is also to ask $n=12$, and we'll have a new turn with 12 cards up each. This time, any $n$ from 4 to 8 keeps our win percent at 55.56%. If we choose $n=6$, our opponent will do the same, and both players will have 6 cards face up. From here, any $n$ from 2-4 will do. If we both choose $n=3$, then we have a game with 3 cards each, where our only reasonable option next is to ask a question to eliminate either 1 or 2 characters.
- **14 vs. 14:** Now it gets interesting! Our best move is to ask a question to eliminate 4/10 or 6/8 of the characters. Choosing 5/9 or 7/7 actually reduces our win rate by roughly 1%! Therefore, this is one situation that creates variance - multiple paths - immediately after the first move. If we choose $n=6$, we could find ourselves with either 6 or 8 cards face up before we pass the turn. In both of those cases, the ideal move for the opponent is to eliminate either 6, 7 or 8 characters. Suppose they choose 7. Now we would have a turn with 6 or 8 face up cards ourselves, and 7 face up cards for the opponent. Again, we have to be careful about our next move. We want to guess even numbers only: either 2, 4, or 6 (if possible). Ultimately, our ideal strategy results in an expected win rate of 56.12%.

# Methodology

Perhaps my solutions have become a bit too predictable? Friendly Riddler Nation member James Chapman intuited my problem solving process before I had even put pen to paper!

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">Have a feeling I know how <a href="https://twitter.com/ashjasont?ref_src=twsrc%5Etfw">@ashjasont</a> will approach this one! Luckily I&#39;ve learnt from following his solutions in recent weeks :)</p>&mdash; James Chapman (@chapmajw) <a href="https://twitter.com/chapmajw/status/1235929432260521984?ref_src=twsrc%5Etfw">March 6, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Undeterred, (and flattered) I proceeded as predicted with my <a href="/riddler-flips">trusted</a> <a href="/riddler-dowries">puzzling</a> <a href="/riddler-pennies">technique</a>: dynamic programming. In dynamic programming, we evaluate simple sub-problems, often repeatedly, in order to solve more complex problems.

A convention I've found useful in problems like this is to model the world in terms of "GameStates". A GameState encapsulates everything we know about the game, which is all we need to decide our best play. This is a valid technique because the game we are modeling is <a href="https://en.wikipedia.org/wiki/Markov_property">memoryless</a>, meaning that the best action to take now doesn't depend on what happened in the past. Even much more complicated games like chess and <a href="https://en.wikipedia.org/wiki/Go_(game)">go</a> have this property. Regardless of the order of moves to this point, the game can be completely described by the current arrangement of the pieces.

In Guess Who, the GameState can be captured with just two variables: the number of face-up characters remaining for each player. We always list the guessing player's cards first. For example, if the player currently guessing has 10 face-up characters and the other player has 12, then we would write `GameState(a=10, b=12)`.

Now we try to identify simple sub-problems and work our way to more complex problems as a way to solve the puzzle. In this game, the simplest sub-problem is when we have a GameState with `a=1`. Regardless of the number of face-up characters for player B, player A can win immediately by guessing the only remaining character and winning 100% of the time. So we know any GameState with `a=1` should result in an expected value of 100%.

We also know what to do if the _opponent_ has a single character remaining. The opponent is guaranteed to win next turn, so we have the best outcome if we guess a random character and hope for the best: even our unlikely guess is better than a guaranteed loss. Therefore, any GameState with `b=1` results in an expected value of `1/a`.

If the case is more complex, for example `GameState(a=4, b=4)`, then we want to evaluate all the possible moves player A could make in order to choose the best one. What are those moves?

- Ask a question to eliminate either 1 or 3 characters, with probability $\frac{1}{4}$ or $\frac{3}{4}$, respectively.
- Ask a question that would leave 2 characters remaining.
- Guess a random character, and win the game with probability $\frac{1}{4}$.

Several of these moves result in new GameStates, which we evaluate the same way - enumerating each of the possible moves from those states and choosing the best one. When a move creates two GameStates, we calculate the weighted average of the result. A subtle trick here is that we model alternating turns by switching `a` and `b` each time, then we calculate the complement of our opponent's win percentage when it's their turn. For example, a 60% win rate for our opponent is the same as a 40% win rate for us.

As we trace through each of these branches, we create a table of expected values for each GameState in order to avoid repeating calculations we've already performed. The final result is a python function that returns the expected value (i.e. win percent) from any given GameState.

```python
>>> GameState(a=4, b=4).expected_value()
0.5625

>>> GameState(a=24, b=24).expected_value()
0.5555555555555556

>>> GameState(a=14, b=14).expected_value()
0.5612244897959183
```

# Full Code

The `GameState` class has methods to return the expected value for any number of characters. It's nearly instant for games with a few hundred cards, but isn't designed to scale well for much larger games.

```python
from collections import namedtuple


class GameState(namedtuple("GameState", "a b")):
    """
    A GameState represents the number of face-up cards for each player
    at any given point in the game. (It doesn't matter how many cards
    are face down.) The GameState has two variables, "a", and "b", to
    represent the number of face-up cards for each player. We assume
    player "a" is currently guessing, and calling the "expected_value"
    method returns the probability (e.g. 75%) that player "a" will win
    from this position, assuming optimal play from both players.

    Parameters
    ----------
    a : int, the number of face-up character cards for player A
    b : int, the number of face-up character cards for player B

    Examples
    --------
    >>> GameState(a=4, b=4).expected_value()
    0.5625

    >>> GameState(a=24, b=24).expected_value()
    0.5555555555555556

    >>> GameState(a=14, b=14).expected_value()
    0.5612244897959183
    """

    cache: dict = {}

    def ask(self, n) -> list:
        """
        On your turn, you can ask a question that is designed to rule
        out "n" of the remaining face-up cards, where n is in [1, a).

        The answer can be either yes or no, which produces two new
        GameStates, and it becomes player b's turn. Therefore, we
        could have a new number of face up cards of (a - n) or (n),
        with weights (a - n) / a and n / a, respectively, and we flip
        the position of the a and b cards to account for the fact that
        player "b" gets to go next.

        Parameters
        ----------
        n : int, the number of cards you seek to eliminate

        Returns
        -------
        states : list[tuples], a list of tuples of (new_state, likelihood)

        Examples
        --------
        >>> GameState(a=15, b=15).ask(3)
        [(GameState(a=15, b=12), 0.8), (GameState(a=15, b=3), 0.2)]

        >>> GameState(a=8, b=10).ask(7)
        [(GameState(a=10, b=1), 0.125), (GameState(a=10, b=7), 0.875)]

        >>> GameState(a=5, b=7).ask(5)
        Traceback (most recent call last):
        ...
        ValueError: n cannot be greater than 4
        """
        if n > self.a - 1:
            raise ValueError(f"n cannot be greater than {self.a - 1}")
        if n < 1:
            raise ValueError(f"n must be greater than 0")
        return [
            (GameState(self.b, self.a - n), (self.a - n) / self.a),
            (GameState(self.b, n), n / self.a)
        ]

    def expected_value(self) -> float:
        """
        Returns the probability of player A winning from this GameState,
        based on optimal play from each player from this position forward.

        Examples
        --------
        >>> GameState(a=1, b=5).expected_value()
        1.0

        >>> GameState(a=10, b=1).expected_value()
        0.1

        >>> GameState(a=2, b=2).expected_value()
        0.5
        """
        try:
            return self.cache[self]
        except KeyError:
            if self.a == 1:
                # only one card remaining; we can win this turn by guessing
                self.cache[self] = 1.0
            else:
                # we have two options: we could guess a single person, or we
                # could ask a question to eliminate "n" people; we test all
                # values of "n" and the GameStates they produce, then choose
                # the one that produces the best outcome. Finally, we check
                # whether we could do even better by guessing a single card
                asks = (self.ask(n) for n in range(1, self.a))
                best_ask = 1 - min(
                    sum(gs.expected_value() * w for gs, w in ask)
                    for ask in asks
                )
                best_guess = 1 / self.a
                self.cache[self] = max(best_guess, best_ask)
            return self.cache[self]


if __name__ == "__main__":
    import doctest

    doctest.testmod()
```
