---
title: Python Container Classes
slug: python-container-classes
date: "2022-01-01"
excerpt: Several methods of creating a data container class in Python.
tags: [snippet, python]
status: published
---

I often want to create objects that hold several related pieces of data together in the same place - like a `Book` object that has an `author`, `title`, etc. Python offers several methods to do this, but it's not always clear which one to use. I'll show different patterns that I use and discuss the advantages and disadvantages of each.

| Name               | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| Vanilla Class)     | A plain Python class                                             |
| Dictionary         | A plain Python dictionary                                        |
| (Typed) Dictionary | A Python dictionary with typed fields                            |
| Simple Namespace   | A Python namespace object                                        |
| NamedTuple         | A tuple with names, from the `collections` module                |
| Dataclass          | A container class from the `dataclasses` module                  |
| `attrs` Class      | The only non-standard-library solution, from the `attrs` library |

# Vanilla Class

```python
class Book:
    """Container class for a Book and its attributes."""

    def __init__(
        self,
        author: str,
        title: str,
        publication_year: int,
        isbn_10: Optional[str],
        isbn_13: Optional[str],
    ) -> None:
        self.author = author
        self.title = title
        self.publication_year = publication_year
        self.isbn_10 = isbn_10
        self.isbn_13 = isbn_13

brothers_karamazov = Book(
    author="Fyodor Dostoevsky",
    title="The Brothers Karamazov",
    publication_year=1880,
    isbn_10="0374528373",
    isbn_13="978-0374528379",
)
```

# (Typed) Dictionary

```python
from typing import TypedDict

class Book(TypedDict):
    """Typed dictionary structure for a book object."""

    author: str
    title: str
    publication_year: int
    isbn_10: Optional[str]
    isbn_13: Optional[str]

brothers_karamazov: Book = {
    "author": "Fyodor Dostoevsky",
    "title": "The Brothers Karamazov",
    "publication_year": 1880,
    "isbn_10": "0374528373",
    "isbn_13": "978-0374528379",
}
```

# SimpleNamespace

# NamedTuple

```python
from typing import NamedTuple

class Book(NamedTuple):
    """Container class for a Book and its attributes."""

    author: str
    title: str
    publication_year: int
    isbn_10: Optional[str]
    isbn_13: Optional[str]
```

# Dataclass

```python
from dataclasses import dataclass

@dataclass
class Book:
    """Container class for a Book and its attributes."""

    author: str
    title: str
    publication_year: int
    isbn_10: Optional[str]
    isbn_13: Optional[str]
```
