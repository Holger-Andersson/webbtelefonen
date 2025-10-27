import express from "express";
import { type Request, type Response } from "express"
import dotenv from "dotenv";
import path from "node:path";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import type { Contact } from "../src/types.js";
import type { Db, Collection } from "mongodb";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const isTesting = process.env.NODE_ENV === "test"

let mongod: MongoMemoryServer | undefined;
let client: MongoClient | undefined;
let db: Db | undefined;
let contacts: Collection<Contact> | undefined;

if (isTesting) {
    mongod = await MongoMemoryServer.create(({ instance: { dbName: "test" } }));
    const uri = mongod.getUri();
    console.log("RUNNING MONGOMEMORYSERVER at ", uri);

    client = new MongoClient(uri);
    await client.connect();

    db = client.db("test")
    contacts = db.collection<Contact>("contacts");

} else {
    console.log("mem server not running");
}

app.post('/api/contacts', async (req: Request, res: Response) => {
    const { name, phone } = req.body ?? {};
    const doc: Contact = {
        name: name.trim(),
        phone: phone.trim(),
        createdAt: new Date(),
    };
    const result = await contacts!.insertOne(doc);
    res.status(201).json({ ok: true, id: result.insertedId });
    console.log("Contact added");
})

app.listen(PORT, () => {
    console.log(`API is running from ${PORT}`);
})