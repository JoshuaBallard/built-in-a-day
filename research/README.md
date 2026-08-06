# Research

This is research on **Obvious the company** — how they build, what they value,
and who they hire.

Not a capability tour of their product. Anyone can get that by asking the
product. The harder question, and the one that actually decides whether I would
be useful there, is how the work gets done.

Issue [#2](https://github.com/JoshuaBallard/built-in-a-day/issues/2) asked for
this before I designed anything. I did the research. I did not write it down.
So the file arrives late, and it says so.

---

## Provenance

Three sources, and they are not equal.

| Source | Type | When |
|---|---|---|
| The job description | First-hand | Before the build |
| About an hour inside the product | First-hand | Before the build |
| [Exception Handlers interview with David Boskovic](https://www.youtube.com/watch/_N68qOWOry8), CEO of Obvious | Second-hand, ~50 min | **After the site was built** |
| A session asking the product to describe itself | Self-reported by the product | After the site was built |

The third row matters most. The site was finished before I heard the interview.
Nothing on the site was changed to match it. The commit timestamps are the
receipt, and I would rather have the honest sequence than a tidier one.

The fourth row is positioning, not behavior — a product describing its own
strengths, including a competitor comparison flattering to its own lane. I have
kept it separate from anything I watched it actually do.

Model names in the auto-transcript look garbled in a few places. I have left
those claims vague rather than repeat a version number I cannot verify.

---

## How they build

The thing worth understanding, and the reason the rest of this file is arranged
the way it is.

They stopped writing code by hand. The engineering org has not meaningfully used
an IDE in months. Roughly 80% of their time goes to specification and design —
what to build, whether it is the right thing — and the build is handed to an
orchestrating agent that drives coding agents underneath it.

They did not set out to build this. They already had an orchestrator that was
good at product thinking and managing sub-agents, pointed it at Claude Code to
see what would happen, let it run about six hours, and it cleared something that
had been sitting in the backlog.

The numbers he gave: from 400–500 PRs a month with ten engineers, to about 3,000
within three or four weeks, and two to three times that now. Delivery went from
four to six weeks down to two days.

### What they did *not* change

This is the part I would have gotten wrong from the headline alone.

They still review every line of code before production. They did not relax the
gates when volume went up. They are HIPAA and SOC 2 compliant and say plainly
that nothing mainlines to production without human review.

What changed is *how* review works:

- **PRs got bigger on purpose.** Twenty or thirty small PRs making up one feature
  get reviewed as a single large one. Smaller units are more ergonomic — they
  said so — but human latency between chunks is the bottleneck, and at that
  volume the latency is the whole problem.
- **Agents produce their own evidence.** An agent boots the app in a sandbox,
  logs in as a user, exercises the feature it just built, and records a short
  clip. The reviewer scrubs the video, then reads the code. This catches what
  end-to-end tests structurally cannot — his example was a z-index bug, because
  Playwright targets elements directly and never notices a human could not
  actually click the thing.
- **Tooling exists to make review possible.** Agents strip generated files, flag
  new UI behind feature flags, and route the security-relevant parts of a
  full-stack change to whoever should sign off on it.

### "Underwrite," not "review"

Their word, and they are deliberate about it. Review implies you are there to add
material value. Underwriting means confirming everything is as it should be.

The sharpest line in the interview: for the first four to six weeks they treated
**material human feedback as a bug**. Not a nit, not minor steering — if a
reviewer had something substantive to say, the question became why the factory
produced code that needed it. The fix went into context engineering, agent
design, and skills. They say ~80% of PRs now need only cosmetic comment.

### Governance

Once anyone in the business could ship, everyone started to — including the
revenue co-founder slipping feature requests in after sales calls, and the head
of CS approving customer requests straight into the build. The product began
shifting day to day in ways nobody could trace.

Their answer was not to take the power away. The head of product wrote a
**product constitution** — a governing document both agents and humans use to
decide what can be built freely and what needs approval. The reasoning: autonomy
needs the free-society model, a constitution and laws rather than a government
that tells you when to wake up. He says the agents now tend to know before a
human does whether something fits how they want to build.

### Second-order costs

The unglamorous part, and the part I find most credible because it is unflattering.

- CI minutes hit six figures a month once PR volume went up 10–20×. They pointed
  the factory at it with a deliberately unreasonable goal — 50-minute CI under 30
  seconds — and it asked for a ~300-core bare metal box, then configured its own
  runner with a copy-on-write disk cache. Landed near $3,000/month, CI under a
  minute.
- One month they overspent inference by roughly $300k, because the natural rate
  limiter — humans can only prompt so fast — was gone.
- Infrastructure savings of about $100k/month came from engineers finally having
  the time and appetite to fix wasteful things.

His conclusion is the one I keep coming back to: cheap to build is not the same
as worth building. They fight internally against the idea that because you *can*
ship it in a day, you *should*.

---

## What they value, and who they hire

The most directly useful section for me.

- **He separates "engineers" from "software developers."** His distinction: some
  people are good at translating tickets into code but you would not trust them
  with a genuine engineering problem. He says they have not employed that profile
  in a while, and that those are the people who struggle most with the change.
- **The valued work is systems and architecture.** His claim is that no engineer
  would rather spend the day writing lines of code than thinking about the system
  they are building. Whether or not that is universally true, it is what they
  select for.
- **Appetite is a signal.** He described people spending three hours at a
  whiteboard and then building things he had not imagined — writing their own
  event queue because they were frustrated with the one they had.
- **PM profiles changed.** Less project management. More people whose judgment
  they trust about where the product should go.
- **Roles are converging on product.** Their head of CS is described as a product
  leader now.
- **No sacred cows.** He runs the company as a lab experiment, would not be
  surprised if everything they do now looks different in three months, and
  suggested another CTO should blow up their entire engineering process on
  purpose.
- **They teach it publicly.** Free two-day events at obvious.ai/frontier walking
  other teams through building a factory. That is a culture signal as much as a
  growth one.

---

## What I would be building on, and for whom

Demoted deliberately. If the work is client-facing, the product is the substrate
rather than the subject.

**The customers**, per the interview: service teams, sales teams, and success
teams trying to figure out how to adopt AI. Enterprise customers are the ones who
struggle most with the pace of change. The problem they describe chasing is
cognitive load around meetings — not handing you notes and action items, but the
agent doing the follow-ups.

**The product**, per its own description when asked: a workspace rather than a
chat window. Persistent artifacts, project structure that remembers across
sessions, specialized subagents running in parallel in their own sandboxes,
operational integrations wired in directly, and memory that carries between
threads.

**On design**, there is not enough to justify a section. The interview is about
engineering. What can be inferred: the interaction model treats the agent as a
participant rather than a panel — describing a change in place, and having it
appear, is a different premise than a chat sidebar. And if anyone can change any
part of the product in fifteen minutes, consistency has to come from a written
constitution rather than a design system a small group guards.

### One seam I noticed

The product names its own weakness as deep work in a large existing codebase, and
points you at Claude Code instead.

The interview describes them building their factory by pointing their
orchestrator — the thing that is good at product thinking and managing
sub-agents — *at Claude Code*.

So the boundary the product describes as a limit is the boundary they closed
internally by composing the two rather than choosing between them. I am not
proposing anything by noticing that. It is just the most interesting place where
two of their own accounts meet.

---

## What I got right before I heard any of this

Listed only because the timestamps let me say it without it being a claim.

- **CLAUDE.md is the same species of artifact as their product constitution.** A
  governing document written for the collaborator, before the work, constraining
  behavior instead of directing each task. I did not know they had one. I wrote
  mine because my own failures forced it.
- **"Documentation is shared memory."** That is chapter seven. Their version is
  context engineering — when the factory produces bad code, the fix goes into the
  context, not into the review comment.
- **"Verification matters more than confidence."** Chapter six is four failures
  that all reported success. Their agent-recorded QA evidence is the same
  instinct with better tooling.
- **"I stopped trying to build smarter AI. I started trying to build smarter
  environments for AI to work inside."** That is chapter eight, and it is close
  enough to their factory thesis that I was genuinely surprised to hear it back.

---

## What I got wrong

- **PR granularity.** I optimized for small, individually described,
  individually reviewed pull requests, and the site treats that as the good
  version of the practice. They deliberately went the other way, because at
  volume the human wait between small units is the largest source of dead time.
  My instinct is defensible for one person building one thing in one day. It does
  not generalize to their scale, and I presented it as though it would.
- **I framed human review as where value gets added.** They treat substantive
  human feedback as evidence that something upstream is broken. Those are not
  compatible views, and theirs is better adapted to what they are doing. I still
  think a human has to own the outcome — but "own the outcome" and "add material
  comment" are different jobs, and I had them fused.
- **I assumed the React and TypeScript gap was the main gap.** It may not be the
  most relevant one. If 80% of the work is specification, design, and
  underwriting, the sharper question is whether I can specify a system precisely
  enough to hand off and judge the result honestly. I would rather be tested on
  that than assume it counts in my favour.

---

## Open questions

In the order I would ask them.

1. **The job description named memory, agent-to-agent collaboration, and
   non-deterministic repeatability.** The product volunteers the first two
   unprompted when asked what it is. Repeatability appears nowhere — not in the
   interview, not in the product's account of itself. How do you know the same
   work produces the same result twice? Chapter six of this site is four
   failures that all confidently reported success, so this is the one I most
   want answered.
2. What is actually *in* the product constitution, and how is it enforced — is it
   prompt context, a gate in the pipeline, or convention?
3. Where is the line between what an agent may ship freely and what needs a human
   decision, and who moves that line?
4. How does a new engineer ramp when nobody uses an IDE? What does week one look
   like when the skill being hired for is underwriting?
5. How do you teach someone to underwrite well? It sounds like the highest-
   leverage skill in the org and the hardest to interview for.
6. The framework where most application code is treated as inherently untrusted —
   how does that reconcile with reviewing every line before production? Those
   pull in opposite directions.
7. Who decides a given build is worth its inference cost, now that the roadmap is
   a spending decision rather than a capacity decision?
8. What broke that they have not fixed yet? Every account of a system this new
   has one, and it is the most interesting thing in the room.

---

## Shelf life

He says they run about three months ahead of the public conversation, and that
their own methods could look completely different in another three.

So this is a snapshot of one person's account, on one podcast, on one day. It is
not a description of what Obvious is. It is a record of what I understood on
**August 5, 2026**, and what it changed about how I read my own work.

If I get the conversation, most of this becomes questions rather than
conclusions. That is the correct fate for it.
