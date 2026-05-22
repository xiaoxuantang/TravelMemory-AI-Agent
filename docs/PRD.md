# TravelMemory AI Agent PRD

## 1. Overview

**Product name:** TravelMemory AI Agent

**Product type:** AI travel memory generator with viral poster and QR referral growth loop

**Primary stack:** Next.js, TypeScript, Tailwind CSS, Prisma, Redis queue, Cloudinary, OpenAI GPT-4o-mini, Zod

TravelMemory AI Agent helps users transform trip details into polished, shareable travel memories. Users submit lightweight trip inputs, receive AI-generated memory content, and can create posters with QR codes that invite friends into the product. The platform is designed for low AI cost, async reliability, moderation, and measurable growth through referrals and K-Factor analytics.

## 2. Product Goals

- Generate delightful, personal travel memories from minimal user input.
- Keep AI generation cost low enough to support referral-driven acquisition.
- Move slow or unreliable work into async queues.
- Make every generated poster a distribution surface through QR codes.
- Support Dummy Mode for demos, local development, tests, and graceful fallback.
- Use a credits system to meter generation and incentivize referral behavior.
- Detect and reduce referral abuse before credits are granted.
- Provide analytics that explain viral growth, conversion, cost, and quality.
- Allow operators to configure templates without changing core product logic.
- Fail gracefully when AI, queue, moderation, or media services are degraded.

## 3. Non-Goals

- Building a full social network.
- Building flight, hotel, or itinerary booking features.
- Replacing professional photo editing tools.
- Supporting every AI model provider in the first production version.
- Producing long-form travel blogs as the primary use case.

## 4. Target Users

### Travelers

People who want a beautiful memory artifact from a trip without writing from scratch. They value emotional tone, speed, and shareability.

### Social Sharers

Users who want a poster or visual recap suitable for social feeds, stories, group chats, and print-friendly sharing.

### Growth Operators

Internal operators who manage templates, credit campaigns, referral rules, and growth analytics.

### Developers And AI Agents

Future contributors who need clear boundaries for AI generation, jobs, credits, referrals, moderation, and analytics.

## 5. Core User Journey

1. User lands on the app directly or through a QR/referral link.
2. User enters trip details such as destination, dates, style, highlights, photos, mood, and language.
3. System validates the request and checks moderation.
4. System checks credits and creates a generation job.
5. Worker generates memory content through GPT-4o-mini or Dummy Mode.
6. Output is validated, moderated, and saved.
7. User previews the generated memory.
8. User creates a poster from a configurable template.
9. Poster is uploaded to Cloudinary and includes a QR referral link.
10. Friends scan the QR code, land on the product, and may sign up.
11. Referral attribution, anti-abuse checks, and credit rewards are processed.
12. K-Factor analytics measure viral performance.

## 6. MVP Scope

### Must Have

- Next.js app with user-facing memory generation flow.
- TypeScript and Zod validation at API and service boundaries.
- Prisma data model for users, memories, jobs, credits, referrals, templates, and analytics events.
- Redis-backed async queue for memory and poster generation.
- GPT-4o-mini memory generation with compact prompts.
- Dummy Mode with deterministic mock outputs and no paid AI calls.
- Credit debit and refund ledger.
- Referral code creation and QR landing attribution.
- Basic referral anti-abuse checks.
- Cloudinary upload for poster assets.
- Configurable memory and poster templates.
- Moderation status for user input and generated output.
- Graceful fallback content when AI generation fails or output is invalid.
- K-Factor event tracking and basic metric calculation.

### Should Have

- Admin or operator configuration for templates and campaign rules.
- Multiple poster templates optimized for social sharing.
- Queue dashboard or internal job status endpoints.
- Cost telemetry by model, template, user, and campaign.
- Manual review queue for moderation edge cases.
- Rate limiting for generation and referral actions.

### Could Have

- Multi-language memory generation.
- Photo-aware generation using image captions or metadata.
- Export to PDF or print-ready formats.
- A/B testing for prompts, poster templates, and QR placement.
- Team or creator accounts.

## 7. Functional Requirements

### 7.1 Memory Generation

Users can submit:

- Destination.
- Dates or rough season.
- Travel companions.
- Trip mood or tone.
- Highlights, notes, or favorite moments.
- Optional photos.
- Desired output language.
- Preferred template or style.

