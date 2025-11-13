const token = localStorage.getItem("token");
export async function createContact(name: string, phone: string) {

    const res = await fetch('/api/createContacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ name, phone })
    });
    console.log("createContact, hello");
    loadContacts();
    return res.json();
}

export async function loadContacts() {
    const statusEl = document.getElementById("loading");
    const outputEl = document.getElementById("contacts-list")
    statusEl.textContent = "Hämtar kontakter...";

    try {
        const res = await fetch("/api/contacts", {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        const data = await res.json();
        if (data.length === 0) {
            outputEl.textContent = "Din kontaktlista är tom";
        } else {
            const container = document.getElementById("contacts-list");

            container.innerHTML = "";

            for (const item of data) {
                const row = document.createElement("div");
                row.className = "row";
                row.dataset.contactId = item._id;

                //skapa element för varje objekt
                const nameEl = document.createElement("div");
                nameEl.textContent = `Namn: ${item.name}`;

                const phoneEl = document.createElement("div");
                phoneEl.textContent = `Telefon: ${item.phone}`;

                const messageEl = document.createElement("textarea");
                messageEl.textContent = item.message;
                messageEl.id = `contact-sms-message-input-${item._id}`;
                messageEl.placeholder = "Skriv ditt meddelandet här..";

                const delBtn = document.createElement("button");
                delBtn.type = "button";
                delBtn.textContent = "Delete";
                delBtn.className = "btn";
                delBtn.dataset.action = "delete";
                delBtn.dataset.contactId = item._id;

                const sendBtn = document.createElement("button");
                sendBtn.type = "button";
                sendBtn.textContent = "Send SMS";
                sendBtn.dataset.action = "send-sms";
                sendBtn.dataset.contactId = item._id;

                const prankCallBtn = document.createElement("button");
                prankCallBtn.type = "button";
                prankCallBtn.textContent = "Prank Call";
                prankCallBtn.dataset.action = "prank-call";
                prankCallBtn.dataset.contactId = item._id;

                row.appendChild(nameEl);
                row.appendChild(phoneEl);
                row.appendChild(messageEl);
                row.appendChild(delBtn);
                row.appendChild(sendBtn);
                row.appendChild(prankCallBtn);

                //lägger dtill raderna i containern
                container.appendChild(row);
            }

        }
        console.log("loadContacts, hello")
    } catch (error: any) {
        outputEl.textContent = `${error.message ?? "Gick inte att hämta"}`;
    } finally {
        statusEl.textContent = "";
    }
};

export async function SendSMS(token: string, contactId: string, message: string) {

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