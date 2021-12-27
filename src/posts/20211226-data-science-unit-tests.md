---
title: Unit Testing in Data Science
slug: data-science-unit-tests
date: "2021-12-26"
excerpt: I've written before about how unit tests lead to better code. Some data scientists may not understand how or why unit testing should be used in their work. I'll outline steps you can take to incorporate unit testing into your data science projects and the key benefits you will get as a result.
status: published
---

I've written before about how unit tests lead to better code. Some data scientists may not understand how or why unit testing should be used in their work. I'll outline steps you can take to incorporate unit testing into your data science projects and the key benefits you will get as a result.

If you're unfamiliar with unit testing and would prefer to see a concrete example first, read my earlier post, <a href="/unit-testing-basics">Unit Testing Basics</a> before moving on.

# Recap - three benefits of unit testing

In my prior post I outlined three reasons why unit tests are so valuable when writing software. Here are those reasons again.

1. They increase the likelihood that your functions do what you expect them to do.
2. They provide examples that help others understand what your functions do.
3. They serve as future-proof documentation for your code.

# Unit Testing for Data Scientists

Now, suppose you are convinced of the benefits of unit testing. How can you apply this to your next data science project? Maybe you have messy data you need to clean, notebooks full of exploratory data analysis, several iterations of machine learning models, model scoring tools, and visualizations. Where should you start?

I recommend starting with data cleaning. This is an activity that has the most to gain and the clearest application of unit tests that I wrote about above. Whenever I start working with new data, I follow this process. It is a slightly relaxed version of <a href="https://en.wikipedia.org/wiki/Test-driven_development">test-driven-development.</a>

1. Create a new `.py` module to store data cleaning functions, such as `cleaning.py`
2. Create a new `.py` module to store tests for your cleaning functions, such as `test_cleaning.py`.
3. Identify a data cleaning function you think you might need.
4. Gather a small sample of the input data that captures its original state, quirks, oddities, etc.
5. Manually transform the small sample data into the clean data you want.
6. Think about the data cleaning function you _wish_ you had. Define the function, including its arguments, in your main file, but don't write the implementation yet.
7. Write a test for your new data cleaning function. The test should prove that this function takes the messy data from step (4) and turns it into the clean data from step (5).
8. Run your test suite. You should see that your newly-defined function fails. (That's ok! You haven't implemented it yet.) This step is important because it shows that your test is working.
9. Go back to your function definition and implement the data cleaning logic.
10. Run your test suite. If it passes, continue. If it fails, go back to step (9).
11. Consider writing more tests for your function, especially if it's complicated or has strange edge cases.
12. Repeat from step (3) until you have cleaned the entire dataset.

# Example

Let's walk through an example for a single data cleaning function step by step. Suppose I am working with transactional data in a pandas DataFrame. I first create a file called `cleaning.py` and then another file called `test_cleaning.py`.

I notice that the data has a `transaction_date` column. It appears to be a string, with a timestamp down to the microsecond. However, every timestamp has `TT` appended to it. I check with a colleague and we confirm that this is an artifact of the original source system and it's safe to ignore. I also check the entire column and confirm every row has the same format and has the `TT` suffix.

```console
2021.11.01.20:45:32.425364TT
2021.11.02.14:18:36.874524TT
2021.11.03.08:56:44.966523TT
2021.11.03.09:28:11.113297TT
```

I would rather work with a Series of datetimes instead of strings, so I've identified a useful cleaning function. I convert the sample rows above into the datetime objects I know I'll want at the end.

```console
datetime(2021, 11, 1, 20, 45, 32, 425364)
datetime(2021, 11, 2, 14, 18, 36, 874524)
datetime(2021, 11, 3, 8, 56, 44, 966523)
datetime(2021, 11, 3, 9, 28, 11, 113297)
```

Now I know what I want my cleaning function to do, and what the data inputs and outputs should be. I open `cleaning.py` and start writing the function name and some documentation, without worrying about writing the actual implementation yet.

