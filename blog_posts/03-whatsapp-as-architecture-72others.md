---
title: "The Best Community Platform Decision I Made Was Not Building One"
slug: whatsapp-as-architecture-72others
date: "2026-01-04"
tags:
  - devlog
  - 72others
  - architecture
  - aws-amplify
  - community
status: draft
excerpt: "72Others has React, DynamoDB, Cognito, and AppSync. Its actual community hub is a WhatsApp link. That's not a limitation — it's the most important architectural decision in the project."
description: "Choosing WhatsApp as the community hub for a project with full AWS Amplify Gen2 infrastructure. Why the admin dashboard tracks outreach manually, and what grassroots architecture actually looks like."
---

# The Best Community Platform Decision I Made Was Not Building One

Let me show you the tech stack of 72Others:

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** AWS Amplify Gen2 — DynamoDB, AppSync GraphQL, Cognito
- **Auth:** Email-based Cognito User Pool with protected admin routes
- **Data:** Four DynamoDB models with authorization rules
- **Admin:** Authenticated dashboard with subscriber management, outreach tracking, and fraternity oversight

Now let me show you where the community actually lives:

```javascript
const whatsappLink = 'https://chat.whatsapp.com/BRws5fOy1fu6YACOMW7XnT';
```

A hardcoded string. One line. The most important piece of infrastructure in the entire project is a URL to someone else's platform.

## The Five-Second Redirect

The WhatsApp redirect page — the primary conversion action for the entire site — is 115 lines of JSX. Here is the core logic:

```jsx
const [countdown, setCountdown] = useState(5);

useEffect(() => {
  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        window.location.href = whatsappLink;
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, [whatsappLink]);
```

A countdown from five. Then `window.location.href`. The user leaves.

There is no API call on this page. No database write. No analytics event. No tracking pixel. No "before you go" modal. The user clicks "Find Your Anchor" on the homepage, watches a number count down from five, and is redirected to WhatsApp. They are gone from your platform, permanently, in five seconds.

In a conventional product, this would be a catastrophic design flaw. You have spent all this effort building a landing page, a manifesto, a programs browser — and your conversion action sends users to a platform you do not control, where you cannot track them, cannot message them, cannot measure engagement.

That is exactly right.

## Why WhatsApp Is the Architecture

The manifesto says: *"This community is free. And it's yours."*

If the community lived on a proprietary platform — even one I built — that statement would be conditional. Free, but on my terms. Yours, but on my infrastructure. With my analytics. My terms of service. My decision about what happens to your data if I shut the project down.

WhatsApp is not perfect. It is owned by Meta. It has its own privacy concerns. But it has one property that no custom-built community platform can match: **every man already has it.**

There is no onboarding friction. No account creation. No app download. No learning curve. The barrier between reading the manifesto and joining the community is a five-second countdown and a tap.

For a grassroots project trying to reach men who are isolated, lonely, and unlikely to sign up for yet another platform — that zero-friction entry matters more than any feature I could build.

## The Admin Dashboard as Manual CRM

The admin side tells a different story. While the public-facing site is minimal and sends you elsewhere, the admin dashboard at `/admin` is a full management interface protected by Cognito authentication.

It has four tabs: Subscribers, Outreach Contacts, Fraternities, and Programs. Three of them work. Programs says "Coming Soon."

The most revealing tab is Outreach Contacts. The DynamoDB model behind it:

```typescript
OutreachContact: a.model({
  name: a.string(),
  source: a.string().required(),  // "Exodus90 Community", "Catholic Man UK"
  dateContacted: a.datetime(),
  responseStatus: a.string(),     // "not_contacted", "contacted", "responded", "joined"
  notes: a.string(),
})
```

This is a manual outreach tracker. Not a CRM integration. Not an automated drip campaign. Not a growth hack. It tracks: who did I reach out to, where did I find them, when did I contact them, and did they respond.

The `responseStatus` field has four values: `not_contacted`, `contacted`, `responded`, `joined`. That progression tells you the workflow: find a potential community member, manually send them a message, wait for a response, track whether they joined. Each step is a human action. There is no automation here.

