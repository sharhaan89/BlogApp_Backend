"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const user_1 = __importDefault(require("./routes/user"));
const blog_1 = __importDefault(require("./routes/blog"));
const passport_1 = __importDefault(require("passport"));
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(cookieParser());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session handling
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY || 'GRUMPY',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: 'none',
    },
}));
// Passport setup
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/", (req, res) => {
    return res.redirect("/user/login");
});
app.use("/user", user_1.default);
app.use("/blog", blog_1.default);
app.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
});
