# TravelMemory AI Agent - Agent Operating Guide

This repository contains **TravelMemory AI Agent**, a growth-oriented AI travel memory generator. The product helps travelers turn trip inputs into shareable AI-generated memories, posters, and QR-powered referral loops while keeping AI spend low and user-facing flows resilient.

This file is the primary working agreement for AI coding agents in this repository. Read it before making changes.

## Product Mission

TravelMemory converts lightweight user inputs such as destination, dates, mood, photos, notes, and travel style into polished travel memories and shareable visual assets. The system must be fast, safe, affordable to operate, and designed for growth loops through referral QR codes and posters.

The product prioritizes:

- AI-generated travel memories that feel personal, vivid, and shareable.
- Low token cost through concise prompts, template reuse, caching, and graceful fallback.
- Async generation so users never wait on long-running AI, image, or poster jobs in the request path.
- Poster generation with QR codes that bring new users into the referral loop.
- Dummy Mode for demos, local development, QA, and fallback operation without paid AI calls.
- Credits, referrals, K-Factor analytics, moderation, and anti-abuse protections.
- Configurable templates so operators can ship new styles without redeploying core logic.

## Expected Stack

Use these technologies unless a future architectural decision explicitly replaces them:

- **Next.js** with App Router for web UI and API routes.
- **TypeScript** everywhere.
- **Tailwind CSS** for styling.
- **Prisma** for database schema, migrations, and typed data access.
- **Redis queue** for async jobs. Prefer BullMQ or an equivalent Redis-backed queue if no queue library exists yet.
- **Cloudinary** for image storage, generated poster assets, transformations, and delivery.
- **OpenAI GPT-4o-mini** as the default low-cost generation model.
- **Zod** for runtime validation of request bodies, environment variables, queue payloads, and AI outputs.

## Core Domains

Future code should keep these domains clear and testable:

- **Memory generation**: Input validation, prompt assembly, AI call, output parsing, safety checks, fallback copy.
- **Jobs**: Queue producers, workers, retry policies, idempotency keys, job status updates.
- **Posters**: Template selection, rendered assets, Cloudinary upload, QR composition, share metadata.
- **Credits**: Balance, debit, refund, bonus grants, idempotent transactions, audit history.
- **Referrals**: Codes, attribution, reward rules, anti-abuse checks, fraud signals.
- **Analytics**: K-Factor metrics, conversion events, funnel events, cost telemetry.
- **Moderation**: User input screening, generated output checks, image safety, manual review states.
- **Templates**: Versioned prompt and poster templates with operator-friendly configuration.
- **Dummy Mode**: Deterministic mock generation, mock assets, simulated queues, no paid external calls.

## Engineering Principles

1. **Keep request paths thin.** Expensive work must go through the Redis queue. API routes should validate input, authorize, enqueue, and return status.
2. **Validate all boundaries.** Use Zod for API input, environment variables, queue payloads, webhook payloads, and AI JSON outputs.
3. **Design for idempotency.** Generation jobs, credit transactions, referral rewards, and Cloudinary uploads must be safe to retry.
4. **Track cost.** Every AI generation path should record model, token estimate or usage, template version, fallback status, and job id.
5. **Fail gracefully.** If AI, Cloudinary, Redis, or moderation fails, return actionable status and preserve user trust. Use Dummy Mode or fallback templates when appropriate.
6. **Protect growth loops.** Referral and QR systems must include anti-abuse checks before granting credits.
7. **Prefer configuration over hardcoding.** Prompt templates, poster templates, credit rules, and moderation thresholds should be configurable.
8. **Keep generated content safe.** Do not publish unmoderated or invalid AI output.
9. **Make observability boring and complete.** Log structured events for jobs, generation, credits, referrals, moderation, and poster rendering.
10. **Avoid speculative complexity.** Build clear, production-ready seams only when there is a real workflow behind them.

## Recommended Architecture

Use this structure when scaffolding the application:

```text
app/
  api/
    memories/
    jobs/
    referrals/
    credits/
  memories/
  share/
components/
lib/
  ai/
  analytics/
  cloudinary/
  credits/
  env/
  moderation/
  posters/
  prisma/
  queue/
  referrals/
  templates/
  validation/
prisma/
  schema.prisma
workers/
  memory-generation.worker.ts
  poster-generation.worker.ts
docs/
```

This is a target structure, not a command to rewrite the repository in one pass. When the codebase grows, preserve clear ownership boundaries and avoid mixing UI, database, AI, and queue logic in the same file.

## Environment Variables

Define and validate environment variables with a central Zod schema, for example in `lib/env/server.ts`.

Expected variables:

- `DATABASE_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`, defaulting to `gpt-4o-mini`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `DUMMY_MODE`
- `MODERATION_ENABLED`
- `REFERRAL_REWARD_CREDITS`
- `GENERATION_COST_CREDITS`

