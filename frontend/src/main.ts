import './style.css'
import { createContact, loadContacts, updateContact, deleteContact } from "./contacts"
import { sendSMS, prankCall } from "./phone"

const token = localStorage.getItem("token");
if (token) {
  console.log("User is logged in");

  const loggedInDiv = document.getElementById("logged-in-div");
  loggedInDiv!.innerHTML = `  
    <h2>Contacts<h2>
        <form id="contactForm">
          <label for="name">Namn</label>
          <input id="name" name="name" placeholder="Namn...">
          <label for="phone">Telefonnummer</label>
          <input id="phone" name="phone" placeholder="Telefonnummer..">
          <button id="addBtn" type="submit">Lägg till kontakt</button>
        </form>
`;
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.innerHTML = `
  <button type="button" id="logoutBtn">Logga ut</button>
  `;
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.reload();
  });

  const contactForm = document.getElementById("contactForm") as HTMLFormElement;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {

      const name = (document.getElementById("name") as HTMLInputElement).value.trim();
      const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
      const data = await createContact(name, phone);

      if (data.ok) contactForm.reset();
    } catch (err: any) {
      alert(err.message || "kunde inte spara");
    }
  });

  const list = document.getElementById("contacts-list");
  if (list) {
    list.addEventListener("click", async (event) => {

      const delBtn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action='delete']");
      if (delBtn) {
        const contactId = delBtn.dataset.contactId;

        try {
          console.log(contactId);
          await deleteContact(token, contactId);

        } catch (err: any) {
          alert(err.message || "kunde inte radera kontakt");
        }
      }
      const sendBtn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action='send-sms']");
      if (sendBtn) {
        const contactId = sendBtn.dataset.contactId;
        const textarea = document.getElementById(`contact-sms-message-input-${contactId}`) as HTMLTextAreaElement;
        const message = textarea.value;

        if (!message) {
          alert("Skriv något först");
          return;
        }

        try {
          await sendSMS(token, contactId, message);
        } catch (err: any) {
          alert(err.message || "Kunde inte skicka meddelandet");
        }
      }

      const editBtn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action='edit']");
      if (editBtn) {
        const contactId = editBtn.dataset.contactId;
        const row = editBtn.closest(".row") as HTMLDivElement;

        //Hitta fälten som ska editas
        const nameEl = row.children[0] as HTMLDivElement;
        const phoneEl = row.children[1] as HTMLDivElement;
        const isEditing = row.dataset.editing === "true";

        if (!isEditing) {
          const currentName = nameEl.textContent.replace("Namn: ", "");
          const currentPhone = phoneEl.textContent.replace("Telefon: ", "");

          const nameInput = document.createElement("input");
          nameInput.value = currentName;
          nameInput.dataset.field = "name";

          const phoneInput = document.createElement("input");
          phoneInput.value = currentPhone;
          phoneInput.dataset.field = "phone";

          //Ersätter befintlig data med den nya
          nameEl.replaceWith(nameInput);
          phoneEl.replaceWith(phoneInput);

          row.dataset.editing = "true";
          editBtn.textContent = "Save";
          return;

        } else {
          const nameInput = row.querySelector('input[data-field="name"]') as HTMLInputElement;
          const phoneInput = row.querySelector('input[data-field="phone"]') as HTMLInputElement;

          const newName = nameInput.value.trim();
          const newPhone = phoneInput.value.trim();

          try {
            await updateContact(token, contactId, newName, newPhone);
            await loadContacts();
          } catch (err: any) {
            alert(err.message || "Kunde inte uppdatera kontakten");
            return;
          }
          row.dataset.editing = "false";
          editBtn.textContent = "Edit";
          return;
        }
      }

      const prankCallBtn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action='prank-call']");
      if (prankCallBtn) {
        const contactId = prankCallBtn.dataset.contactId;
        console.log("prankcallknapp");
        try {
          await prankCall(token, contactId!);
        } catch (error: any) {
          alert(error.message || "Kunde inte ringa");
        }
      }
    });
  }
  loadContacts();

} else {
  console.log("User not logged in");

  const signupDiv = document.getElementById("signup-div");
  signupDiv!.innerHTML = `      
      <h2>Create User</h2>
      <form method="post" id="create-form">
        <label for="create-email">E-Mail</label>
        <input id="create-email" type="email" name="email">
        <label for="create-password">Password</label>
        <input id="create-password" type="password" name="create-password">
        <input type="submit" value="Create User">
      </form>
`;
  const signupForm = document.getElementById("create-form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let email = ((document.getElementById("create-email") as HTMLInputElement).value);
    let password = ((document.getElementById("create-password") as HTMLInputElement).value)

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "email": email,
        "password": password
      })

    });
    if (res.status === 200) {
      const token = await res.text();
      console.log(token);
      localStorage.setItem("token", token);
      location.reload();
    } else {
      alert(await res.text());
      location.reload();
    }
  });

  const loginForm = document.getElementById("login-div");
  loginForm!.innerHTML = `
    <h2>Login User</h2>
    <form action="post" id="login-form">
      <label for="login-email">E-Mail</label>
      <input id="login-email" type="email" for="email">
      <label for="login-password">Password</label>
      <input id="login-password" type="password" name="login-password">
      <input type="submit" value="Login">
    </form>
    `;

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = ((document.getElementById("login-email") as HTMLInputElement).value);
    let password = ((document.getElementById("login-password") as HTMLInputElement).value);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      }),
    });
    if (res.status === 200) {
      console.log("Login successful");
      const token = await res.text();
      localStorage.setItem("token", token);
      location.reload();
    } else {
      alert(await res.text());
      location.reload();
    }
  });
}
