---
title: "Building a #nogenai Discipline on a Platform Built by Claude"
slug: nogenai-paradox-dowithout-challenge
date: "2026-03-22"
tags:
  - devlog
  - 72others
  - ai
  - philosophy
  - react
status: draft
excerpt: "The DoWithout Challenge asks people to stop using AI one Friday a month. The platform hosting that challenge was scaffolded by Claude in a single commit. That contradiction is the point."
description: "The philosophical tension of building an anti-AI-dependency discipline using AI tools. How the DoWithout Challenge embeds a genuine paradox into its architecture, and why that makes it more honest, not less."
---

# Building a #nogenai Discipline on a Platform Built by Claude

I need to tell you something uncomfortable about the DoWithout Challenge before we go any further.

The challenge has five disciplines. One of them — No GenAI Friday — asks you to spend one day a month without generative AI. No ChatGPT. No Claude. No Copilot. No Midjourney. The manifesto puts it plainly: *"Every time you outsource a thought, you lose a little of the muscle that made the thought possible."*

The platform hosting that manifesto was scaffolded by Claude in a single commit.

```
a3396d5 Claude <noreply@anthropic.com> Initial Band of Brothers platform implementation
```

That is not hypocrisy. That is the entire point.

## What #nogenai Actually Says

Most AI-sceptic writing falls into two camps: uncritical enthusiasm or existential dread. The DoWithout Challenge takes a third position that I think is more useful than either.

From the `dowithoutFasts.js` data file:

> *"GenAI is a wonderful invention — speeding up our work, churning through textual analysis or creative production, but where has our mind gone? Have we become a supervisor for our AI Agents? Have we gone into tech to be a clerk for AI bots?"*

And from the manifesto:

> *"We are not against these things... But something happens when a tool becomes invisible. When we can no longer imagine a morning without it. When we reach for it before we've even decided we need it. That is not freedom. That is dependency wearing comfort's clothes."*

The manifesto draws a specific line that I have not seen articulated this clearly elsewhere: *"Is this replacing my cognition, or assisting my workflow?"* Spell-check is fine. Google Maps is fine. Your spam filter is fine. Those are systems. The discipline targets the tools you ask to **think for you**.

That distinction matters because it is honest about what AI actually is — extraordinary and worth using — while asking whether you have noticed how much of your own thinking you have handed over. Not whether AI is good or bad. Whether you still know the way without it.

## The Retro Terminal Chatroom

The DoWithout page has a section that looks nothing like the rest of the site. While 72Others uses a clean white-and-blue design system, the chatroom drops you into this:

```jsx
<section className="py-16 bg-gray-900 text-green-400">
  <div className="max-w-4xl mx-auto px-4">
    <div className="border border-green-800 rounded-lg p-8 font-mono bg-black/50">
      <div className="flex items-center gap-2 mb-6 border-b border-green-800 pb-4">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="ml-4 text-green-600 text-sm">DoWithout://chatroom</span>
      </div>
```

Green on black. Monospace font. Fake macOS window chrome with the red/yellow/green dots. A protocol-style URL bar reading `DoWithout://chatroom`. It looks like a 1990s IRC channel rendered in Tailwind CSS.

This is not a random aesthetic choice. The chatroom manifesto describes it as: *"One open room. All five disciplines. Anonymous nicknames. Permanent history. No algorithm. No likes. No follower counts."*

Every one of those decisions is a philosophical statement coded into JSX. No likes: no performance metrics on vulnerability. No follower counts: no social hierarchy. No algorithm: conversations appear in the order they happened, not the order that maximises engagement. Anonymous nicknames: you are what you say, not who you are.

The retro terminal aesthetic reinforces this. It says: this is a tool, not a platform. It is deliberately ugly by modern standards because modern standards are what we are questioning.

The chatroom is currently a placeholder. The sample messages are hardcoded:

