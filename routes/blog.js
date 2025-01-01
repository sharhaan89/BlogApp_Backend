"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
const express = require("express");
const router = express.Router();
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const userId = req.body.userId;
    if (!title || !content) {
        return res.status(400).json({
            error: "title and content are required",
        });
    }
    try {
        const newBlog = yield db_1.default
            .insert(schema_1.blogs)
            .values({
            title: title,
            content: content,
            authorId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
            .returning()
            .execute();
        return res.status(201).json({
            message: "blog post created successfully",
            blogPost: newBlog[0],
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/view/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield db_1.default
            .select({
            id: schema_1.blogs.id,
            title: schema_1.blogs.title,
            content: schema_1.blogs.content,
            createdAt: schema_1.blogs.createdAt,
            author: {
                id: schema_1.users.id,
                username: schema_1.users.username
            }
        })
            .from(schema_1.blogs)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogs.authorId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.id, req.params.id))
            .limit(1);
        if (!blog.length) {
            return res.status(404).json({ error: "Blog not found" });
        }
        return res.status(200).json({ blog: blog[0] });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/viewall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBlogs = yield db_1.default
            .select({
            id: schema_1.blogs.id,
            title: schema_1.blogs.title,
            content: schema_1.blogs.content,
            authorId: schema_1.blogs.authorId,
            authorName: schema_1.users.username,
            createdAt: schema_1.blogs.createdAt,
            updatedAt: schema_1.blogs.updatedAt,
        })
            .from(schema_1.blogs)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogs.authorId, schema_1.users.id))
            .execute();
        return res.status(200).json(allBlogs);
    }
    catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
}));
router.get("/viewbyuser/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBlogs = yield db_1.default
            .select({
            id: schema_1.blogs.id,
            title: schema_1.blogs.title,
            content: schema_1.blogs.content,
            authorId: schema_1.blogs.authorId,
            authorName: schema_1.users.username,
            createdAt: schema_1.blogs.createdAt,
            updatedAt: schema_1.blogs.updatedAt,
        })
            .from(schema_1.blogs)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.blogs.authorId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.authorId, req.params.id))
            .execute();
        return res.status(200).json(allBlogs);
    }
    catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
}));
router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const { title, content } = req.body;
    const userId = req.body.userId;
    if (!blogId || !title || !content) {
        return res.status(400).json({
            error: "blog id, title and content are required",
        });
    }
    try {
        const blog = yield db_1.default
            .select()
            .from(schema_1.blogs)
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.id, blogId))
            .limit(1)
            .execute();
        if (blog.length === 0) {
            return res.status(404).json({
                error: "blog post not found",
            });
        }
        if (blog[0].authorId !== userId) {
            return res.status(401).json({
                error: "unauthorized to update this blog post",
            });
        }
        const updatedBlog = yield db_1.default
            .update(schema_1.blogs)
            .set({
            title: title,
            content: content,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.id, blogId))
            .returning()
            .execute();
        return res.status(200).json({
            message: "blog post updated successfully",
            blogPost: updatedBlog[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "internal server error",
        });
    }
}));
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const userId = req.body.userId;
    if (!blogId) {
        return res.status(400).json({
            error: "blog id is required",
        });
    }
    try {
        const blog = yield db_1.default
            .select()
            .from(schema_1.blogs)
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.id, blogId))
            .limit(1)
            .execute();
        if (blog.length === 0) {
            return res.status(404).json({
                error: "blog post not found",
            });
        }
        if (blog[0].authorId !== userId) {
            return res.status(401).json({
                error: "unauthorized to delete this blog post",
            });
        }
        yield db_1.default
            .delete(schema_1.blogs)
            .where((0, drizzle_orm_1.eq)(schema_1.blogs.id, blogId))
            .execute();
        return res.status(200).json({
            message: "blog post deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "internal server error",
        });
    }
}));
exports.default = router;
