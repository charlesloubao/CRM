import './App.css'
import {FormEvent, useEffect, useState} from "react";
import {Contact, ContactDTO} from "./Api.ts";
import axios from "axios";

function App() {
    const [contacts, setContacts] = useState<Contact[]>([])

    const [firstName, setFirstName] = useState<string>("")
    const [middleName, setMiddleName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [notes, setNotes] = useState<string>("")

    async function fetchContacts() {
        const existingContacts = await axios.get<Contact[]>("/api/contacts")
            .then(response => response.data)

        setContacts(existingContacts)
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    async function handleSaveChanges(event: FormEvent) {
        event.preventDefault()

        const payload: ContactDTO = {
            firstName, middleName, lastName, notes
        }

        const contact = await axios.post<Contact>("/api/contacts", payload)
            .then(response => response.data)

        setContacts((oldValue: Contact[]) => [...oldValue, contact])
    }

    return <div>
        <h1>Contacts</h1>
        <div>
            {contacts.map((value) => (
                <div key={value.contactId}>
                    {value.firstName} {value.lastName}
                </div>
            ))}
        </div>
        <div>
            <h2>Add New Contact</h2>
            <form onSubmit={handleSaveChanges}>
                <div>
                    <input value={firstName} onChange={event => setFirstName(event.target.value)} type="text"
                        placeholder={"First Name"}/>
                    <input value={middleName} onChange={event => setMiddleName(event.target.value)} type="text"
                        placeholder={"Middle Name"}/>
                    <input value={lastName} onChange={event => setLastName(event.target.value)} type="text"
                        placeholder={"Last Name"}/>
                </div>
                <div>
                    <textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder={"Notes"}/>
                </div>
                <button type="submit">Add new contact</button>
            </form>
        </div>
        
    </div>
}

export default App
