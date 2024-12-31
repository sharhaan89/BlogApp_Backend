import db from "../db";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1).execute();
                
                if(!user) {
                    return done(null, false, { message: 'Invalid email' });
                }

                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if(!isValidPassword) {
                    return done(null, false, { message: 'Invalid password' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1).execute();
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;