This is the opposite of the growth playbook that most community platforms follow. No "invite your friends" viral loops. No "share to Twitter" buttons. No referral codes. Just a person finding another person, writing them a message, and noting what happened.

## The Authorization Split

There is a detail in the data schema that is easy to miss but architecturally significant.

Three of the four models use this authorization:

```typescript
.authorization((allow) => [allow.publicApiKey(), allow.owner()])
```

Public API key access (read) plus owner access (write). Anyone can see subscribers, programs, and fraternities. Only the authenticated admin can modify them.

But `OutreachContact` uses this:

```typescript
.authorization((allow) => [allow.owner()])
```

Owner only. No public access at all. The people being reached out to — their names, their sources, their response statuses — are private by default. Not private because someone forgot to add public access. Private because outreach contacts are not the community's data. They are the organiser's working notes.

This is privacy-by-design embedded in a three-line authorization rule. In Amplify Gen2, the authorization declaration is not configuration — it generates the actual AppSync resolver logic and DynamoDB access patterns. This is not a policy document. It is enforced infrastructure.

## Four Models, No Relationships

The DynamoDB schema has four models. Logically, they are connected: a Fraternity follows a Program, a Subscriber might join a Fraternity, an OutreachContact might become a Subscriber. But in the schema:

```typescript
Fraternity: a.model({
  name: a.string().required(),
  programId: a.id(),        // Just an ID. No foreign key. No relationship.
  status: a.string(),
  startDate: a.date(),
  memberCount: a.integer(),
  whatsappGroupUrl: a.url(),
})
```

`programId` is `a.id()` — a bare identifier with no `@belongsTo` or `@hasMany` directive. No GraphQL relationship. No cascade delete. No referential integrity. If you delete a Program, any Fraternity pointing to it will just have a dangling ID.

In a traditional SaaS application, this would be a data modelling problem. You would want foreign keys, join tables, and enforced relationships. But 72Others is not a traditional SaaS application.

Fraternities form on WhatsApp, not in the database. The `programId` is a human note — "this group decided to do Exodus 90" — not a system constraint. The `memberCount` is a manually entered integer, not a computed count of linked user records. The `whatsappGroupUrl` points to the actual group on WhatsApp, where the real interaction happens.

The data model mirrors the messiness of real community formation. Relationships are loose because real relationships are loose. A fraternity does not *belong to* a program in any enforced sense. A group of men decided to do something together and someone noted which program they chose. The schema reflects that reality rather than imposing a cleaner one.

## The Missing Automation

Here is what 72Others does not have:

- **No email automation.** The README mentions AWS SES, but it is not wired up. Subscribers give their email, and it sits in DynamoDB until someone manually reads it.
- **No push notifications.** No service worker. No notification permission prompt. No "we missed you" re-engagement.
- **No onboarding flow.** No welcome email sequence. No "complete your profile" nudge. No step-by-step guide after signup.
- **No analytics.** No Google Analytics. No Amplify Analytics. No event tracking. No funnel metrics.

Each absence is a decision, not an oversight. The community runs on WhatsApp, not on the website. The website is a front door — it explains the philosophy, shows you the programs, and points you to the WhatsApp group. Once you walk through the door, the website's job is done.

This creates a strange architectural shape: a fully capable backend (DynamoDB, AppSync, Cognito) serving a frontend whose primary job is to redirect you somewhere else. The backend exists for the organiser, not the community member. The admin dashboard is the real product. The public pages are the brochure.

Most community platforms try to be the place where the community lives. 72Others tries to be the reason the community forms — and then gets out of the way.

## What Came Next

With the architecture settled — WhatsApp for community, the website for philosophy and administration — I turned to the most delicate design problem in the project: placing Christian accountability programs next to secular mental toughness challenges on the same page, and making both feel welcome.

That story is in [Exodus 90 Next to 75 Hard: Designing a Page That Bridges Faith and Secular Discipline](/posts/bridging-christian-secular-programs-72others).

---

*This post is part of a series documenting the development of [72Others](https://72others.com), written from the [72Others repository](https://github.com/arkadiuszkulpa/72Others).*
