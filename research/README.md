# Research

This is the research behind the site.

Issue [#2](https://github.com/JoshuaBallard/built-in-a-day/issues/2) asked for it
before I designed anything. I did the research. I did not write it down.

So this file arrives late, and it says so.

---

## Provenance

Two sources, and they are not equal.

| Source | Type | When |
|---|---|---|
| The job description | First-hand | Before the build |
| About an hour inside the product | First-hand | Before the build |
| [Exception Handlers interview with David Boskovic](https://www.youtube.com/watch/_N68qOWOry8), CEO of Obvious | Second-hand, ~50 min | **After the site was built** |

That last row matters. The site was finished before I heard the interview.
Nothing on the site was changed to match it. The commit timestamps are the
receipt, and I would rather have the honest sequence than a tidier one.

Model names in the auto-transcript look garbled in a few places. I have left
those claims vague rather than repeat a version number I cannot verify.

---

## Research notes

### What Obvious does

An applied AI research lab. Their framing of the problem is not "make a better
model" — it is that most AI capability is still untapped, and the gap is
*utility*. Most people are still chatting with an agent. The work is figuring
out what comes after chat.

Their product is a collaborative agent workspace where multiple humans work with
one agent, which is the part they describe as unique.

### The factory

The thing that got the most airtime, and the thing worth understanding.

They stopped writing code by hand. The engineering org has not meaningfully used
an IDE in months. Roughly 80% of their time goes to specification and design —
what to build, whether it is the right thing — and the build itself is handed to
an orchestrating agent that drives coding agents underneath it.

They did not set out to build this. They already had an orchestrator that was
good at product thinking and managing sub-agents, pointed it at Claude Code to
see what would happen, let it run about six hours, and it cleared something that
had been sitting in the backlog.

The numbers he gave: from 400–500 PRs a month with ten engineers, to about 3,000
within three or four weeks, and two to three times that now. Shipping timelines
went from four to six weeks down to two days.

### What they did *not* change

This is the part I would have gotten wrong if I had only heard the headline.

They still review every line of code before production. They did not relax the
gates when the volume went up. They are HIPAA and SOC 2 compliant and say
plainly that nothing mainlines to production without human review.

What changed is *how* review works:

- **PRs got bigger on purpose.** Twenty or thirty small PRs that make up one
  feature get reviewed as one large PR instead. Smaller units are more
  ergonomic — they said so — but human latency between chunks is the bottleneck,
  and at that volume the latency is the whole problem.
- **Agents produce their own evidence.** An agent boots the app in a sandbox,
  logs in as a user, exercises the feature it just built, and records a short
  clip. The reviewer scrubs the video, then reads the code. This catches things
  end-to-end tests structurally cannot — his example was a z-index bug, because
  Playwright targets elements directly and never notices that a human could not
  actually click the thing.
- **Tooling exists to make review possible.** Agents strip generated files,
  flag new UI behind feature flags, and route the security-relevant parts of a
  full-stack change to the person who should sign off on it.

### "Underwrite," not "review"

Their word, and they are deliberate about it. Review implies you are there to
add material value. Underwriting means confirming everything is as it should be.

The sharpest line in the interview: for the first four to six weeks, they treated
**material human feedback as a bug**. Not a nit, not minor steering — if a
reviewer had something substantive to say, the question was why the factory
produced code that needed it. The fix went back into context engineering, agent
design, and skills. They say ~80% of PRs now need only cosmetic or minor
comment.

### Governance

Once anyone in the business could ship, everyone started to — including the
revenue co-founder sneaking feature requests in after sales calls, and the head
of CS approving customer requests straight into the build. The product started
shifting day to day in ways nobody could trace.

Their answer was not to take the power away. The head of product wrote a
**product constitution** — a governing document that both agents and humans use
to decide what can be built freely and what needs approval. The reasoning he gave
is that autonomy needs the free-society model: a constitution and laws, not a
government that tells you when to wake up. He says the agents now tend to know
before a human does whether something fits how they want to build.

### Second-order costs

Worth noting because it is the unglamorous part:

- CI minutes hit six figures a month once PR volume went up 10–20×. They pointed
  the factory at it with a deliberately unreasonable goal — 50-minute CI under 30
  seconds — and it asked for a ~300-core bare metal box, then configured its own
  runner with a copy-on-write disk cache. Ended up around $3,000/month, CI under
  a minute.
- One month they overspent inference by roughly $300k, because the natural rate
  limiter — humans can only prompt so fast — was gone.
- Infrastructure savings of about $100k/month came from engineers finally having
  the time and appetite to go fix wasteful things.

His conclusion is the one I find most useful: cheap to build is not the same as
worth building. They fight internally against the idea that because you *can*
ship it in a day, you *should*.

---

## Product observations

### From the interview

- Multiple humans, one agent, in a shared workspace. That is the differentiator
  they lead with.
- They went broad first, then deep. Deep is easier for customers to absorb —
  a product that quietly gets better every day reads as quality, where fifty-five
  new features reads as chaos.
- They ship so much that a single weekly changelog is unusable. Updates are
  filtered per customer based on what they actually use.
- Right-click on something broken in the product, tell the agent you don't like
  it, and there is a PR fifteen minutes later. People fix things instead of
  complaining about them.
- The problem they described chasing is cognitive load around meetings — not
  handing you notes and action items, but the agent doing the follow-ups.
- Enterprise customers struggle most with the pace of change.

### From my own hour in the product

> **Not yet written.** I used the product for about an hour before building the
> site — chapter nine says so — but I never wrote the observations down. This
> section stays empty until I do, because inventing it after the fact would
> defeat the point of the file.

---

## Design observations

The interview is a conversation about engineering, not design, so this is thin
and I am not going to pad it.

What can be inferred:

- The interaction model assumes the agent is a participant, not a panel. Holding
  a key and describing what you want, in place, is a different interface premise
  than a chat sidebar.
- If any part of the product can be changed by anyone in fifteen minutes, then
  consistency has to come from a written constitution rather than from a design
  system that a small group guards.
- Continuous small improvement is treated as a feature of the experience, not a
  release-notes problem.

---

## Hiring observations

The most directly useful section for me, and the one I had the least of before.

- **He separates "engineers" from "software developers."** His distinction: some
  people are good at translating tickets into code but you would not trust them
  with a genuine engineering problem. He says they have not employed that profile
  in a while, and that those are the people who struggle most with the change.
- **The valued work is systems and architecture.** His claim is that no engineer
  would rather spend the day writing lines of code than thinking about the system
  they are building. Whether that is universally true or not, it is what they
  select for.
- **Appetite is a signal.** He described people spending three hours at a
  whiteboard and then building things he had not imagined — writing their own
  event queue because they were frustrated with the one they had.
- **PM profiles changed.** Less project management. More people whose judgment
  they trust about where the product should go.
- **Roles are converging on product.** Their head of CS is now described as a
  product leader.
- **No sacred cows.** He describes running the company as a lab experiment and
  says he would not be surprised if everything they do now is different in three
  months. He also suggested another CTO should blow up their entire engineering
  process on purpose.
- They run free two-day events teaching other teams to build a factory —
  obvious.ai/frontier — which is itself a hiring and culture signal.

---

## What I got right before I heard this

Listed only because the timestamps let me say it without it being a claim.

- **CLAUDE.md is the same species of artifact as their product constitution.**
  A governing document written for the collaborator, before the work, that
  constrains behavior instead of directing each task. I did not know they had
  one. I wrote mine because my own failures forced it.
- **"Documentation is shared memory."** That is chapter seven. Their version is
  context engineering — when the factory produces bad code, the fix goes into the
  context, not into the review comment.
- **"Verification matters more than confidence."** Chapter six is four failures
  that all reported success. Their agent-produced QA video is the same instinct
  with better tooling.
- **"I stopped trying to build smarter AI. I started trying to build smarter
  environments for AI to work inside."** That is chapter eight, and it is close
  enough to their factory thesis that I was genuinely surprised to hear it back.

---

## What I got wrong

- **PR granularity.** I optimized for small, individually described,
  individually reviewed pull requests, and the site treats that as the good
  version of the practice. They deliberately went the other way, because at
  volume the human wait between small units is the single largest source of dead
  time. My instinct is defensible for one person building one thing in one day.
  It does not generalize to their scale, and I presented it as if it would.
- **I framed human review as where the value is added.** They treat substantive
  human feedback as evidence that something upstream is broken. Those are not
  compatible views, and theirs is better adapted to what they are doing. I still
  think a human has to own the outcome — but "own the outcome" and "add material
  comment" are different jobs, and I had them fused.
- **I assumed the React and TypeScript gap was the main gap.** It may not be the
  main one. If 80% of the work is specification, design, and underwriting, the
  more relevant question is whether I can specify a system precisely enough to
  hand off, and judge the result honestly. I would rather be tested on that than
  assume it counts for me.

---

## Open questions

Things I could not answer from the interview, roughly in the order I would ask
them.

1. What is actually *in* the product constitution, and how is it enforced —
   is it prompt context, a gate in the pipeline, or convention?
2. Where is the line between what an agent may ship freely and what needs a
   human decision, and who moves that line?
3. How does a new engineer ramp when nobody uses an IDE? What does week one look
   like when the skill being hired for is underwriting?
4. How do you teach someone to underwrite well? It sounds like the highest-
   leverage skill in the org and the hardest one to interview for.
5. The framework where most application code is treated as inherently untrusted —
   how does that reconcile with "we review every line before production"? Those
   pull in opposite directions and I would like to understand the reconciliation.
6. Who decides that a given build is worth its inference cost, now that the
   roadmap is a spending decision rather than a capacity decision?
7. What broke that they have not fixed yet? Every account of a system this new
   has one, and it is the most interesting thing in the room.

---

## Shelf life

He says they run about three months ahead of the public conversation, and that
their own methods could look completely different in another three.

So this file is a snapshot of one person's account, on one podcast, on one day.
It is not a description of what Obvious is. It is a record of what I understood
on **August 5, 2026**, and what it changed about how I read my own work.

If I get the conversation, most of this becomes questions rather than
conclusions. That is the correct fate for it.
