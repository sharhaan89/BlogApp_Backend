"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.postsRelations = exports.userRelations = exports.blogs = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    username: (0, pg_core_1.varchar)("username", { length: 25 }).notNull().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 100 }).notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.blogs = (0, pg_core_1.pgTable)("blogs", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    authorId: (0, pg_core_1.uuid)("author_id").references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    posts: many(exports.blogs),
}));
exports.postsRelations = (0, drizzle_orm_1.relations)(exports.blogs, ({ one }) => ({
    author: one(exports.users, {
        fields: [exports.blogs.authorId],
        references: [exports.users.id],
    }),
}));
exports.schema = { users: exports.users, blogs: exports.blogs };
