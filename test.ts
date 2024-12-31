import db from "./db";
import { users } from "./schema";

async function testInsertion() {
    try {
        const newUser = await db.insert(users).values({
            username: "sharhaan89",
            email: "test@gmail.com",
            password: "123456",
        }).returning();

        console.log("User added:", newUser);
    } catch (err) {
        console.error("Error inserting user:", (err as Error).message);
    }
}

testInsertion();
