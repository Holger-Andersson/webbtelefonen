import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initDB } from "./mongodb.js"
import { signup, loginUser } from "./Controllers/userController.js";
import { createContact, getContacts, deleteContact } from "./Controllers/contactsController.js";
import { sendSMS, prankCall } from "./Controllers/phoneController.js";
import { auth } from "./middlewares/auth.js";


const app = express();
const PORT = 3000;

app.use(express.json());

await initDB(); // db innan routes.

app.post('/api/signup', signup);

app.post('/api/login', loginUser);

app.post('/api/createContacts', auth, createContact);

app.get('/api/contacts', auth, getContacts);

app.delete('/api/deleteContact/:id', auth, deleteContact);

app.post('/api/sms/send', auth, sendSMS);

app.post('/api/phone/prankcall', auth, prankCall);

app.listen(PORT, () => {
    console.log(`API is running from ${PORT}`);
})