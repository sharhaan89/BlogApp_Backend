import { pgTable, text, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 25 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: text("password").notNull(),
});

export const blogs = pgTable("blogs", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    authorId: uuid("author_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
    posts: many(blogs),
}));

export const postsRelations = relations(blogs, ({ one }) => ({
    author: one(users, {
        fields: [blogs.authorId],
        references: [users.id],
    }),
}));

export const schema = { users, blogs };
