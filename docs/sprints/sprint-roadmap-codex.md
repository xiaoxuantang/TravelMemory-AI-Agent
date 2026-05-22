# TravelMemory Sprint Roadmap for Codex

## Global Rules

All sprints must follow:

```txt
Next.js App Router
TypeScript strict mode
TailwindCSS only for UI
No external UI component library
No animal-island-ui
No Nintendo / Animal Crossing / 动森 wording
No hardcoded brand hex colors in components
Use tm-* theme tokens
Mobile-first H5
Page max width: 480px
Server never stores uploaded binary files locally
Browser uploads images to Cloudinary directly
Backend only signs upload requests and stores metadata
```

Architecture order:

```txt
utils
services
repositories
domain/use-case
route handlers
```

Route handlers must stay thin.

## Sprint 0｜Project Skeleton & Infrastructure

## Goal

Freeze project foundation.

## Modify / Create

```txt
.env.example
drizzle.config.ts
app/lib/utils/env.ts
app/config/app-config.ts
app/lib/db/schema.ts
app/lib/db/index.ts
app/lib/cloudinary/client.ts
app/lib/queue/redis.ts
app/lib/ai/client.ts
app/types/database.ts
drizzle/0000_sprint0_init.sql
```

## Must

- Validate env with Zod.
- Connect Neon PostgreSQL.
- Initialize Drizzle schema.
- Initialize Cloudinary client.
- Initialize Upstash Redis client.
- Initialize OpenAI client.
- Create core tables:
  - `users`
  - `memories`
  - `memory_assets`
  - `ai_jobs`
  - `share_cards`
  - `growth_events`

Required fields:

- `users.credits`
- `ai_jobs.retry_count`
- `ai_jobs.job_key`
- `growth_events.job_id`

## Forbidden

- No UI implementation.
- No business workflow.
- No AI call.
- No upload logic.
- No local file storage.

## Acceptance

- `npm run build` passes.
- Drizzle migration works.
- Env validation works.
- Neon connection works.
- Cloudinary config can be read.
- Redis config can be read.
- OpenAI config can be read.
