import {FormEvent, useState} from "react";
import {Contact, ContactDTO} from "../Api.ts";
import axios from "axios";

export interface AddContactFormProps {
    onNewContact: (value: Contact) => void
}

export default function AddContactForm({onNewContact}: AddContactFormProps) {
    const [firstName, setFirstName] = useState<string>("")
    const [middleName, setMiddleName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [notes, setNotes] = useState<string>("")

    async function handleSaveChanges(event: FormEvent) {
        event.preventDefault()

        const payload: ContactDTO = {
            firstName, middleName, lastName, notes
        }

        const contact = await axios.post<Contact>("/api/contacts", payload)
            .then(response => response.data)

        onNewContact(contact)
    }

    return <form onSubmit={handleSaveChanges}>
        <h2>Add New Contact</h2>
        
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

}