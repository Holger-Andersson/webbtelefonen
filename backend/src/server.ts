import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./mongodb.js"

import { createContact, getContacts } from "./contactsController.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

await connectDB()

app.post('/api/contacts', createContact);

app.get('/api/contacts', getContacts);


app.listen(PORT, () => {
    console.log(`API is running from ${PORT}`);
})