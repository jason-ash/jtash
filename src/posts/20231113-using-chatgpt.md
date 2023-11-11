---
title: How I use ChatGPT
slug: using-chatgpt
date: "2023-11-13"
excerpt: I've been using ChatGPT daily since it was launched. Here is what I've learned
  about how to use it effectively, where it struggles, and my wishlist for
  enhancements.
relatedPosts: []
status: published
---

# Introduction

ChatGPT will celebrate its first birthday this November. Launched on
<a href="https://x.com/sama/status/1598038815599661056">November 30, 2022</a>,
ChatGPT amassed 100 million users in its first two months to become the
fastest-adopted consumer application in history. It fundamentally changed the AI
industry, and for me, personally, it's hard to imagine going back to a world
without it.

I started using ChatGPT when it was launched, and within a couple days I
<a href="https://x.com/ashjasont/status/1598769476689723392">tweeted</a> about
how I used it to generate some riddles. They weren't very good riddles, but I
was fascinated by the technology, and I've used ChatGPT nearly every day since
then.

Over that time, I've developed a much better sense of how to use ChatGPT
effectively for the things I do most often: developing software and writing. To
celebrate ChatGPT's birthday, I am sharing how I use ChatGPT effectively both
for work and personal use.

In this post, I'll talk about the framework that I use to decide whether ChatGPT
is the right tool for the problem I'm trying to solve. Then, I'll share ten
examples of the types of questions I ask ChatGPT most often, which showcase what
I consider to be the model's strengths. Lastly, I share my wish list for future
improvements, many of which feel right around the corner.

# Understand your objective.

Before you start using any tool, you need to be clear about whether it is the
right tool for the job. Whenever I engage with ChatGPT, I get the best results
when I'm clear with myself about what I'm trying to accomplish. For example,
before exploring a topic with ChatGPT I find myself subconsciously running
through a mental checklist of the following questions. These questions help me
decide whether ChatGPT is the right tool for the problem I'm working on, or
whether I should use something else, like a search engine.

### Low-risk or High-risk

First, I ask myself what the output is for, and specifically whether it will be
used in a "high-risk" or "low-risk" context. For example, "please generate a
boilerplate html document" is a low-risk question: the consequences of getting
it wrong are small, or they might be easily fixed later with a compiler or code
linter. However, "please tell me where to invest my retirement savings" is a
high-risk question, especially if you follow the advice blindly.

ChatGPT can answer each of those questions, but the answers should be treated
differently. ChatGPT will almost always give you an answer; it is your job to
figure out what to do with it.

I will fact-check or get a second opinion on high-risk answers, while I will
generally take low risk answers at face value. Either way, I try to ensure I
know what regime I'm in before pursuing a line of questioning so I can approach
the conversation with the appropriate level of skepticism.

### Fact-based or Opinion-based

Next, I think about whether I'm asking for something fact-based, or
opinion-based. For example, "Who signed the United States Declaration of
Independence" is a fact-based question. I don't generally use ChatGPT for things
like this: wikipedia or some other authoritative source is a safer bet to ensure
you get the correct answer.

On the other hand, I often use ChatGPT for opinion-based discussions, like "can
you compare the design decisions between React and Solid.js and why someone
might choose one instead of the other?" In this case, ChatGPT can do an
excellent job distilling lots of content from across the internet into a useful
summary. The consequences of getting this wrong are low, and even though there
is no single right answer, I generally think ChatGPT does a good job
representing a balanced perspective.

This leads to the next major question I ask, which has to do with how much
training data ChatGPT has likely seen about my topic.

### Timeless or topical

ChatGPT was essentially trained on the entire internet. I assume it has read
every blog post, wikipedia article, book, and message board. I often think to
myself, "how frequently has my question, or something like it, appeared in that
training data?"

"Timeless" questions are those questions that appear over and over in the
training data, and there is some level of consensus or stability around the
topic. ChatGPT is usually very good at answering these timeless questions.

On the other hand, "topical" subjects are those that appear briefly in the
training data, might be highly contextual, and then quickly fade away.

I have found that Google is the right place to go for topical subjects,
especially if they are related to recent events. ChatGPT generally is not aware
of events from the last one to two years because of its training data cutoff, so
Google will always have much better information on current events.

### Creating or Editing

When ChatGPT was first released, I and many others were fascinated by its
ability to _create_. Twitter was filled with screenshots of prompts like, "Write
the United States Constitution in the voice of a pirate." And the results were
delightful.

After a year of using ChatGPT, I have found that I use it far more often for
_editing_ than I do for _creating_, but it depends on the situation. For me, the
most important thing is to understand _how differentiated does my output need to
be?_ Do I need something that sounds uniquely like me, or do I need something
that is undifferentiated/standard/common? Here are my guidelines:

