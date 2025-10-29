import './style.css'
import { createContact, loadContacts } from "./contacts"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>
  <h1> Telefonboken</h1>
  <form id="contactForm">
    <label>Namn</label>
    <input id="name" placeholder="Namn..."></input>
    <label>Telefonnummer</label>
    <input id="phone" placeholder="Telefonnummer.."></input>
    <button id="addBtn" type="submit">Lägg till kontakt</button>
  </form>

  <h2>Contacts<h2>
    <div id="loading"></div>
    <div id="contacts-content"></div>
</div>
`
  ;

const form = document.getElementById("contactForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {

    const name = (document.getElementById("name") as HTMLInputElement).value.trim();
    const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
    const data = await createContact(name, phone);

    if ((data).ok) form.reset();
  } catch (err: any) {
    alert(err.message || "kunde inte spara");
  }
});

loadContacts();