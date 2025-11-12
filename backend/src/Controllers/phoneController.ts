import { Request, Response } from "express";
import { collections } from "../mongodb.js";
import { ObjectId } from "mongodb";

// ringa samtal och ta knapptryck
const username = process.env.ELKS_USERNAME;
const password = process.env.ELKS_PASSWORD;
const sender = process.env.ELKS_SENDER;

const auth = Buffer.from(username + ":" + password).toString("base64");

export async function sendSMS(req: Request, res: Response) {
    const { contactId, message } = req.body;
    console.log("ELKS_USERNAME len:", (process.env.ELKS_USERNAME ?? "").length);
    console.log("ELKS_PASSWORD len:", (process.env.ELKS_PASSWORD ?? "").length);
    console.log("ELKS_SENDER:", process.env.ELKS_SENDER);
    console.log("Sender:", sender);
    const contact = await collections.contacts.findOne({ _id: new ObjectId(contactId as string) })

    let data = {
        from: sender,
        to: contact.phone,
        message: message,
        // dryrun: "yes",
    }

    const URLSearchParamsString  = new URLSearchParams(data).toString();

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
                return res.status(200).send("Message sent and saved to history");
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

// // skicka smsm % ta emot sms

// // ringa samtal
// import type { PhoneData } from "../types.js"

// export async function makePhoneCall(req: Request, res: Response) {
//     const url = "https://api.46elks.com/a1/calls";
//     let data = {
//         from: "+46700000000",
//         to: "+46700000000",
//         voice_start: { "https://example.com/answer": any; };
//     };
//     data = new URLSearchParams(data).toString();
//     data = data.toString();

//     try {
//         const res = await fetch(url, {
//             method: "POST",
//             headers: {
//                 Authorization: "Basic " + auth,

//             }
//    body: data,
//         });
//         console.log(res.data);
//     } catch (error) {
//         console.error(error);
//         return;
//     }
// }