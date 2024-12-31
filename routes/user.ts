import db from "../db";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { Request, Response } from "express";

dotenv.config();
const express = require("express");
const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            error: "email and password are required",
        });
    }

    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .execute();

        if(user.length === 0) {
            return res.status(404).json({
                error: "user not found",
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if(!isPasswordValid) {
            return res.status(401).json({
                error: "invalid credentials",
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user[0].id,
                email: user[0].email,
                username: user[0].username,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "internal server error",
        });
    }
});

router.post("/register", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({
            error: "username, email and password are required",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db
            .insert(users)
            .values({
                username: username,
                email: email,
                password: hashedPassword,
            })
            .returning()
            .execute();

        return res.status(201).json({
            message: "user created successfully",
        });

    } catch (err) {
        return res.status(500).json({
            error: "internal server error",
        });
    }
});

export default router;