I **don't** use ChatGPT to _create_ things that need to sound like I wrote them:
emails, powerpoint slides, strategy documents, etc. I find that it takes far
more effort to get something even remotely close to my voice than it would have
taken for me to write the thing myself.

I **do** use ChatGPT to _create_ things that don't need to sound like I wrote
them, especially if I expect there is some consensus standard practice for the
output I'm looking for. For example, "write me a boilerplate html document,"
"generate 12 brainstorming topics for an upcoming discussion", and the classic,
"please suggest 12 names for this variable/struct/collection". This is often
good enough after the first try, or I'm using the output myself as an input into
my own creative process.

I **don't** use ChatGPT to _edit_ my own writing. I haven't found the results to
be very good, mostly because I think those edits tend to dilute my voice. Maybe
with some better prompting I could work on this, but it feels like the effort
outweighs the benefits.

I **do** use ChatGPT to _edit_ my code, mostly as a second-opinion. Some of my
most common questions to ChatGPT involve me pasting a medium-sized chunk of code
and asking, "is this idiomatic? are there opportunities to improve it either for
readability, performance, or succintness?"

I think these guideliness will change over time, as we build large language
models with more context and better prompts. For example, it's possible that
with enough writing samples, ChatGPT could write something that sounds exactly
like me, but I haven't been able to get there yet.

These questions help me understand how to use ChatGPT - where it's likely to be
helpful, or where the effort of getting an answer might not be worth it. Next, I
will share ten examples showing how I use ChatGPT.

# Ten Examples

### 1. Exploring software architecture choices

I often use ChatGPT to prototype and explore different architectural designs of
my software projects. Things like, "what design pattern might work best here?"
"Do you see advantages to approach A over approach B?" I treat ChatGPT like a
fellow developer, where the act of _having the conversation itself_ is just as
valuable as the actual answers from the model.

One thing I have noticed here is that the quality of the discussion is
**significantly** better if I provide concrete examples. Even writing
non-functional pseudocode just to convey the idea tends to be a very powerful
prompt for the model to instantly understand what I'm after.

Here's a snippet of a recent conversation where I was talking about options for
handling multiple types of http requests in a single Rest API endpoint:

<blockquote>

**Me:** what if i had something like this? pseudocode.

```
fn handler(header: HeaderType) -> Response {
    match header {
        "application/json" => handler_json(),
        "application/x-www-form-urlencoded" => handler_form(),
        ..
    }
}
fn handler_json(...) {}
fn handler_form(...) {}
```

</blockquote>

<blockquote>
**ChatGPT:** Your pseudocode idea is quite reasonable and reflects a common approach
to content negotiation in web server design... [truncated]
</blockquote>

This is one of my favorite uses of ChatGPT, and a tiny, partially-complete
example can go a long way toward a productive discussion.

### 2. Meeting/Discussion prompts

When I need to create _undifferentiated_ content, ChatGPT is usually my first
stop. For example, I was preparing for a brainstorming session with some team
members to discuss pain points and opportunities for data at our company. I
asked ChatGPT to generate 12 questions that would cover all relevant
perspectives. The questions themselves weren't that important: instead I wanted
to make sure we were likely to prompt _ourselves, the group of humans_
effectively, so we could having a productive conversation. I changed a few words
from ChatGPT's output, sent the email, and was done in about five minutes.

Another example is coming up with interview questions. I asked ChatGPT, "Can you
suggest some questions I might ask to a senior technical manager to evaluate
their technical skills?" I used this as a starting point to think about how I
wanted to structure the interview, and what kinds of topics I might want to
cover. Ultimately, I rewrote the questions, but I liked using ChatGPT as a
starting point.

### 3. Debugging

When I'm debugging code - compiler errors in Rust or runtime errors in Python,
for example, I usually take a two-pronged approach for errors that don't seem
immediately obvious to me. Usually I will copy a large section of the error
message and dump it into ChatGPT with a curt message like, "please fix", and
then switch back to my editor to look at things more closely myself.

If I'm still stumped after a minute or so, I'll return to ChatGPT and see if it
suggested something I hadn't yet tried. If I'm still struggling, then I like
writing more detail in the chat about what I'm trying to accomplish. (If this
sounds like <a href="https://en.wikipedia.org/wiki/Rubber_duck_debugging">rubber
duck debugging</a>, that's exactly the point.) Usually writing things out this
way helps me solve my own problem before I've finished writing.

### 4. Introductions to topics and the relationships between them

I often use ChatGPT to learn about new things, just like I used Google or
Youtube before. However, with Google or Youtube, the learning is direted by the
content that someone else produced: they decided the topics, pace, depth, and
scope of the conversation. Sometimes this is fine, but I think ChatGPT's
strength is the ability to hone the discussion over time. I can drive the pace,
depth, and scope of learning myself with questions, almost like I had a tutor.

