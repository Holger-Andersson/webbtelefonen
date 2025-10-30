import type { Db, Collection } from "mongodb";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import type { User, Contact } from "./types.js";

let mongod: MongoMemoryServer | undefined;
let client: MongoClient | undefined;
let db: Db | undefined;

//samlar types under collections som samma objekt-referens som inte går att ändra.
//inuti är våra respektive kopplingar till till db. men typade mot ex User types.
export const collections: {
    users?: Collection<User>;
    contacts?: Collection<Contact>;
} = {}; // 

export async function initDB() {

    const isTesting = process.env.NODE_ENV === "test";

    if (isTesting) {
        const uri = "mongodb://localhost:27017";
        client = new MongoClient(uri);
        await client.connect();
        db = client?.db("app");
        console.log("Connected to local MongoDB at mongodb://localhost:27017", db.databaseName);
        // mongod = await MongoMemoryServer.create(({ instance: { dbName: "test" } }));
        // const uri = mongod.getUri();
        // console.log("RUNNING MONGOMEMORYSERVER at ", uri);
        // client = new MongoClient(uri);
        // await client.connect();
        // db = client.db("test")

    } else {
        console.log("mem server not running");
        return;
    }
    collections.users = db.collection<User>("users");
    collections.contacts = db.collection<Contact>("contacts");
}