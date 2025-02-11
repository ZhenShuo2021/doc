---
title: 實用的內建函式
description: Useful Built-in Functions in Python
tags:
  - Programming
  - Python
keywords:
  - Programming
  - Python
last_update:
  date: 2024-09-11T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-09-11T00:00:00+08:00
---

# Useful Built-in Functions in Python

I always forget how to use them, so this is my memo for quick reference. Including

## Basic usage

| Function        | Syntax                                              |
|:----------------|:-----------------------------------------------------|
| List Comprehension | `[expression for item in iterable if condition]`     |
| Generator Expression | `(expression for item in iterable if condition)`     |
| Lambda Function | `lambda arguments: expression`                       |
| zip            | `zip(*iterables)`                                   |
| any            | `any(iterable)`                                      |
| all            | `all(iterable)`                                      |
| map            | `map(function, iterable, ...)`                        |
| filter         | `filter(function, iterable)`                          |
| join           | `'separator'.join(iterable)`                          |
| reduce         | `reduce(function, iterable[, initializer])`           |
| set            | `set(iterable)`                                      |
| deque          | `deque(iterable[, maxlen])`                          |
| Counter        | `Counter(iterable)`                                  |

## Equivalents

This is for better understanding the function using the hand-craft equivalent code.

### List comprehension/Generator expression/zip

```python
# List Comprehension Example: Get squares of even numbers
# With list comprehension
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares_of_evens = [n**2 for n in numbers if n % 2 == 0]

# Without list comprehension
def get_squares_of_evens_def(numbers):
    squares = []
    for n in numbers:
        if n % 2 == 0:
            squares.append(n**2)
    return squares

squares_of_evens_list = get_squares_of_evens_def(numbers)
print(squares_of_evens, squares_of_evens_list)


# Example: get even number in two layered list and multiply by 2
# With list comprehension
nested_list = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
doubled_evens = [num * 2 for sublist in nested_list for num in sublist if num % 2 == 0]

# Without list comprehension
doubled_evens_manual = []
for sublist in nested_list:
    for num in sublist:
        if num % 2 == 0:
            doubled_evens_manual.append(num * 2)

for with_comprehension, without_comprehension in zip(doubled_evens, doubled_evens_manual):
    print(f"With list comprehension: {with_comprehension}, Without list comprehension: {without_comprehension}")
    

# Generator expression Example: get letters longer than a specified length
# With generator expression
sentence = "This is a sample sentence to demonstrate generator expressions."
word_length = 4
long_words = (word for word in sentence.split() if len(word) > word_length)

# Without generator expression
def get_long_words_def(sentence, word_length):
    for word in sentence.split():
        if len(word) > word_length:
            yield word

long_words_list = get_long_words_def(sentence, word_length)
for long_word, long_words_list in zip(long_words, long_words_list):
    print(long_word, long_words_list)
```

### any/all

```py
# Any example: Check if any student has failed the exam
# With any
grades = [85, 90, 76, 65, 88]
has_failed = any(grade < 70 for grade in grades)

# Without any
def check_any_failed(grades):
    for grade in grades:
        if grade < 70:
            return True
    return False

has_failed_list = check_any_failed(grades)
print(has_failed, has_failed_list)


# All example
# With all
numbers = [1, 5, 3, 7]
all_positive = all(num > 0 for num in numbers)

# Without all
all_positive_manual = True
for num in numbers:
    if num <= 0:
        all_positive_manual = False
        break

for with_all, without_all in zip([all_positive], [all_positive_manual]):
    print(with_all, without_all)
```

### map/filter/join/reduce

```py
# map example: converting Celsius temperatures to Fahrenheit
# With map
celsius_temperatures = [0, 10, 20, 30]
fahrenheit_temperatures = list(map(lambda c: (c * 9/5) + 32, celsius_temperatures))

# Without map
def celsius_to_fahrenheit(c):
    return (c * 9/5) + 32

fahrenheit_temperatures_list = []
for c in celsius_temperatures:
    fahrenheit_temperatures_list.append(celsius_to_fahrenheit(c))

for f, f_list in zip(fahrenheit_temperatures, fahrenheit_temperatures_list):
    print(f, f_list)


# filter Example: filtering even numbers from a list
# With filter
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))

# Without filter
def is_even(x):
    return x % 2 == 0

even_numbers_list = []
for num in numbers:
    if is_even(num):
        even_numbers_list.append(num)

for even, even_list in zip(even_numbers, even_numbers_list):
    print(even, even_list)


# join example: join a list of strings
# Using join
words = ['Hello', 'world']
sentence = ' '.join(words)

# Without join
def manual_join(words):
    sentence = ''
    for word in words:
        sentence += word + ' '
    return sentence.strip()

print(sentence, manual_join(words))


# reduce Example: calculating the product of all numbers in a list
# With reduce
from functools import reduce 
numbers = [1, 2, 3, 4, 5]
product = reduce(lambda x, y: x * y, numbers)

# Without reduce
def calculate_product(numbers):
    result = 1
    for num in numbers:
        result *= num
    return result

product_list = calculate_product(numbers)

print(product, product_list)
```

### set

```py
# set Example: finding unique URLs
# With set
urls = ["https://www.example.com", "https://www.google.com", "https://www.example.com", "https://www.python.org"]
unique_urls = list(set(urls))

# Without set
def get_unique_urls(urls):
    seen_urls = set()
    for url in urls:
        if url not in seen_urls:
            seen_urls.add(url)
            yield url

unique_urls_list = list(get_unique_urls(urls))
for unique_url, unique_urls_list in zip(unique_urls, unique_urls_list):
    print(unique_url, unique_urls_list)
```

### deque

```py
# Deque Example: Maintaining a fixed-size queue
# With deque
from collections import deque

max_size = 3
queue = deque(maxlen=max_size)

# Simulate adding tasks
for task in range(5):
    queue.append(f"Task {task + 1}")

print("Deque Output:", list(queue))

# Without deque
class FixedQueue:
    def __init__(self, max_size):
        self.queue = []   # Simulate queue with list
        self.max_size = max_size

    def append(self, item):
        if len(self.queue) >= self.max_size:
            self.queue.pop(0)
        self.queue.append(item)

fixed_queue = FixedQueue(max_size)

for task in range(5):
    fixed_queue.append(f"Task {task + 1}")

print("Fixed Queue Output:", fixed_queue.queue)

print("\nDeque vs Fixed Queue Output:")
for deque_item, fixed_queue_item in zip(list(queue), fixed_queue.queue):
    print(deque_item, "vs", fixed_queue_item)
```

### Counter

```py
# Counter Example: Counting occurrences of items
# With Counter
from collections import Counter

items = ['apple', 'banana', 'orange', 'apple', 'orange', 'banana', 'banana']
item_count = Counter(items)

print("\nCounter Output:", item_count)

# Without Counter
def count_items(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts

item_count_simple = count_items(items)
print("Manual Count Output:", item_count_simple)

# Zip Comparison of Outputs for Counter Example
print("\nCounter vs Manual Count Output:")
for item in item_count.keys():
    print(f"{item}: {item_count[item]} vs {item_count_simple[item]}")
```
