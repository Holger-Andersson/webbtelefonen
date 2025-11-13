
export async function sendSMS(token: string, contactId: string, message: string) {

    const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactId: contactId, message: message }),
    });
    if (res.status === 200) {
        alert(await res.text());
        location.reload();
    }
}

export async function prankCall(token: string, contactId: string) {
    const res = await fetch("/api/phone/prankcall", {
        method: "POST",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactId: contactId }),
    });
    alert(await res.text());
    location.reload();
}