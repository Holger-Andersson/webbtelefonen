import { validateToken } from "../services/jwt.js";
import { Request, Response, NextFunction } from "express";
import { collections } from "../mongodb.js"


export async function auth(req: Request, res: Response, next: NextFunction) {

    console.log("hej från auth middleware");
    // kollar om token finns
    if (!req.headers.authorization) {
        return res.status(400).send("No Authorization header found");
    }

    let user: any;
    //fetcha användaren från databasen om token är giltig
    try {
        
        user = await validateToken(req.headers.authorization);
    } catch (error) {
        console.error(error);
        return res.status(401).send("Invalid token");
    }
    try {
        user = await collections.users.findOne({ email: user.email });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
    req.user = {
        email: user.email,
        _id: user._id
    }
    next();
}