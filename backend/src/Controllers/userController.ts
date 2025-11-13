import type { Request, Response } from "express";
import type { User } from "../types.js"
import { generateToken } from "../services/jwt.js"
import { collections } from "../services/mongodb.js"

export async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    const user: User = {
        email,
        password,          // (hash fixar vi senare)
        role: "user",
        createdAt: new Date(),
    };

    const userExists = await collections.users!.findOne({ email: email });
    if (userExists) {
        return res.status(400).send("User already exists");
    };

    const result = await collections.users!.insertOne(user);

    console.log("User added", user.email);
    return res.status(200).send(await generateToken({ email: user.email, _id: result.insertedId.toString() }));
}

export async function loginUser(req: Request, res: Response) {
    //tittar om användaren redan är inloggad
    if (req.headers.authorization) {
        return res.status(400).send("User already logged in");
    }
    const { email, password } = req.body;

    try {
        const user = await collections.users!.findOne({ email: email, password: password });

        if (user) {
            const token = await generateToken({ email: user.email, _id: user._id.toString() });
            console.log("User logged in");
            return res.status(200).send(token);
        }
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).send("Internal server error");
    }
}


