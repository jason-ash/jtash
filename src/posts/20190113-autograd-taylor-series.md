---
title: Autograd and Taylor Series
slug: autograd-taylor-series
date: "2019-01-13"
excerpt: I've learned that there are many automatic differentiation libraries in the Python ecosystem. Often these libraries are also machine learning libraries, where automatic differentiation serves as a means to an end - for example in optimizing model parameters in a neural network. However, the autograd library might be one of the purest, "simplest" (relatively speaking) options out there. Its goal is to efficiently compute derivatives of numpy code, and its API is as close to numpy as possible. This means it's easy to get started right away if you're comfortable using numpy. In particular autograd claims to be able to differentiate as many times as one likes, and I thought a great way to test this would be to apply the Taylor Series approximation to some interesting functions.
status: published
---

I've learned that there are many automatic differentiation libraries in the Python ecosystem. Often these libraries are also machine learning libraries, where automatic differentiation serves as a means to an end - for example in optimizing model parameters in a neural network. However, the <a href="https://github.com/HIPS/autograd">`autograd` library</a> might be one of the purest, "simplest" (relatively speaking) options out there. Its goal is to efficiently compute derivatives of numpy code, and its API is as close to numpy as possible. This means it's easy to get started right away if you're comfortable using numpy. In particular `autograd` claims to be able to differentiate as many times as one likes, and I thought a great way to test this would be to apply the Taylor Series approximation to some interesting functions.

# Implementing Taylor Series using autograd

The Taylor Series is a way of approximating smooth curves using polynomials. Often, evaluating polynomials is much simpler than evaluating the smooth curves themselves. Technically speaking, the Taylor Series is an infinite sum of polynomial terms, but we typically gather a finite number of terms based on the desired accuracy of our approximation. The more terms we use, the better our approximation becomes. Here is the formula for the infinite series:

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x - a)^n
$$

In python, using the `autograd` library, it is fairly straightforward to implement the Taylor Series up to a given degree. The subtle trick is to import `autograd`'s numpy package, which has differentiable versions of most numpy functions. From there, we can use `elementwise_grad` to differentiate a function with respect to an array.

The `taylor_expansion` function below defines a sub-function, `t`, which represents the nth term of the Taylor Series expansion. By adding terms from degree 0 to the desired degree, eventually we end up with the Taylor Series curve we want.

```python
import autograd.numpy as np
from autograd import elementwise_grad as egrad
from math import factorial


def taylor_expansion(f, a, x, degree):
    """
    Return the taylor expansion of the function "f" with a given degree at point "a"
    f(x) = f(a) + f'(a)*(x - a)**1/1! + f'(a)*(x - a)**2/2! + f'''(a)*(x - a)**3/3! + ...

    Examples
    --------
    >>> f, a, x, degree = np.tanh, 0.5, np.linspace(-3, 3, 10000), 5
    >>> taylor_expansion(f, a, x, degree)
    array([36.30578455, 36.27651122, 36.24725546, ...,  2.45649329,
        2.45779953,  2.45910638])
    """
    t = lambda f, a, x, d: f(a) * (x - a)**d / factorial(d)

    out = 0.0
    for d in range(degree + 1):
        out += t(f, a, x, d)
        f = egrad(f)
    return out
```

# Examples

For example, suppose we have some function, $f$. We know the function's value at a point, $x$, and we know the derivative of $f$ at $x$, which gives us the tangent line. We might approximate the value of $f(x + dx)$ using the tangent line, which is a Taylor Series with degree one. However, this approximation usually worsens as we move farther and farther from our original point. The Taylor Series incorporates derivatives upon derivatives of the original function, $f$, in order to improve the approximation at points far from our original $x$. This can be useful if our original function is costly to evaluate.

Here's another example. As an actuary, I'm often interested in testing the sensitivity of financial projections with respect to model inputs. Interest rates, lapse rates, mortality rates, and other inputs all play a role in determining the premium that should be charged for a given insurance product. Sometimes these models can be complex and time consuming to run. But if I can evaluate the function once to get $f(x)$, and compute several derivatives, $f'(x)$, $f''(x)$, $f'''(x)$, ..., then I can create a Taylor Series approximation of my model, which I could use to estimate how premium would change if my inputs changed.

# Hyperbolic tangent function

The hyperbolic tangent function is sometimes used in neural networks to classify a training example between two options, say, "dog" vs. "cat". Its value falls between -1 and 1. We know the formula for this function, so we could easily calculate its true value at any point, but lets use a couple different Taylor Series approximations to see how well they perform.

This first example shows a fourth degree function, meaning we use up to the fourth derivative of our original function. We evaluate the Taylor Series at the point $f(0.5)$, and it looks like we could use our new function to estimate points from roughly zero to 1.5. This is the section of the chart where both lines are nearly on top of one another. Note that I intentionally hid most axis ticks and lines in an effort to emphasize the function lines themselves.

<img title="Taylor Series" alt="taylor series" src="/img/taylor-series1.png">

On the other hand, perhaps we can increase our accuracy if we use a Taylor Series with degree 6. This time we'll evaluate at a different point, $f(-1.0)$. Here it looks as if our results are pretty good from -2 through 0, which is perhaps a slightly larger range than we had for our polynomial of degree 4.

<img title="Taylor Series" alt="taylor series" src="/img/taylor-series2.png">

I think it is interesting to see how the Taylor Series polynomial changes as we change the degree and incorporate more and more derivatives of our original function. The table below shows the same original function with Taylor Series polynomials of increasing degree from 0 through 7.

Note that with degree 0 our guess for any point on the function is equal to $f(a)$, which is hardly reasonable. When we use the tangent line our guesses are good for regions close to $a$, but we quickly improve our approximation by using Series with degree 4 or higher.

<img title="Taylor Series" alt="taylor series" src="/img/taylor-series3.png">

# Other functions

Here is the same set of charts for a few other functions: $sin(x)$, $e^x$, and $\sqrt{x}$, with $a = 1$. Most of the fits are excellent when degree is above 5. However, note how the Taylor Series polynomial flips up and down repeatedly as it struggles to converge for $\sqrt{x}$. This illustrates a key result for Taylor Series - that it is not always possible to extrapolate indefinitely along the curve from all points.

# $sin(x)$

<img title="Taylor Series" alt="taylor series" src="/img/taylor-series4.png">

# $e^x$

<img title="Taylor Series" alt="taylor series" src="/img/taylor-series5.png">

# $\sqrt{x}$

<img title="Taylor Series" alt="taylor series" src="/img/taylor-series6.png">

# Conclusions

I enjoyed using `autograd` for this article. I use numpy all the time, and it's great to be able to differentiate most of my numpy code simply by changing `import numpy as np` to `import autograd.numpy as np`. It feels like a pure approach to automatic differentiation compared to other machine learning languages where subtle changes in syntax can often slow down the development process. Furthermore, I'm impressed with the ability to differentiate functions an arbitrary number of times to create whichever degree Taylor Series I'm interested in. It's really as simple as calling `grad`!

I'm looking forward to using `autograd` for more complicated models. As I mentioned before, I'm particularly interested in applying automatic differentiation to actuarial work, where I think it could have a big impact on understanding complex insurance products. Feel free to contact me if this is something that interests you too - I'd love to connect.
