import type { Contact } from "./types.js";
import type { Db, Collection } from "mongodb";

import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer | undefined;
let client: MongoClient | undefined;
let db: Db | undefined;
let contacts: Collection<Contact> | undefined;

export async function connectDB() {
    const isTesting = process.env.NODE_ENV === "test";

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
}
export function getContactsCollection() {
    if (!contacts) throw new Error("DB not initialized. Did you call connectDB()?");
    return contacts;
}