import './style.css'
import { createContact, loadContacts } from "./contacts"

const createForm = document.getElementById("create-form");

createForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  let email = ((document.getElementById("create-email") as HTMLInputElement).value);
  let password = ((document.getElementById("create-password")as HTMLInputElement).value)

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

loadContacts();