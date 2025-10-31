import './style.css'
import { createContact, loadContacts } from "./contacts"

const createForm = document.getElementById("create-form");

createForm?.addEventListener("submit", async (e) => {
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
  const token = await res.text();
  console.log(token);
  localStorage.setItem("token", token);
})

const form = document.getElementById("contactForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {

    const name = (document.getElementById("name") as HTMLInputElement).value.trim();
    const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
    const data = await createContact(name, phone);

    if (data.ok) form.reset();
  } catch (err: any) {
    alert(err.message || "kunde inte spara");
  }
});

// container.addEventListener("click", async (e) => {
//   const target = e.target as HTMLElement;
//   if(target.getAttribute("data-action") !== "delete") return;
//   const row = target.closest<HTMLElement>("row");
//   const id = row?.dataset.id;
//   if(!id) return;
// })


const list = document.getElementById("contacts-list");
if (list) {
  list.addEventListener("click", async (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-action='delete']");
    if (!btn) return;
    const id = btn.dataset.id;
    console.log(id);
    const res = await fetch(`/api/deleteContact/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      console.log("Kontakten raderad");
      await loadContacts();
    }

  })

}

loadContacts();