---
title: Python Container Classes
slug: python-container-classes
date: "2022-01-01"
excerpt: I often want to create objects that hold several related pieces of data together in the same place - like a `Book` object that has an `author`, `title`, etc. Python offers several methods to do this, but it's not always clear which one to use. I'll show different patterns that I use and discuss the advantages and disadvantages of each.
tags: ["data science", "python", "software engineering"]
status: published
---

I often want to create objects that hold several related pieces of data together in the same place - like a `Book` object that has an `author`, `title`, etc. Python offers several methods to do this, but it's not always clear which one to use. I'll show different patterns that I use and discuss the advantages and disadvantages of each.

I call these container classes because they're mostly used to hold information.

| Name                                             | Description                                                      |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| <a href="#vanilla-class">Vanilla Class</a>       | A plain Python class                                             |
| <a href="#dictionary">Dictionary</a>             | A plain Python dictionary                                        |
| <a href="#typed-dictionary">Typed Dictionary</a> | A Python dictionary plus a `TypedDict` schema                    |
| <a href="#simplenamespace">SimpleNamespace</a>   | A Python namespace object                                        |
| <a href="#namedtuple">NamedTuple</a>             | A tuple with names, from the `collections` module                |
| <a href="#dataclass">Dataclass</a>               | A container class from the `dataclasses` module                  |
| <a href="#attrs-class">`attrs` Class</a>         | The only non-standard-library solution, from the `attrs` library |

<h1 id="vanilla-class">Vanilla Class</h1>

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

<h1 id="dictionary">Dictionary</h1>

```python
brothers_karamazov: Book = {
    "author": "Fyodor Dostoevsky",
    "title": "The Brothers Karamazov",
    "publication_year": 1880,
    "isbn_10": "0374528373",
    "isbn_13": "978-0374528379",
}
```

<h1 id="typed-dictionary">Typed Dictionary</h1>

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

<h1 id="simplenamespace">SimpleNamespace</h1>

<h1 id="namedtuple">NamedTuple</h1>

```python
from typing import NamedTuple

class Book(NamedTuple):
    """Container class for a Book and its attributes."""

    author: str
    title: str
    publication_year: int
    isbn_10: Optional[str]
    isbn_13: Optional[str]

brothers_karamazov = Book(
    author="Fyodor Dostoevsky",
    title="The Brothers Karamazov",
    publication_year=1880,
    isbn_10="0374528373",
    isbn_13="978-0374528379",
)
```

<h1 id="dataclass">Dataclass</h1>

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

brothers_karamazov = Book(
    author="Fyodor Dostoevsky",
    title="The Brothers Karamazov",
    publication_year=1880,
    isbn_10="0374528373",
    isbn_13="978-0374528379",
)
```

<h1 id="attrs-class">Attrs Class</h1>
