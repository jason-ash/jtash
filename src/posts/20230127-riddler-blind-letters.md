---
title: Riddler Blind Letters
slug: riddler-blind-letters
date: "2023-01-27"
excerpt: This week's puzzle was a great opportunity to build my skills writing rust - a lower-level, fast programming language. I ran millions of game simulations to find the optimal strategy!
tags: ["dynamic programming", "puzzles", "rust"]
relatedPosts: []
status: published
---

# Introduction

With two young kids, I don't have as much time to solve the Riddler as I used to. Nevertheless, when a really challenging or unique puzzle appears, I can't resist. <a href="https://fivethirtyeight.com/features/can-you-defeat-the-tiktok-meme/">This week's puzzle</a> was a great opportunity to start building my skills writing rust - a lower-level, super fast programming language. This was a perfect stress test for the language, because I needed to run millions and millions of game simulations. Spoiler alert: rust was the perfect choice!

<blockquote>
The #blindletterchallenge has recently taken TikTok by storm. In this challenge, you are presented with five letters, one at a time. Letters are picked randomly, but you can assume that no two letters are the same (i.e., letters are picked without replacement). As each letter is presented, you must identify which of five slots you will place it. The goal is for the letters in all five slots to be in alphabetical order at the end.

If you play with an optimal strategy, always placing letters in slots to maximize your chances of victory, what is your probability of winning?

</blockquote>

# Approach

The goal is to identify the ideal location for each letter we get, given the other letters we've already placed. But the only way we will know that is to imagine all the next letters we might get and where we might place _those_. It's a combinatorial explosion of possible letters and possible indices. Fortunately, like <a href="/riddler-wordle">many</a> <a href="/riddler-chocolates">other</a> <a href="/riddler-bowling-dice">problems</a> that I find interesting, this problem lends itself well to a dynamic programming approach.

We'll write a program that will play the game in reverse: it will evaluate whether we win or lose based on the final letter we get, taking into account all the possible ways we could have arranged the letters we got beforehand. Then it will backtrack to the penultimate letter and decide, given our perfect knowledge of how the game might end, the best location for this letter. We proceed backwards until we identify the best opening move, knowing how we will play at all future steps.

How many possible combinations do we have to check? We need to check every five-letter permutation from the alphabet, and every possible index position for each letter as we get them. For example, we need to check getting the letter "A", then placing it in slot 1. Then we play all future games along that path. Next, we go back and imagine placing the "A" in slot 2 and playing future games from there. We do this for every letter and index.

I believe this means we check all five-letter permutations ($26 * 25 * 24 * 23 * 22 = 7,893,600$) and all possible indices for the letters as we get them ($5 * 4 * 3 * 2 * 1 = 120$). We multiply those together to get $947,232,000$ possible games. (Anyone care to fact check me here?)

# Intuition

Before writing the code, I tried to think about what strategies might be reasonable. With 26 letters in the alphabet, it seemed to me like the opening move was pretty straightforward: divide the letters into four groups of five and one group of 6, according roughly to the quintiles.

| letters            | slot |
| ------------------ | ---- |
| (a, b, c, d, e)    | 1    |
| (f, g, h, i, j)    | 2    |
| (k, l, m, n, o, p) | 3    |
| (q, r, s, t, u)    | 4    |
| (v, w, x, y, z)    | 5    |

However, I'm glad I wrote code without this assumption baked in, because it turns out the ideal strategy didn't quite match my intuition!

# Solution

**It turns out that you should expect to win this game 25.43% of the time.** Somewhat obviously, the best opening letters are A and Z. If you start with those letters, your win probability jumps to 37.37%. The worst letters to start with are D and W, which, as we'll see, are the last letters you would want to include in slots 1 and 5, respectively. If you start with those letters, your win percentage drops to 21.91%. There's a big asymmetry here, in that the best letters improve your odds of winning substantially, and the worst letters are only slightly worse than your expected win rate at the beginning of the game.

What I found most interesting is that my intuition of the best starting slots was not quite right. It turns out that you want to reserve slots 1 and 5 for the first/last _four_ letters of the alphabet only (at least on the opening move). Then you want to create three groups of six letters for slots 2, 3, and 4. Here are all the starting letters, the best slot, and the win percentage from that point forward:

| Opening Letter | Slot | Win Percentage      |
| -------------- | ---- | ------------------- |
| A              | 1    | 0.3737285902503294  |
| B              | 1    | 0.3150065876152833  |
| C              | 1    | 0.2635144927536231  |
| D              | 1    | 0.21910408432147563 |
| E              | 2    | 0.2295652173913043  |
| F              | 2    | 0.24611330698287223 |
| G              | 2    | 0.2523320158102766  |
| H              | 2    | 0.2488274044795784  |
| I              | 2    | 0.2375757575757575  |
| J              | 2    | 0.22079051383399215 |
| K              | 3    | 0.22272727272727266 |
| L              | 3    | 0.2351778656126483  |
| M              | 3    | 0.24189723320158113 |
| N              | 3    | 0.24189723320158107 |
| O              | 3    | 0.23517786561264828 |
| P              | 3    | 0.22272727272727275 |
| Q              | 4    | 0.220790513833992   |
| R              | 4    | 0.23757575757575755 |
| S              | 4    | 0.24882740447957846 |
| T              | 4    | 0.25233201581027653 |
| U              | 4    | 0.2461133069828721  |
| V              | 4    | 0.22956521739130434 |
| W              | 5    | 0.21910408432147563 |
| X              | 5    | 0.2635144927536231  |
| Y              | 5    | 0.3150065876152833  |
| Z              | 5    | 0.373728590250329   |

There's obvious symmetry here, but the main takeaway for me is that it's important to preserve optionality and not commit to slots 1 and 5 before you've seen more information, or unless you have a letter far to the beginning or end of the alphabet.

