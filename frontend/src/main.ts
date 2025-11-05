import './style.css'
import { createContact, loadContacts } from "./contacts"

const signupForm = document.getElementById("create-form");

signupForm?.addEventListener("submit", async (e) => {
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

const loginForm = document.getElementById("login-form");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = ((document.getElementById("login-email") as HTMLInputElement).value);
  let password = ((document.getElementById("login-password") as HTMLInputElement).value)

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "email": email,
      "password": password,
    }),
  });
if (res.status === 200){
    console.log("Login successful");
    const token = await res.text();
    localStorage.setItem("token", token);
    location.reload();
} else {
  alert(await res.text());
  location.reload();
}
})

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