```python
# cleaning.py
import pandas as pd


def parse_dates(vals: pd.Series) -> pd.Series:
    """
    Parse the `transaction_date` field, a Series of string values, into dates.

    The data format for this column is YYYY.MM.DD.HH:MM:SS.ffffffTT, where the
    'TT' at the end of the datetime is inconsequential. It's not needed, so we
    remove it before using the pandas `to_datetime` function to parse the date.

    Parameters
    ----------
    vals : pd.Series, a series of string dates with the given format.

    Returns
    -------
    parsed : pd.Series, a series of pandas datetime objects.
    """
    return vals
```

This function doesn't do much right now - it just returns my original data. But it has a good name, useful documentation, like my discovery about the `TT` suffix. Next, I'll write the test for my new function. All I need to do is copy my input and output data into a new test function in `test_cleaning.py`.

```python
# test_cleaning.py
from datetime import datetime
import unittest
import pandas as pd

from cleaning import parse_dates


class TestCleaning(unittest.TestCase):
    """Test cleaning functions."""

    def test_parse_dates(self):
        """Test parsing string dates."""
        raw_data = pd.Series([
            "2021.11.01.20:45:32.425364TT",
            "2021.11.02.14:18:36.874524TT",
            "2021.11.03.08:56:44.966523TT",
            "2021.11.03.09:28:11.113297TT",
        ])
        expected = pd.Series([
            datetime(2021, 11, 1, 20, 45, 32, 425364),
            datetime(2021, 11, 2, 14, 18, 36, 874524),
            datetime(2021, 11, 3, 8, 56, 44, 966523),
            datetime(2021, 11, 3, 9, 28, 11, 113297),
        ])
        self.assertIsNone(pd.testing_assert_series_equal(actual, expected))
```

When I run `python3 -m unittest test_cleaning.py`, I see a failure. My function isn't doing what I want it to yet, but that was expected. Now that I've verified my test is failing, I need to finish writing my function. In this case, I can use the pandas string slicer and `to_datetime` function to handle the data conversion. I update the return value of my function to the following.

```python
    return pd.to_datetime(vals.str[:-2], "%Y.%m.%d.%H:%M:%S:%f")
```

Now when I run the test suite I see my test is passing! It looks like my function is doing exactly what I want it to. For now, I'm satisfied with my work on this aspect of the data, and move on to the next messy column in my data and start the process over again.

<blockquote>
In reality, dates and times can be <a href="https://imgs.xkcd.com/comics/supervillain_plan_2x.png">exceptionally tricky</a>. You might want to write several unit tests to handle different edge cases and quirks. Some questions you should consider (and then write tests to encode your answers):

1. How does this source handle daylight saving time?
2. From what timezone is the original data? Do I want it to be localized, or UTC?
3. If the data measures regular intervals, is it ok to have gaps or missing data?
4. The list goes on...
</blockquote>

# Takeaways

Let's revisit the three benefits of unit testing in the context of this example.

<strong>They increase the likelihood that your functions do what you expect them to do.</strong> By writing a unit test for our sample data, we have much higher confidence that our code is doing what we expect. Even though we used sample data rather than the entire dataset (which is often impractical or impossible), we verified that we parsed the expected data format correctly.

<strong>They provide examples that help others understand what your functions do.</strong> I love seeing tests from the data scientists on my team. I can see from the tests what types of issues they are solving in the data with clear, short examples of before and after. Furthermore, it helps break down the data cleaning process into a series of small, logical, repeatable steps that are easy for others to use.

<strong>They serve as future-proof documentation for your code.</strong> This is one of my favorite hidden benefits of unit testing. Remember that conversation I had with my colleague about the `TT` suffix? I can clearly see from the unit test that the `TT` part of the string shouldn't be included in the final, clean data. The unit test by itself is not sufficient documentation - for example, it doesn't explain _why_ we made this choice - but anyone reading our code knows that it's intentional to parse the strings this way. In this case I highly recommend adding comments to the code or a sentence in the function docstring to provide more detail.

I mentioned before that data cleaning functions can be a great starting point for writing unit tests in your data science code. In future posts, I'll discuss other testing techniques for the latter parts of a data science project, which will be part of an overall series on how to approach data science like a software engineer.