Never read secrets directly throughout the codebase. Import validated env values from the central env module.

## Dummy Mode

Dummy Mode is a first-class product capability, not a quick mock. It must:

- Avoid paid OpenAI and Cloudinary calls unless explicitly configured otherwise.
- Return deterministic memory content for stable tests and demos.
- Simulate queue lifecycle states where useful.
- Use local or static placeholder poster assets.
- Preserve the same API shape as production generation.
- Clearly mark generated outputs with `isDummy: true` in internal data.

Dummy Mode should be controlled by `DUMMY_MODE=true` and should be safe for local development, CI, demos, and incident fallback.

## AI Generation Rules

Use GPT-4o-mini by default. Keep prompts compact and strongly structured:

- Prefer short system prompts plus versioned templates.
- Ask for JSON when the UI needs structured sections.
- Validate model output with Zod.
- Cap output length by product surface.
- Avoid sending unnecessary user data or full histories.
- Store template version and model in generation metadata.
- Include graceful fallbacks when output is invalid, blocked, or unavailable.

Do not add new high-cost models without documenting the reason and adding cost controls.

## Queue Rules

Async job processing should follow these rules:

- Queue payloads must be Zod validated.
- Use idempotency keys for user-submitted generation requests.
- Persist job status: `queued`, `processing`, `succeeded`, `failed`, `blocked`, `fallback`.
- Apply bounded retries with backoff.
- Make credit debit and refund behavior explicit.
- Avoid duplicate poster uploads on retry.
- Record job duration and error category.

## Credits And Referrals

Credits are a ledger, not just a number. Use transaction records for:

- Generation debits.
- Failed-generation refunds.
- Referral bonuses.
- Admin grants.
- Abuse reversals.

Referral rewards should be granted only after anti-abuse checks pass. At minimum, consider:

- Duplicate accounts.
- Self-referrals.
- Repeated device, IP, or browser fingerprint signals where available.
- Disposable email patterns.
- Suspicious conversion velocity.
- Repeated payment or credit anomalies.

Do not silently grant credits in code paths that can be replayed.

## K-Factor Analytics

K-Factor should be measurable from explicit events:

- `poster_created`
- `poster_shared`
- `qr_scanned`
- `referral_landed`
- `signup_completed`
- `memory_generated`
- `referral_reward_granted`

At minimum, track:

- Invites or QR scans per active user.
- Conversion rate from QR scan to signup.
- Generated memories per referred user.
- Credit cost per acquired user.
- Viral coefficient by campaign, template, and acquisition channel.

## Moderation

Moderation must protect both inputs and outputs:

- Validate and screen user text before generation.
- Block or review unsafe image uploads where image moderation is available.
- Check generated output before publishing or poster rendering.
- Store moderation status and reason codes.
- Prefer user-friendly messages over raw policy labels.

If moderation blocks a request after credits are debited, refund or avoid debit according to the credits policy.

## Poster And QR Growth Loop

Generated posters should be designed for sharing and attribution:

- Posters include a QR code pointing to a share or referral landing URL.
- QR URLs should carry referral or campaign attribution without exposing sensitive user data.
- Poster templates should be configurable and versioned.
- Cloudinary assets should include structured public ids and metadata.
- Rendering should be deterministic enough to debug and retry.

## Testing Expectations

When adding code, include tests appropriate to the change:

- Zod schema tests for validation-heavy modules.
- Unit tests for credit ledger, referral reward logic, K-Factor calculations, and template selection.
- Queue tests for idempotency and retry behavior.
- API tests for validation, authorization, and job creation.
- Snapshot or contract tests for AI output parsing and fallbacks.
- Integration tests for Prisma models when schema changes.

Before handing off, run the relevant checks if scripts exist:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If scripts do not exist yet, do not invent fake verification. State what was checked.

## Security And Privacy

- Never commit `.env` files, API keys, database URLs, Redis URLs, or Cloudinary secrets.
- Minimize stored personal data.
- Avoid logging raw travel notes when they may contain private information.
- Treat referral abuse signals as sensitive.
- Sanitize user-visible generated content.
- Use server-only modules for secrets and privileged operations.

## Git And Collaboration

- Keep changes scoped and reviewable.
- Do not reformat unrelated files.
- Do not rewrite history unless the user explicitly asks.
- Document schema changes and migration implications.
- Preserve user work in a dirty worktree.
- Use clear commit messages such as `docs: add agent operating guides` or `feat: add memory generation queue`.

## Definition Of Done

A production-quality change should have:

- Clear user or operator value.
- Validated inputs and outputs.
- Reasonable tests for the risk level.
- Error handling and fallback behavior.
- Observability for important events.
- Documentation updates when behavior, setup, or architecture changes.
- No committed secrets or generated noise.
