---
title: Unit Testing Basics
slug: unit-testing-basics
date: "2021-12-23"
excerpt: Unit tests are a critical part of quality code. However, it's not always clear how or what you should be testing in your code. I'll walk through a unit testing example, then outline three reasons why I think unit testing will improve your code.
tags: ["data science", "python", "software engineering"]
relatedPosts:
  ["sklearn-column-transformer", "data-science-unit-tests", "python-container-classes"]
status: published
---

Unit tests are a critical part of quality code. However, it's not always clear how or what you should be testing in your code. I'll walk through a unit testing example, then outline three reasons why unit testing will improve your code.

First, let's define a unit test. A unit test is a piece of code whose purpose is to verify whether or not another piece of code is doing its job correctly - hence the name "test". The "unit" part of "unit test" means that we should strive to test the smallest component we possibly can.

# Unit Testing Example

In this post, we'll start with a sample function that we want to test. We'll create a file called `string_things.py` and write a function that returns a list of lowercase letters from a string.

```python
# string_things.py
from typing import List

def get_lowercase_letters(val: str) -> List[str]:
    """Return a list of lowercase letters from an input string."""
    return [x for x in val if x.lower() == x]
```

If I provide the string `"aBcDe"` I expect to get `["a", "c", "e"]`. In fact, this is exactly what I need to write my first unit test. Python has several ways of writing unit tests, but let's use the standard library's `unittest` package for this example. In a separate file, `test_string_things.py`, we'll create a test class and a single test function with the example we just described.

```python
# test_string_things.py
import unittest
from string_things import get_lowercase_letters

class TestStringThings(unittest.TestCase):
    """Test the functions from the string_things module."""

    def test_get_lowercase_letters(self):
        """Test an example of extracting lowercase letters from a string."""
        actual = get_lowercase_letters("aBcDe")
        expected = ["a", "c", "e"]
        self.assertEqual(actual, expected)
```

Now in a terminal we can run

```console
> python3 -m unittest test_string_things.py
```

And we should see the following output.

```console
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

Everything looks great! Our function passed the unit test by successfully matching the result we expected.

On the other hand, this example wasn't very complicated, because the input string only contained a few letters. How would our function respond if a user passed a string with numbers, spaces, or characters like `&` or `#`? What if the user passed an empty string, or didn't pass a string at all? The advantage of unit tests is that we can write as many as we want, and each test can verify the behavior of our original function under various corner cases.

Let's expand our test suite by writing another test that defines what should happen if the user passes a string that contains numbers. My original intent was that only the lowercase letters "a-z" should be included in the output: the function should ignore numbers. Therefore if I pass the string `"123aBc456"`, I expect the function to return `["a", "c"]`.

```python
# test_string_things.py
import unittest
from string_things import get_lowercase_letters

class TestStringThings(unittest.TestCase):
    """Test the functions from the string_things module."""

    def test_get_lowercase_letters(self):
        """Test an example of extracting lowercase letters from a string."""
        actual = get_lowercase_letters("aBcDe")
        expected = ["a", "c", "e"]
        self.assertEqual(actual, expected)

    def test_get_lowercase_letters_with_numbers(self):
        """Test that we ignore numbers when extracting letters from a string."""
        actual = get_lowercase_letters("123aBc456")
        expected = ["a", "c"]
        self.assertEqual(actual, expected)
```

Now, running the test file as before, we see this output:

```console
.F
======================================================================
FAIL: test_get_lowercase_letters_with_numbers (test_string_things.TestStringThings)
Test ignoring numbers when extracting letters from a string.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_string_things.py", line 19, in test_get_lowercase_letters_with_numbers
    self.assertEqual(actual, expected)
AssertionError: Lists differ: ['1', '2', '3', 'a', 'c', '4', '5', '6'] != ['a', 'c']

First differing element 0:
'1'
'a'

First list contains 6 additional elements.
First extra element 2:
'3'

- ['1', '2', '3', 'a', 'c', '4', '5', '6']
+ ['a', 'c']

----------------------------------------------------------------------
Ran 2 tests in 0.000s

FAILED (failures=1)
```

It turns out that our original function doesn't handle numbers the way we thought. (Why? `"1".lower() == "1"`, so `"1"` gets included in the output list.) For reference, here is the function I _intended_ to write.

```python
# string_things.py
from string import ascii_lowercase
from typing import List

def get_lowercase_letters(val: str) -> List[str]:
    """Return a list of lowercase ascii letters from an input string."""
    return [x for x in val if x in ascii_lowercase]
```

I view each unit test failure as a win - it's an opportunity to better align our code with the expectations we have for it. (Of course, that still means we have to fix our failing tests!) Before, it was ambiguous how the original function should handle numbers. By writing several unit tests, we were able to identify a discrepancy between our expectations and reality, and we could improve our code by clarifying our original intent and rewriting our function.

Even though this is a simple example, I think it does a good job of illustrating the process that most software developers go through as they write code. And for me it highlights three reasons why unit tests are critical in writing quality software.

# Why use unit tests?

By now, it should be somewhat obvious why we would want to use unit tests when we're writing code: they help make sure our code does what we want it to do! But unit tests do much more than that. Here are three reasons why unit tests lead to better code. I'll elaborate on each point below.

1. They increase the likelihood that your functions do what you expect them to do.
2. They provide examples that help others understand what your functions do.
3. They serve as future-proof documentation for your code.

<strong>They increase the likelihood that your functions do what you expect them to do.</strong> The example above showed how unit tests helped us identify a discrepancy between our expectations for the code: numbers should be ignored, and the reality: numbers were included.

<strong>They provide examples that help others understand what your functions do.</strong> When I look at someone else's code, I love seeing extensive tests. Of course it gives me greater confidence in the reliability of the code, but it also has another benefit. I often use tests to quickly understand how the functions work. Just like showing is better than telling, sometimes seeing an example of a function in action is the fastest way to understand how it works. The docstring of our function above said `"""Return a list of lowercase letters from an input string."""`. In this case, that's pretty helpful, but it's also nice to look at the tests and see: `"aBcDe"` becomes `["a", "c", "e"]`. In this sense, your tests help provide more clues about how your code works, which helps other people get up to speed faster.

<strong>They serve as future-proof documentation for your code.</strong> Documentation is great. There's rarely enough of it, but even the best documentation can become obsolete. Function docstrings and code comments, however helpful, don't actually code while it's running. It's possible for code to execute instructions totally different than what the docstring promises. This is why unit tests are some of the best documentation. Unit tests provide a <strong>contract</strong> that guarantees the behavior of your functions, because they always test the latest version of your code. When I see a unit test that says `"aBcDe"` becomes `["a", "c", "e"]` I know for a fact that the function must have that behavior, even if the function's documentation is slightly out of date.

# Key Takeaways

In my experience, unit tests are one of the most valuable tools for writing quality code in the software engineering arsenal. Even though writing tests takes a bit more time - after all, you end up writing quite a bit more code, I've found that I can iterate on my existing code much faster if I have a comprehensive unit testing suite. For example, I can make changes more confidently to small chunks of existing code while ensuring I don't change parts of the logic I didn't intend to. I hope this post gave you some concrete steps to apply unit testing to your next software project!
