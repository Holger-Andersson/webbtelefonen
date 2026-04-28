const token = localStorage.getItem("token");

export async function createContact(name: string, phone: string) {
  const res = await fetch("/api/createContacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name, phone }),
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
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    console.log("Kontakten raderad");
    await loadContacts();
  } else {
    alert(await res.text());
  }
}

export async function updateContact(
  token: string,
  contactId: string,
  name: string,
  phone: string,
) {
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
  const outputEl = document.getElementById("contacts-list");
  statusEl.textContent = "Hämtar kontakter...";

  try {
    const res = await fetch("/api/contacts", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
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
        nameEl.innerHTML = `<span class="contact-label">Namn</span><span class="contact-value">${item.name}</span>`;

        const phoneEl = document.createElement("div");
        phoneEl.innerHTML = `<span class="contact-label">Telefon</span><span class="contact-value">${item.phone}</span>`;

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

        const contactInfo = document.createElement("div");
        contactInfo.appendChild(nameEl);
        contactInfo.appendChild(phoneEl);

        const manageBtns = document.createElement("div");
        manageBtns.className = "buttons";
        manageBtns.appendChild(editBtn);
        manageBtns.appendChild(delBtn);

        const nameRow = document.createElement("div");
        nameRow.className = "contact-header";
        nameRow.appendChild(contactInfo);
        nameRow.appendChild(manageBtns);

        const actionBtns = document.createElement("div");
        actionBtns.className = "buttons";
        actionBtns.appendChild(sendBtn);
        actionBtns.appendChild(prankCallBtn);

        row.appendChild(nameRow);
        row.appendChild(messageEl);
        row.appendChild(actionBtns);

        //lägger dtill i containern
        container.appendChild(row);
      }
    }
    console.log("loadContacts, hello");
  } catch (error: any) {
    outputEl.textContent = `${error.message ?? "Gick inte att hämta"}`;
  } finally {
    statusEl.textContent = "";
  }
}
