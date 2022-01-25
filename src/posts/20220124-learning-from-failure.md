---
title: Learning from Failure
slug: learning-from-failure
date: "2022-01-24"
excerpt: TBD
tags: []
relatedPosts: []
status: published
---

I often tell my team that unit tests lead to better code. In my experience unit tests provide a net benefit far greater than the time it takes to write them. For example, good unit tests make it easier and faster to debug issues. Good unit tests also allow you to refactor code more confidently and quickly while ensuring everything still works as you intended. In most cases, the entire test suite should be run every time you propose a change to your production code. Ideally this happens automatically as part of a Continuous Integration / Continuous Deployment process like Github Actions or Azure Pipelines.

# Swiftly, our shared Python library

At our company, one of the best examples of this in practice is our shared Python library, swiftly. I created swiftly in July 2020 to encourage our actuaries, analysts, and data scientists to work together, learn from each other, and create a lasting resource for our analytics team. Since then, 25 people have contributed more than 270 commits. Each of those commits was a peer-reviewed and approved pull request that also passed a full, automated run of all 435 of our tests on both Linux and Windows.

<img src="/img/learning-from-failure1.png">

I had lots of confidence in our code, and we had an outstanding track record of 100% succeeded pipelines on our production branch. Until today. Today, after 18 months of green checkmarks, I was responsible for the sole failure in our production code.

<img src="/img/learning-from-failure2.png">

# What happened?

While the details of this particular failure aren't the key takeaway from this post, it is interesting to understand what happened. Our unit tests run on every merge to the production branch. Those unit tests continued to work on the commit that I broke. Instead, I have been working on different continuous deployment pipelines that will deploy our code as an API hosted on AWS. Those pipelines are only run manually, and I usually run them on feature branches if I want to make changes. Last week I changed the pipelines to [blah]. [keep going with this.]

# What to learn from it

It is frustrating when you work hard on code and it fails. But, stepping back, I wanted to think about what we can learn from failures. Unit tests and continuous integration checks are there for this exact reason. I was confident that my code worked; I spent a lot of time on it; the code passed lots of checks, including the test suite; however, despite all that, I managed to introduce a bug. Fortunately, because we have a robust series of checks beyond just our unit test suite, I was able to catch this particular mistake in our development environment before it affected any production systems.

I'm grateful for the failure for a few reasons. First, it actually tells me that our checks are working! If all we ever see is a wall of green check-marks, we may not be 100% sure our checks actually do what we want. For example, this is why test driven development works: you write a test and confirm that it fails before you write the code that makes it pass. Second, it reminds me that the purpose of writing code isn't to pass checks. The purpose of writing code is to accomplish a business objective. If green check-marks become the goal, then we risk missing out on the bigger picture, which is to apply our skills and resources to solving problems for our customers. We often do that by writing great code, but we often learn and grow more from failure.

For example, I am reminded of a skiing analogy. If you ski all day and never fall down, it could be a sign that you're not taking enough risk, not learning as much as you could, and not pushing yourself enough to grow. After all, you wear a helmet to protect you and to create the opportunities to take smart risks that lead to growth. Unit tests are like a helmet for our code, and I think it's ok if we take a couple falls as we build.

# Takeaways

I wanted to share this for a few reasons. First, because I, like a lot of people, have been conditioned to highlight success and minimize setbacks. I like reminding myself that failure is a natural part of growth, and failure helps build the skills and experience that ultimately lead to future success.

Second, I want our team to embrace and be comfortable sharing failure openly and asking for help when needed. I want everyone on the team to hold themselves to a high standard, but give tolerance and patience to the bumps that happen along the way.

I am incredibly energized by what we have built in 18 months as a team. In some ways, I was worried that the our project's perfect record actually created a barrier to people wanting to contribute. Now that the first failure on record is mine, and I own it proudly, I hope we can all feel more comfortable taking risks and learning and growing together as a team.
