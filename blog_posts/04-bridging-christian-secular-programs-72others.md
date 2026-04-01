---
title: "Exodus 90 Next to 75 Hard: Designing a Page That Bridges Faith and Secular Discipline"
slug: bridging-christian-secular-programs-72others
date: "2026-01-23"
tags:
  - devlog
  - 72others
  - product-design
  - tailwind
  - community
status: draft
excerpt: "72Others curates 8 programs — 4 Christian, 4 secular — side by side. The design decisions behind that page reveal how code can express inclusivity without diluting identity."
description: "How the 72Others programs page places Christian and secular self-improvement programs side-by-side using deliberate design choices. A reflection on inclusive product design for a faith-rooted project."
---

# Exodus 90 Next to 75 Hard: Designing a Page That Bridges Faith and Secular Discipline

72Others has a problem that most tech projects never face.

The project is rooted in Luke 10 — the passage where Jesus sends seventy-two disciples into the world in pairs. The manifesto references "The Designer of this reality" and "God wants us to live life to the fullest." The name itself is a biblical reference.

And yet the FAQ on the How It Works page answers "Do I need to be Christian to join?" with this:

> *"We welcome men from all paths: Christian, atheist, agnostic."*

This is not a marketing hedge. It is a genuine philosophical position: the structure of brotherhood that 72Others proposes — fraternities, anchors, accountability — works regardless of your worldview. The insight behind it (that men need other men) is universal even if its origin story is not.

But that creates a design challenge. How do you honour a faith-based identity while making secular participants feel genuinely welcome — not tolerated, not accommodated, but *welcome*?

The Programs page is where that challenge becomes concrete.

## The Side-by-Side Layout

The page presents eight programs in two columns:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Secular Programs Column (Left) - lighter amber */}
  <div className="bg-amber-50/50 rounded-xl p-6 lg:p-8 border border-amber-100">
    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-amber-800">
      Secular Programs
    </h2>
    ...
  </div>

  {/* Christian Programs Column (Right) - more pronounced amber */}
  <div className="bg-amber-100 rounded-xl p-6 lg:p-8 border border-amber-200">
    <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-amber-900">
      Christian Programs
    </h2>
    ...
  </div>
</div>
```

Three design decisions are doing the heavy lifting here.

**First: both columns use the same colour family.** Secular is `bg-amber-50/50` with `border-amber-100`. Christian is `bg-amber-100` with `border-amber-200`. Same amber hue, different intensities. They are variations on a theme, not opposites. Not blue versus red. Not sacred versus profane. The same warmth at different strengths.

This matters more than it sounds. A common approach would be to give each column its own identity — perhaps a cross icon for Christian and a dumbbell for secular. That would clarify the distinction but also entrench it. The amber-on-amber approach says: these are two expressions of the same impulse.

**Second: secular is on the left.** In a left-to-right language, the left column comes first. It is what your eye lands on. For a project with Christian roots, placing the secular programs in the primary reading position is a deliberate gesture of hospitality. It says: you are not the afterthought.

**Third: the card styling is identical.** Both columns use the same card structure — title, duration badge, description, practices list, external link. The secular cards have `border-amber-200` and `bg-amber-100` badges. The Christian cards have `border-amber-300` and `bg-amber-200` badges. The progression of amber intensity continues from column level into card level, but the structure is the same. Neither column's programs look more "official" than the other.

## What Got Curated

The four secular programs:
- **75 Hard** — Andy Frisella's 75-day mental toughness challenge
- **75 Soft** — the community-driven, more sustainable alternative
- **The Strenuous Life** — Art of Manliness's skill-badge program based on Theodore Roosevelt's philosophy
- **Iron Council** — Order of Man's ongoing brotherhood and leadership community

The four Christian programs:
- **Exodus 90** — the 90-day Catholic ascetic exercise that inspired the whole project
- **That Man Is You** — a 26-week parish-based men's leadership program
- **33 Days to Morning Glory** — a shorter Marian consecration retreat
- **Into the Breach** — the Knights of Columbus video series on Catholic manhood

The curation is deliberate. The secular side includes 75 Soft alongside 75 Hard — acknowledging that extreme rigidity is not the only valid path to discipline. The Christian side ranges from the intense (Exodus 90: cold showers, fasting, limited technology for 90 days) to the gentle (33 Days to Morning Glory: 5-10 minutes of daily reading for 33 days).

Both sides include ongoing programs alongside time-bounded ones. Both sides include community-oriented options alongside individual ones. The parallel structure says: whatever intensity you want, whatever worldview you hold, there is a serious program here for you.

## Hardcoded, Not Database-Driven

All eight programs are defined as JavaScript arrays directly in `Programs.jsx`. They are not fetched from DynamoDB. The admin dashboard's Programs tab says "Coming Soon."

Meanwhile, the Amplify schema has a `Program` model sitting ready:

```typescript
Program: a.model({
  name: a.string().required(),
  description: a.string(),
  duration: a.string(),
  type: a.string(),
  resourcesUrl: a.url(),
  isActive: a.boolean(),
})
```

The infrastructure is built. The data model exists. The admin UI has a tab waiting for it. And the frontend ignores all of it in favour of hardcoded arrays.

This is a pattern I have seen in early-stage projects that I think is actually wise: build the infrastructure, then deliberately do not use it until the manual process is validated. The schema is a bet on the future. The hardcoded arrays are the present.

Right now, the program curation is editorial. Each description was written by hand. Each `practices` array was manually assembled. The external links were individually verified. This is not a marketplace where anyone can list a program. It is a recommendation from someone who has done the research.

Moving to the database would make it dynamic but lose the editorial control. That tradeoff is not worth making until there are enough programs to justify it — or until someone other than the organiser needs to manage them.

## "The Programme Is the Vehicle, Not the Destination"

The header of the Programs page reads:

> *"Whatever structure you want to use — Exodus 90, 75 Hard, or something else entirely. The programme is the vehicle, not the destination. Don't do it alone. Find brothers to walk it with you."*

This is a philosophically interesting thing for a programs page to say. Most program aggregators try to help you pick the right program. This one explicitly tells you the program does not matter much.

The "Create Your Own Program" section at the bottom reinforces this:

```jsx
<div className="bg-primary-50 border border-primary-200 rounded-lg p-8">
  <h2 className="text-2xl font-bold mb-4">Create Your Own Program</h2>
  <p className="text-gray-700 mb-6">
    Your fraternity can also design a custom program that fits your
    specific needs and goals. Combine elements from different programs
    or create something entirely new.
  </p>
  <p className="text-gray-700">
    The key is commitment, accountability, and brotherhood.
    The structure is less important than the journey you take together.
  </p>
