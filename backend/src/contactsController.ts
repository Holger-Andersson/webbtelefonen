import { Request, Response } from "express";
import type { Contact } from "./types.js"
import { getContactsCollection } from "./mongodb.js";

export const createContact = async (req: Request, res: Response) => {
    const { name, phone } = req.body ?? {};
    const doc: Contact = {
        name: name.trim(),
        phone: phone.trim(),
        createdAt: new Date(),
    };
    const result = await getContactsCollection().insertOne(doc);
    res.status(201).json({ ok: true, id: result.insertedId });
    console.log("Contact added");
}

export const getContacts = async (req: Request, res: Response) => {
    const col = getContactsCollection();
    const items = await col
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    return res.json(items);
}