The system must:

- Validate input with Zod.
- Reject or review unsafe inputs.
- Estimate or enforce credit cost before queuing.
- Create a durable generation job.
- Generate structured memory output.
- Validate AI output with Zod.
- Moderate generated content.
- Save final output with metadata.
- Return job status and final content through API or UI polling.

Expected memory sections:

- Title.
- Short summary.
- Main memory narrative.
- Highlight bullets.
- Suggested caption.
- Poster text snippets.
- Template version and generation metadata.

### 7.2 Async Job Queue

All long-running tasks must run through Redis-backed queues:

- Memory generation.
- Poster rendering.
- Cloudinary upload and transformation.
- Optional moderation jobs.
- Optional analytics aggregation.

Jobs must include:

- Unique job id.
- Idempotency key.
- User id.
- Payload schema version.
- Status.
- Retry count.
- Error category.
- Created, started, and completed timestamps.

### 7.3 Low Token Cost

The system must reduce token cost through:

- GPT-4o-mini as default model.
- Short, versioned prompts.
- Compact JSON outputs.
- No unnecessary conversation history.
- Template-driven generation.
- Output length caps.
- Dummy Mode for demos and tests.
- Fallback copy when generation fails.
- Usage tracking per generation.

### 7.4 Poster Generation

Users can generate posters from approved memory content.

Posters must:

- Use configurable templates.
- Include title, destination, date or season, caption, and QR code.
- Use Cloudinary for storage and delivery.
- Store template version and asset metadata.
- Support retries without duplicate logical posters.
- Avoid publishing unmoderated content.

### 7.5 QR Growth Loop

Each shareable poster should include a QR code that resolves to a tracked URL.

QR URLs must:

- Attribute campaign, template, source user, and share id where safe.
- Avoid exposing sensitive user data.
- Land users on a page optimized for generating their own memory.
- Record scan and landing events.
- Preserve referral attribution through signup.

### 7.6 Dummy Mode

Dummy Mode must:

- Be controlled by configuration.
- Avoid paid external AI calls.
- Produce deterministic sample memories.
- Simulate job success and failure states when useful.
- Return the same response shape as production mode.
- Mark internal records as dummy-generated.

### 7.7 Credits System

Credits must be implemented as a ledger.

Required transaction types:

- `generation_debit`
- `generation_refund`
- `referral_bonus`
- `admin_grant`
- `abuse_reversal`

The system must:

- Check available balance before generation.
- Debit only once per logical generation request.
- Refund when generation fails after debit.
- Record reason, amount, user id, and idempotency key.
- Avoid granting referral rewards before anti-abuse checks pass.

### 7.8 Referral Anti-Abuse

The system must detect suspicious referral behavior before rewards.

Minimum checks:

- Self-referral prevention.
- Duplicate account signals.
- Repeated device or IP signals where available.
- Excessive referral velocity.
- Repeated failed or reversed rewards.
- Disposable or suspicious email patterns where available.

Outcomes:

- Approve reward.
- Hold for review.
- Reject reward.
- Reverse previously granted reward when later evidence requires it.

### 7.9 K-Factor Analytics

Track events needed to calculate viral coefficient:

- `memory_requested`
- `memory_generated`
- `poster_created`
- `poster_shared`
- `qr_scanned`
- `referral_landed`
- `signup_completed`
- `referral_reward_granted`

Core metrics:

- QR scans per active user.
- Referral landing conversion rate.
- Signup conversion rate.
- Referred user activation rate.
- Memories generated per referred user.
- Credit cost per acquired user.
- K-Factor by campaign and poster template.

Formula:

```text
K-Factor = average_invites_or_scans_per_user * referral_conversion_rate
```

### 7.10 Moderation

The system must moderate:

- User text input.
- Uploaded or linked images where supported.
- AI-generated memory content.
- Poster text before publishing.

Moderation states:

- `pending`
- `approved`
- `blocked`
- `needs_review`

Blocked content should receive a user-friendly explanation. Credits should not be consumed for blocked pre-generation requests.

### 7.11 Configurable Templates

Template configuration should support:

- Memory prompt templates.
- Tone and style variants.
- Poster layout templates.
- Locale-specific copy.
- Campaign-specific QR calls to action.
- Versioning and active/inactive status.