# Full Code

This was my first foray into a non-trivial project with Rust. I was super impressed with the speed and expressiveness of the language in helping me to define my framework. And of course the raw speed of the calculations was important too. With no real optimizations, just checking every letter/index combination, the code returned the answer in a few seconds on my laptop. I might try to rewrite it in Python as a comparison, but I have to believe it would be orders of magnitude slower (and would probably exceed my patience in waiting for a result!)

I'm still learning, so you should expect this code to be far from perfect. Please let me know if you have any suggestions on how to improve it!

```rust
/// Solves the Riddler Classic from January 27, 2023
/// https://fivethirtyeight.com/features/can-you-defeat-the-tiktok-meme/

#[derive(Debug, PartialEq, Eq)]
struct GameState {
    letters: [Option<char>; 5],
}

impl GameState {
    fn new() -> GameState {
        GameState { letters: [None; 5] }
    }

    fn available_indices(&self) -> Vec<usize> {
        let mut result = vec![];
        for (index, item) in self.letters.iter().enumerate() {
            if item.is_none() {
                result.push(index);
            }
        }
        result
    }

    fn available_letters(&self) -> Vec<char> {
        let used_letters = self
            .letters
            .iter()
            .filter_map(|c| c.clone())
            .collect::<Vec<_>>();
        ('a'..='z')
            .filter(|c| !used_letters.contains(c))
            .collect::<Vec<_>>()
    }

    fn is_sorted(&self) -> bool {
        let mut previous = '\0';
        for letter in self.letters {
            if let Some(c) = letter {
                if c < previous {
                    return false;
                }
                previous = c;
            }
        }
        true
    }

    fn is_full(&self) -> bool {
        self.letters.iter().all(|c| c.is_some())
    }

    fn add_letter(&self, letter: char, index: usize) -> GameState {
        let mut new_letters = self.letters;
        new_letters[index] = Some(letter);
        GameState {
            letters: new_letters,
        }
    }

    fn best_location(&self, letter: char) -> (usize, f64) {
        let mut result = (0, 0.0f64);
        for index in self.available_indices() {
            let ev = self.add_letter(letter, index).expected_value();
            if ev > result.1 {
                result = (index, ev);
            }
        }
        result
    }

    fn expected_value(&self) -> f64 {
        if !self.is_sorted() {
            0.0
        } else if self.is_full() {
            1.0
        } else {
            let mut letter_ev = vec![];
            for letter in self.available_letters() {
                let mut best_ev = 0.0f64;
                for index in self.available_indices() {
                    let ev = self.add_letter(letter, index).expected_value();
                    best_ev = f64::max(best_ev, ev);
                }
                letter_ev.push(best_ev);
            }
            let sum: f64 = letter_ev.iter().sum();
            sum / letter_ev.len() as f64
        }
    }
}

pub fn main() {
    let game_state = GameState::new();
    let result = game_state.expected_value();
    println!("The expected win percentage is: {}", result);
    // prints: The expected win percentage is: 0.2543354109658457
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_available_indices1() {
        let game_state = GameState {
            letters: [None, Some('f'), None, Some('t'), None],
        };
        let expected = vec![0, 2, 4];
        assert_eq!(game_state.available_indices(), expected);
    }

    #[test]
    fn test_available_indices2() {
        let game_state = GameState {
            letters: [Some('a'), Some('f'), Some('k'), Some('t'), Some('z')],
        };
        let expected = vec![];
        assert_eq!(game_state.available_indices(), expected);
    }

    #[test]
    fn test_available_letters() {
        let game_state = GameState {
            letters: [Some('a'), Some('e'), Some('i'), Some('o'), Some('u')],
        };

        let expected = [
            'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n',
            'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z',
        ];
        assert_eq!(game_state.available_letters(), expected);
    }

    #[test]
    fn test_is_sorted() {
        let game_state = GameState {
            letters: [Some('a'), Some('f'), Some('k'), Some('t'), Some('z')],
        };
        assert!(game_state.is_sorted());
    }

    #[test]
    fn test_is_sorted2() {
        let game_state = GameState {
            letters: [Some('z'), Some('f'), Some('k'), Some('t'), Some('a')],
        };
        assert!(!game_state.is_sorted());
    }

    #[test]
    fn test_is_empty_sorted() {
        assert!(GameState::new().is_sorted());
    }

    #[test]
    fn test_is_full() {
        let game_state = GameState {
            letters: [Some('a'), Some('f'), Some('k'), Some('t'), Some('z')],
        };
        assert!(game_state.is_full());
    }

    #[test]
    fn test_add_letter() {
        let game_state = GameState::new();
        let expected = GameState {
            letters: [None, None, Some('j'), None, None],
        };
        assert_eq!(game_state.add_letter('j', 2), expected);
    }

    #[test]
    fn test_expected_value() {
        let case = ([Some('a'), Some('b'), Some('c'), Some('d'), Some('z')], 1.0);
        assert_eq!(GameState { letters: case.0 }.expected_value(), case.1);

        let case = ([Some('a'), Some('b'), Some('c'), Some('d'), None], 1.0);
        assert_eq!(GameState { letters: case.0 }.expected_value(), case.1);

        let case = ([Some('z'), Some('b'), Some('c'), Some('d'), Some('e')], 0.0);
        assert_eq!(GameState { letters: case.0 }.expected_value(), case.1);

        let case = ([Some('a'), Some('b'), Some('c'), Some('z'), None], 0.0);
        assert_eq!(GameState { letters: case.0 }.expected_value(), case.1);

        let case = ([Some('a'), Some('b'), Some('c'), Some('o'), None], 0.5);
        assert_eq!(GameState { letters: case.0 }.expected_value(), case.1);
    }
}
```