```
anon_42: First #decaf Thursday. Had a headache by 10am.
         That told me everything I needed to know.

walker_7: #nocar Wednesday — cycled to the shop.
          Noticed a bakery I've driven past for 3 years.

quiet_one: #nogenai Friday. Wrote actual code for the first
           time in weeks. Felt rusty. Then felt alive.
```

There is a `// TODO: embed live chatroom component` comment in the code. The manifesto for this chatroom is 167 lines long. The implementation is a styled `div` with three hardcoded strings.

That gap says something about where this project puts its priorities. The philosophy is further ahead than the code. The manifesto was written before the component. In most projects, that would be a red flag — all talk, no implementation. Here, I think it is the right order. You should know what a chatroom is *for* before you build one.

## Six Disciplines, Not Five

Here is something I noticed that the documentation does not mention.

The data file exports a constant called `fiveFasts`:

```javascript
export const fiveFasts = [
  { day: 'Monday',    name: 'No TV / Streaming',  hashtag: '#notv'      },
  { day: 'Tuesday',   name: 'No Social Media',     hashtag: '#nosocial'  },
  { day: 'Wednesday', name: 'No Car',              hashtag: '#nocar'     },
  { day: 'Thursday',  name: 'Decaf Thursday',      hashtag: '#decaf'     },
  { day: 'Friday',    name: 'No GenAI Friday',     hashtag: '#nogenai'   },
  { day: 'Saturday',  name: 'No Alcohol',          hashtag: '#noalcohol' },
];
```

Count them. Six items in an array called `fiveFasts`.

The manifesto describes five disciplines. The website renders all six but only because the component iterates over the full array. The sixth — No Alcohol on Saturdays — was added to the data file but never given a corresponding manifesto entry.

The code outran the documentation. The sixth discipline exists in data but not in philosophy. It has the same structure as the others — `day`, `name`, `tagline`, `hashtag`, `description`, `motivation`, `progression` — but it was not important enough to write a manifesto section about, or perhaps it was too sensitive to publish without more thought. Either way, it sits quietly in an array named after a number that no longer describes it.

These are the kinds of details that tell you a project is alive and being worked on by a human, not generated to completion and left. A generated project would have `fiveFasts` contain five items. A living project has a name that got left behind when the scope expanded.

## The Progression Model

Each discipline has a `progression` array — five steps from first attempt to sustainable habit. And here is what I find most interesting: the final step is never abstinence.

The #notv progression ends with: *"The goal isn't zero TV. It's choosing when you watch, not defaulting to it."*

The #decaf progression ends with: *"Coffee becomes a genuine boost again, not just fighting withdrawal."*

The #nogenai progression ends with: *"Your mind stays sharp. AI becomes your tool, not your crutch."*

The #noalcohol progression ends with: *"Alcohol becomes a pleasure you choose, not a routine you repeat."*

Every single one arrives at the same destination: conscious use, not elimination. The challenge is not asking you to quit anything. It is asking you to notice whether you are choosing or defaulting. The progression steps are designed to help you find the line where a tool serves you rather than owns you.

This is why the paradox of building the platform with AI is not a contradiction. The DoWithout Challenge does not argue that AI is bad. It argues that you should still know how to think without it. I used Claude to scaffold the platform. Then I rewrote every word by hand. That is exactly the relationship the #nogenai discipline is trying to help people find.

## What Came Next

With the DoWithout Challenge designed and its philosophy articulated, I stepped back to look at the architecture of the whole project. 72Others has React, DynamoDB, Cognito, and AppSync — but its actual community lives on WhatsApp. The website's most important page is a five-second countdown to someone else's platform.

That is not a limitation. It is a decision.

That story is in [The Best Community Platform Decision I Made Was Not Building One](/posts/whatsapp-as-architecture-72others).

---

*This post is part of a series documenting the development of [72Others](https://72others.com), written from the [72Others repository](https://github.com/arkadiuszkulpa/72Others).*
