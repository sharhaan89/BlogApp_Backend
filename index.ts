import express from "express";
import session from "express-session";
import userRoutes from "./routes/user";
import blogRoutes from "./routes/blog";
import passport from "passport";

const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

// Session handling
app.use(session({
  secret: process.env.SECRET_KEY || 'GRUMPY',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    sameSite: 'none',
  },
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  return res.redirect("/user/login"); 
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});
