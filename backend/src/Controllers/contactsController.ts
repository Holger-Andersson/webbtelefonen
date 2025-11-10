import { Request, Response } from "express";
import type { Contact } from "../types.js"
import { ObjectId } from "mongodb"
import { collections } from "../mongodb.js";

export const createContact = async (req: Request, res: Response) => {
    const { name, phone } = req.body ?? {};
    const doc: Contact = {
        name: name.trim(),
        phone: phone.trim(),
        userId: new ObjectId(req.user?._id),
        createdAt: new Date(),
    };
    const result = await collections.contacts.insertOne(doc);
    res.status(201).json({ ok: true, id: result.insertedId });
    console.log("Contact created");
}

export const getContacts = async (req: Request, res: Response) => {
    const col = collections.contacts;
    const items = await col
        .find({ userId: new ObjectId(req.user?._id) })
        .sort({ createdAt: -1 })
        .toArray();
    console.log("hello from getContacts");
    return res.json(items);
}

export const deleteContact = async (req: Request, res: Response) => {
    const id = req.params.id;
    await collections.contacts.deleteOne({ _id: new ObjectId(id) });
    return res.status(204).json({ ok: true });
}
