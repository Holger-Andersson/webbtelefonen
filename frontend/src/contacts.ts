import type { Contact } from "../../backend/src/types";

export async function createContact(name: string, phone: string) {
    const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
    });
    console.log("createContact, hello");
    loadContacts();
    return res.json();
}

export async function loadContacts() {
    const statusEl = document.getElementById("loading");
    const outputEl = document.getElementById("contacts-content")
    statusEl!.textContent = "Hämtar kontakter...";

    try {
        const res = await fetch("/api/contacts");

        const data = await res.json();
        if(data == "") {
            outputEl!.textContent = "Din konktaktlista är tom";
        } else {
        const list: Contact[] = data;
        outputEl!.textContent = JSON.stringify(list, null, 2);
        }
        console.log("loadContacts, hello")
    } catch (error: any) {
        outputEl!.textContent = `${error.message ?? "Gick inte att hämta"}`;
    } finally {
        statusEl!.textContent = "";
    }
};
