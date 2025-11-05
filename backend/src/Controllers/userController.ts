import type { Request, Response } from "express";
import type { User } from "../types.js"
import { generateToken } from "../services/jwt.js"
import { collections } from "../mongodb.js"

export async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    const user: User = {
        email,
        password,          // (hash fixar vi senare)
        role: "user",
        createdAt: new Date(),
    };

    await collections.users!.insertOne(user);

    const token = await generateToken({ email: user.email, role: user.role })
    console.log("User added");
    return res.send(token);

}

export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await collections.users!.findOne({ email, password });

    if (!user) {
        return res.status(401).send("Invalid email or password");
    } else {
        res.send("Login successful");
        console.log("User logged in");
    }
}