</div>
```

The page spends its entire body curating eight programs with careful descriptions, practice lists, and external links. Then its closing message is: or ignore all of this and make your own. The structure is less important than the journey you take together.

This is the 72Others philosophy rendered in page layout. The programs are not the product. The brotherhood is the product. The programs are scaffolding — useful, curated, well-presented scaffolding — but scaffolding nonetheless.

The CTA at the bottom of the page does not say "Start a program." It says:

> *"You need someone else on the same journey. Period."*

Followed by a single button: "Find Your Anchor."

Not "Choose a program." Not "Sign up." Not "Get started." Find your anchor. The conversion action on the programs page is not about programs. It is about people.

## What the Tailwind Classes Tell You

I have spent most of this post discussing philosophy and design intent. But the implementation is where intent becomes real, and in a Tailwind project, the implementation lives in the class strings.

The secular column header: `text-amber-800`. The Christian column header: `text-amber-900`. One shade darker. Not a different colour. Not a different weight. One increment on the same scale.

The secular card badges: `bg-amber-100 text-amber-700`. The Christian card badges: `bg-amber-200 text-amber-900`. Again, one step warmer. The Christian side has more visual weight — it is the project's origin, after all — but the difference is felt rather than seen. You would have to put the two columns side by side (which is exactly how they are displayed) and look carefully to notice.

The hover states are identical: `hover:shadow-md` on both. The typography is identical. The spacing is identical. The external link styling differs only by one amber shade: `text-amber-600 hover:text-amber-800` for secular, `text-amber-700 hover:text-amber-900` for Christian.

These are not accidental choices. In a Tailwind project, every visual decision is explicit. There is no CSS cascade to hide behind. If the secular column is `bg-amber-50/50` and the Christian column is `bg-amber-100`, someone chose those values. Someone decided that the difference should be 50% opacity versus full opacity at the same level. Someone decided that was the right amount of distinction.

Most product design discussions about inclusivity focus on accessibility — screen readers, colour contrast ratios, keyboard navigation. Those matter. But there is another dimension of inclusivity that lives in the visual hierarchy: which content feels primary, which feels secondary, and how much daylight exists between them.

The answer on this page is: almost none. And that almost-none is the point.

## What This Series Was About

This is the last post in a series about building 72Others. I started with [how the project found its voice](/posts/band-of-brothers-to-72others-rebrand) — a rebrand from corporate-speak to confession. I wrote about [the paradox of building a #nogenai discipline with AI](/posts/nogenai-paradox-dowithout-challenge). I explored [why the best architecture decision was not building a community platform](/posts/whatsapp-as-architecture-72others).

The thread running through all of it is the gap between scaffolding and soul.

Claude built the scaffold in one commit. It was technically correct. The React components rendered. The DynamoDB queries returned data. The Cognito authentication worked. The routing was clean. The Tailwind classes were valid.

But no one would have read the manifesto. No one would have joined the WhatsApp group. No one would have looked at the programs page and felt that their worldview was welcome.

The nine commits that followed — rewriting words, changing colours, replacing emojis, writing manifestos, curating programs — those are the commits that turned a scaffold into something worth visiting. The ratio of philosophy commits to feature commits is the most honest metric I have about what building a community project actually requires.

The code works. The words matter more.

---

*This post is part of a series documenting the development of [72Others](https://72others.com), written from the [72Others repository](https://github.com/arkadiuszkulpa/72Others).*