Template changes must be traceable in generation metadata.

### 7.12 Graceful AI Fallback

If AI generation fails, times out, or returns invalid content, the system should:

- Retry within queue policy.
- Fall back to safe template-based memory copy when appropriate.
- Mark records with fallback status.
- Avoid charging users for unrecoverable failures.
- Notify the UI with a clear state.
- Preserve enough metadata to debug the failure.

## 8. Data Model Requirements

Expected entities:

- `User`
- `Memory`
- `GenerationJob`
- `Poster`
- `CreditLedgerEntry`
- `ReferralCode`
- `ReferralAttribution`
- `ReferralReward`
- `AnalyticsEvent`
- `Template`
- `ModerationRecord`
- `Campaign`

Important modeling rules:

- Use immutable ledger entries for credits.
- Store generation metadata separately from user-visible text.
- Store template ids and versions on memories and posters.
- Store referral attribution at landing and signup time.
- Keep moderation records auditable.

## 9. API Requirements

Representative endpoints:

- `POST /api/memories` creates a generation job.
- `GET /api/memories/:id` returns memory status and content.
- `POST /api/posters` creates a poster job.
- `GET /api/jobs/:id` returns job status.
- `POST /api/referrals/land` records referral landing.
- `GET /api/credits/balance` returns credit balance.
- `GET /api/share/:shareId` resolves share page data.

All API routes must:

- Validate input with Zod.
- Return typed error responses.
- Avoid leaking internal errors.
- Enforce authentication where needed.
- Apply rate limits to abuse-sensitive routes.

## 10. UX Requirements

The UI should feel fast even while generation is async:

- Show clear queued and processing states.
- Let users leave and return to a generation result.
- Explain credit usage before generation.
- Make poster sharing prominent after success.
- Preserve referral context for new users.
- Offer graceful copy when services are temporarily unavailable.
- Avoid exposing implementation details such as raw queue errors or model failures.

## 11. Reliability Requirements

- Generation request path should remain responsive under AI latency.
- Queue jobs should be retryable and idempotent.
- Cloudinary uploads should not duplicate logical posters on retry.
- Credits should never double-debit from repeated requests.
- Referral rewards should never double-grant from replayed callbacks.
- Dummy Mode should keep demos and local development usable without external services.

## 12. Security And Privacy Requirements

- Do not commit secrets.
- Use server-only modules for API keys and privileged operations.
- Avoid logging raw personal travel notes unless explicitly needed and protected.
- Sanitize generated content before rendering.
- Protect referral abuse signals.
- Use signed or validated upload flows where applicable.
- Keep QR payloads free of sensitive data.

## 13. Observability Requirements

Log structured events for:

- Generation requested, started, succeeded, failed, and fallback.
- AI model usage and estimated cost.
- Queue retries and dead-letter events.
- Credit debit, refund, reward, and reversal.
- Referral landing, approval, hold, and rejection.
- Poster rendering and Cloudinary upload.
- Moderation decisions.

Dashboards should eventually show:

- Generation success rate.
- Average generation latency.
- Poster creation rate.
- QR scan conversion funnel.
- Referral reward approval rate.
- Cost per generated memory.
- Cost per acquired user.

## 14. Success Metrics

- Memory generation success rate.
- Average generation time.
- AI cost per successful memory.
- Poster creation rate after memory generation.
- QR scan rate per poster.
- Referral signup conversion rate.
- Referred user activation rate.
- K-Factor.
- Abuse rejection accuracy.
- Credit refund rate.
- User share rate.

## 15. Launch Criteria

The product is ready for first production launch when:

- Users can generate memories asynchronously.
- Failed jobs do not consume credits incorrectly.
- Posters include working QR links.
- Referral attribution survives landing to signup.
- Anti-abuse checks gate referral rewards.
- Dummy Mode works without paid services.
- Moderation states prevent unsafe publishing.
- Basic K-Factor events are recorded.
- Environment variables are validated.
- Production build, lint, and type checks pass.

## 16. Open Decisions

- Authentication provider.
- Database provider.
- Queue library selection.
- Exact poster rendering engine.
- Admin interface scope.
- Initial credit pricing.
- Initial referral reward amount.
- Image moderation provider.
- Whether analytics events live in primary database or a dedicated analytics store.
