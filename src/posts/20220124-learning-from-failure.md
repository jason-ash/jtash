---
title: Learning from Failure - Why Unit Tests Matter
slug: learning-from-failure
date: "2022-01-24"
excerpt: After 18 months of development on our team's shared Python library, we had our first production pipeline failure. Here are my thoughts on what we can learn from it, and why it's good for our team's growth.
tags: ["actuarial", "data science", "modernization", "python", "software development"]
relatedPosts: ["unit-test-basics", "data-science-unit-testing"]
status: published
---

I often tell my team that tests lead to better code. In my experience, tests provide a net benefit far greater than the time it takes to write them. For example, good tests make it easier and faster to debug issues, and allow us to refactor code more confidently and quickly. The entire test suite should be run every time we propose changes to our production code, and ideally this happens automatically as part of a Continuous Integration / Continuous Deployment process like Github Actions or Azure Pipelines.

# Swiftly, our shared Python library

At our company, one of the best examples of this in practice is our shared Python library, swiftly. I created swiftly in July 2020 to encourage our actuaries, analysts, and data scientists to work together, learn from each other, and create a shared resource for our analytics team. Since then, 25 people have contributed more than 270 commits to the library. Each of those commits was peer-reviewed and approved as a pull request that also passed a full, automated run of all 435 of our tests on both Linux and Windows.

<img src="/img/learning-from-failure1.png">

These tests and this process gave me confidence in our code, and we had an outstanding track record of 100% succeeded pipelines on our production branch - 270 green check-marks in a row. Until today. Today, after 18 months, I was responsible for the first failure in our production code.

<img src="/img/learning-from-failure2.png">

# What happened?

While the details of this particular failure aren't the key takeaway from this post, it is useful to understand what happened. Our unit tests run on every merge to the production branch. Those unit tests continued to work on the commit that I broke. What failed instead was one of the separate continuous deployment pipelines that I use to deploy our code as an API hosted on AWS. So far these separate pipelines are only triggered manually, and I usually make sure to run them on feature branches before I merge changes into production. However, last week I changed the pipelines and didn't fully test them before merging my code. I only ran the automated suite of tests, saw that they passed, and merged my code.

I created a situation in which the next time those pipelines were run against the production branch, they would fail. And today, that's what happened. Fortunately, the scope of the failure was limited to our development environment only, and our continuous deployment process makes it easy to diagnose failures like this, so it took only a few minutes to fix.

# What to learn from it

It is frustrating when you work hard on code and it fails. But, stepping back, I wanted to think about what we can learn from failures. Unit tests and continuous integration checks are there for this exact reason. I was confident that my code worked; the code passed lots of checks, including the test suite; however, despite all that, I managed to introduce a bug.

I'm grateful for the failure for a few reasons. First, it actually tells me that our checks are working! If all we ever see is a wall of green check-marks, we may not be completely sure our checks actually do what we want. This is why test driven development works: you write a test and confirm that it fails in the way you expect before you write the code that makes it pass. Second, it reminds me that the purpose of writing code isn't to pass checks. The purpose of writing code is to accomplish a business objective. If green check-marks become the goal, then we risk missing out on the bigger picture, which is to apply our skills and resources to solving problems for our customers. Maybe perfect code becomes the enemy of good code, and we aren't taking enough risk or moving fast enough.

It reminds me of a skiing analogy: if you ski all day and never fall down, it could be a sign that you're not taking enough risk, not learning as much as you could, and not pushing yourself enough to grow. After all, you wear a helmet to protect you from small crashes and to create the opportunities to take smart risks that help you learn. Unit tests are like a helmet for our code, and it's ok if we take a couple falls as we build.

# Takeaways

I wanted to share this for a few reasons. First, because I, like a lot of people, have been conditioned to highlight success and minimize failure. It's important to remind ourselves that failure is a natural part of growth, and it helps build the skills and experience that ultimately lead to future success.

Second, I want our team to embrace and be comfortable sharing failure openly and asking for help when needed. I want everyone on the team to hold themselves to a high standard, but permit themselves the grace to deal with the inevitable bumps that happen along the way.

I am incredibly energized by what we have built in 18 months as a team. In some ways, I was worried that our project's perfect record actually created a barrier to entry - people shying away from contributing because they worried they couldn't meet the project's high bar. Now that the first failure on record is mine, and I own it proudly. I hope we can all feel more comfortable taking risks and learning and growing together as a team.
