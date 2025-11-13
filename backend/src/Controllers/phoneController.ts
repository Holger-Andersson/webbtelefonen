import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { collections } from "../services/mongodb.js";
import { ObjectId } from "mongodb";


let username = process.env.ELKS_USERNAME;
const password = process.env.ELKS_PASSWORD;
const sender = process.env.ELKS_SENDER;
const auth = Buffer.from(username + ":" + password).toString("base64");

//skicka sms till kontakt via elk46
export async function sendSMS(req: Request, res: Response) {
    const { contactId, message } = req.body;
    const contact = await collections.contacts.findOne({ _id: new ObjectId(contactId as string) })

    let data = {
        from: sender,
        to: contact.phone,
        message: message,
        // dryrun: "yes", för att testa utan att skicka "riktigt" sms
    }

    const URLSearchParamsString = new URLSearchParams(data).toString();

    try {
        const response = await fetch("https://api.46elks.com/a1/sms", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + auth,
            },
            body: URLSearchParamsString,
        });
        if (response.status === 200) {
            const responseJSON = await response.json();

            if (
                responseJSON.status === "created" ||
                responseJSON.status === "sent" ||
                responseJSON.status === "delivered"
            ) {
                responseJSON.userId = req.user._id;
                responseJSON.contactId = contact._id;

                await collections.SMSData.insertOne(responseJSON);
                return res.status(200).send("Meddelande skickat");
            } else {
                console.error("46Elks failed to send message ", responseJSON);
                res
                    .status(500)
                    .send("Could not send message");
            }
        } else {
            console.error("failed to send sms, status: ", response);
            return res.status(500).send("Could not send SMS");
        }
    } catch (error) {
        console.error("Could not send SMS", error);
        return res.status(500).send("Could not send SMS");
    }
}

// Ringa samtal via 46elks API 
export async function prankCall(req: Request, res: Response) {
    const username = process.env.ELKS_USERNAME;
    const password = process.env.ELKS_PASSWORD;
    const phone = process.env.ELKS_PHONE;
    const auth = Buffer.from(username + ":" + password).toString("base64");

    const { contactId } = req.body;
    const contact = await collections.contacts.findOne({ _id: new ObjectId(contactId as string) })

    let data = {
        from: phone,
        to: contact.phone,
        voice_start: JSON.stringify({
            recordcall: "https://46elks.vercel.app/recordings",
            play: "https://soundboardmp3.com/wp-content/uploads/2025/06/i-will-send-you-to-jesus.mp3",
        })
    };
    //think fast: https://soundboardmp3.com/wp-content/uploads/2025/06/think-fast-chucklenuts_3ATncZo.mp3
    //jesus: https://soundboardmp3.com/wp-content/uploads/2025/06/i-will-send-you-to-jesus.mp3
    //https://46elks.vercel.app/mp3

    const URLSearchParamsString = new URLSearchParams(data).toString();
    try {
        const response = await fetch("https://api.46elks.com/a1/calls", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + auth,
            },
            body: URLSearchParamsString,
        });

        const responseJSON = await response.json();

        if (responseJSON.state === "ongoing") {
            return res
                .status(200)
                .send("Du ringer kontakten, du kan snart lyssna på inspelningen");
        } else {
            console.error(responseJSON);
            return res.status(500).send("Ditt prank lyckades inte, pröva ring igen.");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error!");
    }
}