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
    const outputEl = document.getElementById("contacts-list")
    statusEl!.textContent = "Hämtar kontakter...";

    try {
        const res = await fetch("/api/contacts");

        const data = await res.json();
        if (data.length === 0) {
            outputEl!.textContent = "Din kontaktlista är tom";
        } else {
            const container = document.getElementById("contacts-list")!;

            container.innerHTML = "";
            
            for (const item of data) {
                const row = document.createElement("div");
                row.className = "row";
                row.dataset.id = item._id;

                //skapa element för varje objekt
                const nameEl = document.createElement("div");
                nameEl.textContent = item.name ?? "här var det tomt";

                const phoneEl = document.createElement("div");
                phoneEl.textContent = item.phone ?? "här var det tomt";

                const dateEl = document.createElement("div");
                dateEl.textContent = new Date(item.createdAt).toLocaleString();

                const delBtn = document.createElement("button");
                delBtn.type = "button";
                delBtn.textContent = "Delete";
                delBtn.className = "btn";
                delBtn.dataset.action = "delete";
                delBtn.dataset.id = item._id;

                row.appendChild(nameEl);
                row.appendChild(phoneEl);
                row.appendChild(dateEl);
                row.appendChild(delBtn);

                //lägger dtill raderna i containern
                container.appendChild(row);
            }

        }
        console.log("loadContacts, hello")
    } catch (error: any) {
        outputEl!.textContent = `${error.message ?? "Gick inte att hämta"}`;
    } finally {
        statusEl!.textContent = "";
    }
};