In particular I think the amazing strength of ChatGPT is the ability to _link_
topics together. Before, if I wanted to research topic X and topic Y, I would
find a blog post on topic X and another blog post on topic Y, and I would try to
form the link between them in my head. (Maybe a third blog post talked about the
link between X and Y, but not always.)

With ChatGPT, I can ask about topic X, topic Y, and I can explicitly explore the
link between then in the conversation. ChatGPT does a fantastic job of being
able to interpolate and draw connections between topics.

A recent example for me is trying to understand a bit more about web Sessions:
the concept of "a collection of interactions with your website by a particular
user, concentrated in time," and the design of a Rest API. I knew about
Sessions; I knew about Rest APIs, but I wanted to know more about the different
options I had for implementing Sessions in my API. I used ChatGPT for this, and
it was a great tool.

### 5. Evaluating the structure of a written document

I wrote above in the framework section that I don't use ChatGPT to write content
that should sound like my own voice. However, as I'm writing, I _do_ use ChatGPT
to comment on the overall structure, organization, content, and "coverage" of my
writing.

For example, while writing our company's Data Strategy document, I would copy
the table of contents, paste it into ChatGPT, and ask things like:

1.  Does the organization of topics make sense? Does it logically flow?
2.  Are there any gaps or topics that should be in here that aren't?
3.  Are there opporutnities to consolidate things together?

I found this level of partnership to be really effective. I was relying on
ChatGPT to ensure I was representing the "standard" parts of a Data Strategy in
my document, while working on the specific content myself.

### 6. Simple text or data cleanup

ChatGPT is great for taking small amounts of messy data and cleaning it up or
reformatting it. Here are some common examples that I've used:

1. Please convert this markdown table into html.
2. Here is some weirdly-delimited data I found online. Can you format it into
   comma-separated values?

I find myself doing this asynchronously: I'll grab some data, paste it into
ChatGPT with some quick instructions, go back to what I was doing, and then
return to the tab later to copy the clean data and continue with my work.

### 7. Validating a software design approach

I use ChatGPT to validate some portions of my code. Usually I have a good idea
of what I want to do, and I want a quick sanity check, like I would get by
asking a fellow developer. Is my code idiomatic? Is it easy to read and
understand? Does it look correct? Importantly, I still write unit tests to
ensure my code performs as expected. I am usually asking for comments on
readability, conciseness, and performance.

This snippet represents a common question I ask to the model. I don't mind
sharing this type of code with ChatGPT: 95% of the time it's code I'm very sure
someone else has written and published already, and I just want a quick review:

<blockquote>

**Me:** does this look right to you?

```rust
impl Encode<'_, Sqlite> for UserId {
    fn encode_by_ref(
        &self,
        buf: &mut <Sqlite as sqlx::database::HasArguments<'_>>::ArgumentBuffer,
    ) -> sqlx::encode::IsNull {
        <std::string::String as Encode<'_, Sqlite>>::encode(self.0.clone(), buf)
    }
}

impl Type<Sqlite> for UserId {
    fn type_info() -> sqlx::sqlite::SqliteTypeInfo {
        <String as Type<Sqlite>>::type_info()
    }
}
```

</blockquote>

<blockquote>

**ChatGPT:** Your implementation looks mostly correct, but I would suggest a few
changes for optimization and to adhere more closely to idiomatic Rust
practices... [truncated]

</blockquote>

### 8. Implementing highly specific, well-defined code snippets

I don't often use ChatGPT to write code for me from scratch, but occasionally I
use it to write well-defined implementations. This is very similar to using
tools like <a href="https://github.com/features/copilot">Github Copilot</a> or
<a href="https://aws.amazon.com/codewhisperer/">Amazon CodeWhisperer</a>.

Usually my question will look like this, and I only ask when I expect the
implementation to be a few lines. I will delegate the work to ChatGPT, go back
to what I was doing, and then copy the answer later. I only use this for code
which is highly undifferentiated - it's fairly obvious what the code should look
like, and I can just save a little time by not having to write it myself.

<blockquote>

**Me:** Please write the implementation.

```rust
pub enum Colors {
    Red,
    Blue,
    Green,
    Purple,
    ...
}

pub struct RgbValue ( // implement this)

impl From<Color> for RgbValue {
  // implement this
}
```

</blockquote>

### 9. Generating more detailed code examples

Great software libraries have great documentation. Great documentation often has
simple examples to help illustrate how the library should be used. However,
sometimes the examples are too simple, or they might not give you quite enough
information to fully understand how they should be used in your specific
situation.

