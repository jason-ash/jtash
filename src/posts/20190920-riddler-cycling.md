---
title: Riddler Cycling
slug: riddler-cycling
date: "2019-09-20"
excerpt: This week's riddler was an entertaining blend of probability and one of my favorite sports, cycling. We're asked to choose the ideal pace for a team time trial - trying to balance the rewards of a competitive time with the risks of pushing our riders too hard and having them crack due to the effort. Plus, there's a bonus extra credit problem!
status: published
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/can-you-win-the-tour-de-fivethirtyeight/">riddler</a> was an entertaining blend of probability and one of my favorite sports, cycling. We're asked to choose the ideal pace for a team time trial - trying to balance the rewards of a competitive time with the risks of pushing our riders too hard and having them crack due to the effort.

<blockquote>
You are the coach for Team Riddler at the Tour de FiveThirtyEight, where there are 20 teams (including yours). Your objective is to win the Team Time Trial race, which has the following rules:

- Each team rides as a group throughout the course at some fixed pace, specified by that team’s coach. Teams that can’t maintain their pace are said to have “cracked,” and don’t finish the course.<br>
- The team that finishes the course with the fastest pace is declared the winner.<br>
- Teams ride the course one at a time. After each team completes its attempt, the next team quickly consults with its coach (who assigns a pace) and then begins its ride. Coaches are aware of the results of all previous teams when choosing their own team’s pace.

Assume that all teams are of equal ability: At any given pace, they have the exact same probability of cracking, and the faster the pace, the greater the probability of cracking. Teams’ chances of cracking are independent, and each team’s coach knows exactly what a team’s chances of cracking are for each pace.
<br><br>
Team Riddler is the first team to attempt the course. To maximize your chances of winning, what’s the probability that your team will finish the course? What’s the probability you’ll ultimately win?
<br><br>
**Extra Credit:** If Team Riddler is the last team to attempt the course (rather than the first), what are its chances of victory?

</blockquote>

# Solution

At first, it seems like the problem doesn't give us enough information about the relationship between the pace and the probability of cracking. Wouldn't it be useful to know exactly what pace is associated with the probability of cracking? Is it a linear relationship? Quadratic? Fortunately, we can solve the problem without knowing this - of course the Riddler wouldn't let us down! Let's figure out how.

Let's call the probability of cracking $p$. This value will be a number between 0% and 100%. At 0%, we've selected a pace such that we're guaranteed to finish the course: it might be slow, but we will be sure to complete the race. At 100%, we're guaranteed _not_ to finish the race, so it's impossible for us to win. Some point in between lies the best chance for us to win.

Suppose we pick a value of $p=50\%$. If we complete the race, our competitors will choose a probability of cracking that is _slightly_ higher, resulting in a pace that is _slightly_ faster. If they also complete the race, they will move ahead of us in the rankings. This will continue for each subsequent team. On the other hand, if we fail to complete the race, then our competitors could choose any new value of $p$ they want, but it won't matter for us, because we would already have been eliminated.

> A note about choosing values of $p$: we can set aside the fact that later teams will select slightly higher values of $p$, and instead assume they pick exactly $p$. If we do this, then the answers we calculate will be the _limit_ on the odds of winning, as the delta between values of $p$ decreases to zero.

Therefore, we win the time trial if and only if two things happen:

1. We complete the race successfully at our desired pace.
2. Each of the 19 subsequent teams fails to complete the race with _at least_ the same pace we set.

If we express this mathematically, our odds of winning, $f(p)$, look like this.

$$f(p) > p^{19} \times (1 - p)$$

This equation has the two components we want: our probability of finishing the race, given by $(1-p)$, and the probability of each competitor failing to complete the race, given by $p^{19}$. To find the value of $p$ that maximizes this function, we use calculus: take the derivative, set it to zero, then solve for $p$. This tells us the point at which the function stops rising or falling, which means it is either a minimum or a maximum.

We use the chain rule to differentiate $f(p)$, which gives us the following:

$$\frac{\partial f}{\partial p} = -p^{19} + 19p^{18}(1-p)$$

When we set $\frac{\partial f}{\partial p}$ to zero and simplify the terms on the right, we get:

$$0 = -20p^{19} + 19p^{18}$$

