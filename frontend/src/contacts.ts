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

export async function deleteContact(token: string, contactId: string) {
    const res = await fetch(`/api/deleteContact/${contactId}`, {
        method: "DELETE",
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        },
    });

    if (res.ok) {
        console.log("Kontakten raderad");
        await loadContacts();
    } else {
        alert(await res.text());
    }
}

export async function updateContact(token: string, contactId: string, name: string, phone: string) {
    const res = await fetch(`/api/contacts/edit/${contactId}`, {
        method: "PUT",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
    });
    if (res.status === 200) {
        alert("Contact edited");
    } else {
        alert(res.text());
    }
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
                delBtn.dataset.action = "delete";
                delBtn.dataset.contactId = item._id;

                const editBtn = document.createElement("button");
                editBtn.type = "button";
                editBtn.textContent = "Edit";
                editBtn.dataset.action = "edit";
                editBtn.dataset.contactId = item._id;

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
                row.appendChild(editBtn);
                row.appendChild(delBtn);
                row.appendChild(sendBtn);
                row.appendChild(prankCallBtn);

                //lägger dtill i containern
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

