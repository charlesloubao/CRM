import './App.css'
import {useEffect, useState} from "react";
import {Contact} from "./Api.ts";
import axios from "axios";
import AddContactForm from "./components/AddContactForm.tsx";

function App() {
    const [contacts, setContacts] = useState<Contact[]>([])

    async function fetchContacts() {
        const existingContacts = await axios.get<Contact[]>("/api/contacts")
            .then(response => response.data)

        setContacts(existingContacts)
    }

    useEffect(() => {
        fetchContacts()
    }, [])


    async function deleteContact(contactId: string, index: number) {
        if (!confirm("Are you sure?")) return
        const success = await axios.delete(`/api/contacts/${contactId}`).then(() => true).catch(() => false)

        if (!success) {
            alert("An error occurred")
            return
        }

        setContacts(oldValue => {
            const newArray = [...oldValue]
            newArray.splice(index, 1)
            return newArray
        })
    }

    return <div>
        <h1>Contacts</h1>
        <div>
            {contacts.map((value, index) => (
                <div key={value.contactId}>
                    {value.firstName} {value.lastName}
                    <button onClick={() => deleteContact(value.contactId!, index)}>Delete</button>
                </div>
            ))}
        </div>

        <AddContactForm onNewContact={value => setContacts(oldValue => [...oldValue, value])}/>
    </div>
}

export default App
