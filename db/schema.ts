import { pgTable, serial, text, varchar, boolean, timestamp, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const participantStatusEnum = pgEnum("participant_status", [
  "joined",
  "in_progress",
  "completed",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(), // Mirrored from Supabase Auth
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testSessions = pgTable("test_sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  accessCode: varchar("access_code", { length: 20 }).notNull().unique(),
  testType: varchar("test_type", { length: 50 }).notNull().default('cfit'),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testParticipants = pgTable("test_participants", {
  id: serial("id").primaryKey(),
  sessionId: serial("session_id").references(() => testSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  personalData: jsonb("personal_data"),
  status: participantStatusEnum("status").default("joined").notNull(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  participantId: serial("participant_id").references(() => testParticipants.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 50 }).notNull(), // CFIT, EPPS, etc.
  reportData: jsonb("report_data").notNull(),
  scoreSummary: text("score_summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
