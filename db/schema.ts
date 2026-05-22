import {
  pgTable,
  bigserial,
  bigint,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    nickname: text("nickname"),
    avatarUrl: text("avatar_url"),
    inviterId: text("inviter_id"),
    sourceScene: text("source_scene"),
    credits: integer("credits").notNull().default(5),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => ({
    inviterIdx: index("users_inviter_idx").on(table.inviterId),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt)
  })
);

export const memories = pgTable(
  "memories",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    city: text("city"),
    locationText: text("location_text"),
    mood: text("mood"),
    travelDate: text("travel_date"),

    title: text("title"),
    caption: text("caption"),
    xhsCaption: text("xhs_caption"),
    templateKey: text("template_key"),

    shareCardUrl: text("share_card_url"),
    miniQrPublicId: text("mini_qr_public_id"),

    model: text("model").notNull().default("gpt-4o-mini"),
    promptVersion: text("prompt_version").notNull().default("v1"),
    tokenCostLevel: text("token_cost_level").notNull().default("low_512"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => ({
    userIdx: index("memories_user_idx").on(table.userId),
    createdAtIdx: index("memories_created_at_idx").on(table.createdAt)
  })
);

export const memoryAssets = pgTable(
  "memory_assets",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    memoryId: bigint("memory_id", { mode: "number" }).references(
      () => memories.id,
      { onDelete: "cascade" }
    ),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    publicId: text("public_id").notNull(),
    secureUrl: text("secure_url").notNull(),

    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes"),

    role: text("role").notNull().default("input"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => ({
    memoryIdx: index("memory_assets_memory_idx").on(table.memoryId),
    userIdx: index("memory_assets_user_idx").on(table.userId),
    publicIdIdx: index("memory_assets_public_id_idx").on(table.publicId),
    createdAtIdx: index("memory_assets_created_at_idx").on(table.createdAt)
  })
);

export const aiJobs = pgTable(
  "ai_jobs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    status: text("status").notNull().default("PENDING"),

    payload: jsonb("payload").notNull(),
    result: jsonb("result"),
    error: text("error"),

    retryCount: integer("retry_count").notNull().default(0),
    jobKey: text("job_key").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => ({
    userIdx: index("ai_jobs_user_idx").on(table.userId),
    statusIdx: index("ai_jobs_status_idx").on(table.status),
    createdAtIdx: index("ai_jobs_created_at_idx").on(table.createdAt),
    jobKeyIdx: uniqueIndex("ai_jobs_job_key_idx").on(table.jobKey)
  })
);

export const shareCards = pgTable(
  "share_cards",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    memoryId: bigint("memory_id", { mode: "number" })
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    inviterId: text("inviter_id"),
    scene: text("scene").notNull(),

    posterUrl: text("poster_url").notNull(),
    qrPublicId: text("qr_public_id").notNull(),

    templateKey: text("template_key"),
    variant: text("variant").notNull().default("A"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => ({
    memoryIdx: index("share_cards_memory_idx").on(table.memoryId),
    userIdx: index("share_cards_user_idx").on(table.userId),
    sceneIdx: index("share_cards_scene_idx").on(table.scene),
    createdAtIdx: index("share_cards_created_at_idx").on(table.createdAt)
  })
);

export const growthEvents = pgTable(
  "growth_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    userId: text("user_id"),

    memoryId: bigint("memory_id", { mode: "number" }).references(
      () => memories.id,
      { onDelete: "set null" }
    ),

    shareCardId: bigint("share_card_id", { mode: "number" }).references(
      () => shareCards.id,
      { onDelete: "set null" }
    ),

    inviterId: text("inviter_id"),

    jobId: bigint("job_id", { mode: "number" }).references(
      () => aiJobs.id,
      { onDelete: "set null" }
    ),

    eventName: text("event_name").notNull(),
    variant: text("variant"),
    durationMs: integer("duration_ms"),
    meta: jsonb("meta"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date())
  },
  (table) => ({
    eventNameIdx: index("growth_events_event_name_idx").on(table.eventName),
    userIdx: index("growth_events_user_idx").on(table.userId),
    memoryIdx: index("growth_events_memory_idx").on(table.memoryId),
    shareCardIdx: index("growth_events_share_card_idx").on(table.shareCardId),
    inviterIdx: index("growth_events_inviter_idx").on(table.inviterId),
    jobIdx: index("growth_events_job_idx").on(table.jobId),
    createdAtIdx: index("growth_events_created_at_idx").on(table.createdAt)
  })
);