which evaluates to:

$$20p^{19}=19p^{18}$$

and finally:

$$p=\frac{19}{20}$$

**Therefore, the value of $p$ that maximizes our odds of winning is $\frac{19}{20}=95\%$. When we choose 95% for $p$, our overall chances of winning the event are $f(0.95)>(1-0.95)\times 0.95^{19}=1.89\%$.** In other words, we should pick an extremely risky strategy with a low probability of success in order to have the best odds of winning the entire event. Our odds of completing the time trial are low, but so are everyone else's! As we can see in the chart below, the function hits a maximum value at 95%.

<img src="src/assets/img/riddler-cycling1.png">

# Extra Credit

There's a nice feature of our answer above. The value of $p=\frac{19}{20}$ corresponds exactly with the number of teams in the competition. In fact, for a race with $n$ teams, the team going first should always race with $p=\frac{n-1}{n}$. (For example, the first team in a 10-team field should select $\frac{9}{10}=90\%$ as their value of $p$.) Subsequent teams will race with values of $p$ that depend on what has happened before. They will either race at the highest successful attempt so far, or the value of $p$ they would select as if they were racing first in a brand new event.

In our race, with 20 teams, the table below shows the values of $p$ that each team would select, as long as no prior team has completed the race. For example, the fifth team would select a value of $p=93.75\%$ if no prior team had finished. If a prior team had finished, the fifth team would select the value of $p$ set by that prior team. The final team, with the advantage of seeing everyone's scores before competing, could potentially select a value of $p=0\%$ if nobody had successfully finished the race - guaranteeing a finish and a win. Otherwise, they would select the value of $p$ from the last team that finished.

| Team (n/20) | Ideal $p$ | ... | Team (n/20) | Ideal $p$ |
| :---------- | :-------- | :-- | :---------- | :-------- |
| 1           | 95.00%    |     | 11          | 90.00%    |
| 2           | 94.74%    |     | 12          | 88.89%    |
| 3           | 94.44%    |     | 13          | 87.50%    |
| 4           | 94.12%    |     | 14          | 85.71%    |
| 5           | 93.75%    |     | 15          | 83.33%    |
| 6           | 93.33%    |     | 16          | 80.00%    |
| 7           | 92.86%    |     | 17          | 75.00%    |
| 8           | 92.31%    |     | 18          | 66.67%    |
| 9           | 91.67%    |     | 19          | 50.00%    |
| 10          | 90.91%    |     | 20          | 00.00%    |

Now we have the tools we need to answer the extra credit problem. Suppose team 1 completes the race, which happens 5% of the time. Every subsequent team would be forced to attempt (almost exactly) the same pace, and team 20 would win the overall competition only if they are able to complete the course as well with the same value of $p$, which occurs (almost exactly) 5% of the time. The total odds of this happening are $(\frac{1}{20})^2$. If team 1 fails their attempt, then we would move to team 2, which would choose a value of $p=94.74\%$. If they succeed, every subsequent team would attempt the same pace, all the way until team 20. This pattern continues for all teams.

To calculate the odds of team 20 winning the competition, we must account for each of these branching paths, summing the probabilities along the way. We will use the $<$ operator to show the _maximum_ probability that team 20 wins, by assuming they attempt exactly the same $p$ as prior successful teams.

$$P(\text{Team 20 wins})<\frac{1}{20^2} + \frac{19}{20} \times(\frac{1}{19^2} + \frac{18}{19} \times (\frac{1}{18^2} + \frac{17}{18} \times ...$$

A formula like this lends itself to a recursive implementation using code. **With 20 teams, the team going last has at most a 17.99% chance of winning overall.**

```python
def model(teams=20):
    """
    Solves the extra credit portion of
    the Riddler Classic from 9/20/19
    """
    if teams == 1:
        # if there is only one team,
        # they win 100% of the time!
        return 1.0
    else:
        # multiple teams; calculate the
        # odds of the last team winning
        return (1/teams)**2 + (teams-1)/teams*model(teams-1)

>>> model(20)
0.17988698285718413
```

Finally, we can plot the win percentages for the team going last among a competition with $n$ competitors. It's a remarkable advantage to go last!

<img src="src/assets/img/riddler-cycling2.png">
