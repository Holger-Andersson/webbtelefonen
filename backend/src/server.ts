import dotenv from "dotenv";
import express from "express";
import { initDB } from "./mongodb.js"
import { signup } from "./Controllers/userController.js"
import { createContact, getContacts, deleteContact } from "./Controllers/contactsController.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

await initDB(); // db innan routes.

app.post('/api/signup', signup);

app.post('/api/contacts', createContact);

app.get('/api/contacts', getContacts);

app.delete('/api/deleteContact/:id', deleteContact);


app.listen(PORT, () => {
    console.log(`API is running from ${PORT}`);
})