export async function createContact(name: string, phone: string) {
    const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
    });
    return res.json();
}
