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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../schema");
dotenv_1.default.config();
const express = require("express");
const router = express.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: "email and password are required",
        });
    }
    try {
        const user = yield db_1.default
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .limit(1)
            .execute();
        if (user.length === 0) {
            return res.status(404).json({
                error: "user not found",
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user[0].password);
        if (!isPasswordValid) {
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "internal server error",
        });
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            error: "username, email and password are required",
        });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield db_1.default
            .insert(schema_1.users)
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
    }
    catch (err) {
        return res.status(500).json({
            error: "internal server error",
        });
    }
}));
exports.default = router;
