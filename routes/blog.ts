import db from "../db";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { users, blogs } from "../schema";

const express = require("express");
const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = req.body.userId;

    if(!title || !content) {
        return res.status(400).json({
            error: "title and content are required",
        });
    }

    try {
        const newBlog = await db
            .insert(blogs)
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

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/view/:id", async (req: Request, res: Response) => {
    try {
        const blog = await db
            .select({
                id: blogs.id,
                title: blogs.title,
                content: blogs.content,
                createdAt: blogs.createdAt,
                author: {
                    id: users.id,
                    username: users.username
                }
            })
            .from(blogs)
            .leftJoin(users, eq(blogs.authorId, users.id))
            .where(eq(blogs.id, req.params.id))
            .limit(1);

        if (!blog.length) {
            return res.status(404).json({ error: "Blog not found" });
        }

        return res.status(200).json({ blog: blog[0] });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/viewall", async (req: Request, res: Response) => {
    try {
        const allBlogs = await db
            .select({
                id: blogs.id,
                title: blogs.title,
                content: blogs.content,
                authorId: blogs.authorId,
                authorName: users.username,
                createdAt: blogs.createdAt,
                updatedAt: blogs.updatedAt,
            })
            .from(blogs)
            .leftJoin(users, eq(blogs.authorId, users.id))
            .execute();
        
        return res.status(200).json(allBlogs);
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
});

router.get("/viewbyuser/:id", async (req: Request, res: Response) => {
    try {
        const allBlogs = await db
            .select({
                id: blogs.id,
                title: blogs.title,
                content: blogs.content,
                authorId: blogs.authorId,
                authorName: users.username,
                createdAt: blogs.createdAt,
                updatedAt: blogs.updatedAt,
            })
            .from(blogs)
            .leftJoin(users, eq(blogs.authorId, users.id))
            .where(eq(blogs.authorId, req.params.id))
            .execute();
        
        return res.status(200).json(allBlogs);
    } catch (error) {
        return res.status(500).json({
            error: error,
        });
    }
});

router.put("/update/:id", async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const { title, content } = req.body;
    const userId = req.body.userId;

    if(!blogId || !title || !content) {
        return res.status(400).json({
            error: "blog id, title and content are required",
        });
    }

    try {
        const blog = await db
            .select()
            .from(blogs)
            .where(eq(blogs.id, blogId))
            .limit(1)
            .execute();

        if(blog.length === 0) {
            return res.status(404).json({
                error: "blog post not found",
            });
        }

        if(blog[0].authorId !== userId) {
            return res.status(401).json({
                error: "unauthorized to update this blog post",
            });
        }

        const updatedBlog = await db
            .update(blogs)
            .set({
                title: title,
                content: content,
                updatedAt: new Date(),
            })
            .where(eq(blogs.id, blogId))
            .returning()
            .execute();

        return res.status(200).json({
            message: "blog post updated successfully",
            blogPost: updatedBlog[0],
        });

    } catch(error) {
        return res.status(500).json({
            error: "internal server error",
        });
    }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const userId = req.body.userId;

    if(!blogId) {
        return res.status(400).json({
            error: "blog id is required",
        });
    }

    try {
        const blog = await db
            .select()
            .from(blogs)
            .where(eq(blogs.id, blogId))
            .limit(1)
            .execute();

        if(blog.length === 0) {
            return res.status(404).json({
                error: "blog post not found",
            });
        }

        if(blog[0].authorId !== userId) {
            return res.status(401).json({
                error: "unauthorized to delete this blog post",
            });
        }

        await db
            .delete(blogs)
            .where(eq(blogs.id, blogId))
            .execute();
    
        return res.status(200).json({
            message: "blog post deleted successfully",
        });

    } catch(error) {
        return res.status(500).json({
            error: "internal server error",
        });
    }
});

export default router;
