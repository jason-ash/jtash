---
title: Riddler Snowplow
slug: riddler-snowplow
date: "2020-04-03"
excerpt: This week's Riddler was a fun calculus problem. Time to brush off our integrals! On a snowy day we try to pinpoint the moment the snow started based on how long it takes the plows to clear the roads.
status: published
---

# Introduction

This week's <a href="https://fivethirtyeight.com/features/can-you-tell-when-the-snow-started/">Riddler</a> was a fun calculus problem. Time to brush off our integrals! On a snowy day we try to pinpoint the moment the snow started based on how long it takes the plows to clear the roads.

<blockquote>
One morning, it starts snowing. The snow falls at a constant rate, and it continues the rest of the day.
<br><br>
At noon, a snowplow begins to clear the road. The more snow there is on the ground, the slower the plow moves. In fact, the plow’s speed is inversely proportional to the depth of the snow — if you were to double the amount of snow on the ground, the plow would move half as fast.
<br><br>
In its first hour on the road, the plow travels 2 miles. In the second hour, the plow travels only 1 mile.
<br><br>
When did it start snowing?
</blockquote>

# Solution

**It must have started snowing at 11:23am.** Amazingly, we don't need to calculate the rate of snowfall to solve the problem! We just need to use what we know about rates of change to compare the distances traveled by the snow plows over two periods of time.

# Methodology

Let's start with what we know.

1. The snow is falling at a constant rate, which we can call $c$. Over time, the amount of snow builds, and we can measure the amount of total snow by taking the integral of $c$ with respect to time.
2. The snow plows move half as fast when there is twice as much snow. We know from the problem that the plow covers 2 miles in the first hour and 1 mile in the second hour. We can model the speed of the plows as $\frac{c}{x}$. This is a velocity, so if we integrate it with respect to time we can calculate the distance covered.
3. The snow started falling at an unknown time, which we will call $t_0 = 0$. The plow started at noon, which we will call $t_s$. In other words, the value of $t_s$ tells us how many hours passed before the plows started.

We know that the plow's velocity at any time is equal to $\frac{c}{x}$. Therefore, we can solve for the distance covered by a plow by integrating velocity over time. Specifically, we know the plow traveled two miles from time $t_s$ to time $t_s + 1$, and one mile from time $t_s + 1$ to time $t_s + 2$. Now we can write both of those as integrals.

$$
\int_{t_s}^{t_s + 1} \frac{c}{x} \ dx = 2 \text{  and  }
\int_{t_s + 1}^{t_s + 2} \frac{c}{x} \ dx = 1
$$

We can simplify both integrals by pulling the constant, $c$ out of both.

$$
c \times \int_{t_s}^{t_s + 1} \frac{1}{x} \ dx = 2 \text{  and  }
c \times \int_{t_s + 1}^{t_s + 2} \frac{1}{x} \ dx = 1
$$

And solve them both, creating a system of equations with two unknown variables, $c$ and $t_s$.

$$
c \times ln(x) \Big\vert_{t_s}^{t_s + 1} = 2 \text{  and  }
c \times ln(x) \Big\vert_{t_s + 1}^{t_s + 2} = 1
$$

If we divide the two equations, the $c$ term cancels out, so we're left with a single equation and a single variable, $t_s$.

$$
2 \times ln\Big(\frac{t_s + 2}{t_s + 1}\Big) = ln\Big(\frac{t_s + 1}{t_s}\Big)
$$

Remembering that $a \times ln(b) = ln(b^a)$, and removing the logs on both sides, we arrive at:

$$
\Big(\frac{t_s + 2}{t_s + 1}\Big)^2 = \frac{t_s + 1}{t_s}
$$

And <a href="https://www.wolframalpha.com/input/?i=%28%28t+%2B+2%29%2F%28t%2B1%29%29%5E2+%3D+%28%28t+%2B+1%29+%2F+t%29+solve+for+t">for the lazy among us</a>, we find that:

$$
t_s = \frac{\sqrt{5} - 1}{2} \approx 0.618 \text{ hours}
$$

Now we know that noon was roughly 0.618 hours after the snow started. That's about 37 minutes, which means the snow started falling around 11:23am.