For example, I was reading some of the examples in
<a href="https://mermaid.js.org/">mermaid.js</a>, a library for generating
charts programmatically. There are lots of
<a href="https://mermaid.js.org/syntax/classDiagram.html#examples">examples</a>,
but, maybe because I was impatient, I wanted an example that was "customized" to
my use case. I used ChatGPT to build a simple chart that had some of the
elements I expected I would need. My goal wasn't to have ChatGPT generate the
final product - instead, I wanted to get some indication of what my final
product _might_ look like.

Another example that I find myself doing probably a bit more than I should is
asking questions about common software patterns. For example, "please show me a
simple example of using the `entry` API in a Rust standard library HashMap." I
can look this up
<a href="https://doc.rust-lang.org/std/collections/struct.HashMap.html">here</a>
where there is excellent documentation. But sometimes, especially if I'm already
in the middle of a conversation with ChatGPT, I will ask anyways. In a lot of
cases, ChatGPT might actually infer why I'm asking and will adjust the answer to
incorporate the variables or context from our conversation, which is usually
helpful.

Note, your mileage may vary with this approach, especially for newer libraries
that aren't well-represented in ChatGPT's training data. But it's low-stakes to
ask.

### 10. Frictionless rabbit-hole diving

Finally, I suppose this is less of a specific example and more of a comment on
the _interface and process_ of using ChatGPT compared to other resources.

I have found that, compared to Google or Youtube, the dynamic nature of the
conversation with ChatGPT creates a frictionless learning experience. With
Google or Youtube, I consume predefined content with no ability to ask follow up
questions or explicitly connect different topics together.

On the other hand, with ChatGPT, I can pursue whatever thread of curiosity
strikes me, and the model generally does a fantastic job of linking my current
question with prior questions, just like it would if I were working with a
tutor. Combined with ChatGPT's encyclopedic knowledge of _everything_, this
makes for a very powerful learning tool.

# Wish list

Just like a
<a href="https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders">beautifully,
wonderfully dissatisfied customer</a>, I have a wishlist of things that I would still
love to see from ChatGPT. And, based on the pace of innovation that we've seen
this year, I think many of them are nearly here already.

1. I would love to have more of a permanent, running context that understands
   what projects I'm working on. This way, my answers would always have that
   pragmatic perspective, rather than being more abstract. It is possible to get
   close to this with
   <a href="https://openai.com/blog/custom-instructions-for-chatgpt">custom
   instructions</a>, but I am not aware of a way to keep those instructions
   updated more or less in real-time as things change. I would also love a way
   to do that automatically.

2. Github Copilot is starting to roll out a
   <a href="https://docs.github.com/en/copilot/github-copilot-chat/using-github-copilot-chat-in-your-ide">chat
   feature</a> that knows all about the software project you're working on. I
   think this is really cool. It's like Github Copilot turning its sights to
   ChatGPT. I would like to see ChatGPT turn its sights toward Copilot, and
   allow me to somehow dump my source files into the model context so it can
   answer questions about my code, but still be general enough to help me learn
   about high-level topics as well.

3. I am excited for models that we can run locally. I have played around with
   hosting models using <a href="https://ollama.ai/">Ollama</a>. I think the
   idea of having a model running in the background of your computer, always
   aware of what you're doing, is very powerful. It's so powerful, in fact, that
   I would only want this functionality if it's completely local to my machine.
   But I could imagine that this would be a great way to achieve the shared
   context I spoke about above.

4. Finally, I would like better attribution of sources. There are neat
   derivative products like <a href="https://www.phind.com/">Phind</a> that
   provide a large language model with source attribution, and I would love to
   see something similar from ChatGPT. Microsoft Bing provides some attribution,
   but I have found that the model quality is worse than GPT-4.

# Conclusion

After a year of using ChatGPT nearly every day, I find myself wondering how I
got things done before. Part of it is the model itself: it's incredibly
powerful, especially when you understand how to play to its strengths. But I
also think part of it is the _style_ of working that ChatGPT encourages.

For example, about 20% of the time, I will begin writing a question to ChatGPT
and realize, about halfway through, that I answered my own question. The
_process_ of writing the question, especially if I explicitly talk about the
options I'm considering, is often enough for me to realize the answer myself.
I'm not surprised by this, really: writing is an incredible tool for organizing
thoughts and creating focus. Forcing myself to describe problems and
alternatives is powerful by itself, even without a model like ChatGPT.

Then, the other 80% of the time, it feels like I'm able to call on the world's
leading expert in any topic I can think of (including the world's leading expert
in writing-like-a-pirate). I marvel at how fortunate I am to experience this
revolution in learning. What an amazing time to be alive!

Happy birthday, ChatGPT, and here's to another year of changing the world.
