import './App.css'
import {useEffect, useState} from "react";
import {Contact, ContactDTO} from "./Api.ts";
import axios from "axios";
import ContactDetailsForm from "./components/ContactDetailsForm.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";

function AddNewContactForm(props: { close: () => void }) {
    const form = useForm<ContactDTO>({
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            notes: ""
        }
    })

    async function handleSaveChanges(data: ContactDTO) {
        await axios.post("/api/contacts", data);
    }

    function handleClose(): void {
        if (confirm("Discard changes")) {
            props.close()
        }
    }

    return <form onSubmit={form.handleSubmit(handleSaveChanges)}>
        <FormProvider {...form}>
            <div>
                <h2>Add New Contact</h2>
                <ContactDetailsForm/>
                <button type="submit">Add new contact</button>
                <button type="button" onClick={handleClose}>Cancel</button>
            </div>
        </FormProvider>
    </form>;
}

function ContactDetailsModal(props: { contactId: string, close: () => void }) {
    const queryClient = useQueryClient()
    const contactDetailsQuery = useQuery(["contacts", props.contactId], () => axios.get<Contact>(`/api/contacts/${props.contactId}`)
        .then(response => response.data))

    const [formData, setFormData] = useState<ContactDTO | null>()

    const data = contactDetailsQuery.data

    const form = useForm<ContactDTO>({
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            notes: ""
        }
    })

    async function saveChanges(data: ContactDTO) {
        await axios.put(`/api/contacts/${props.contactId}`, data)
        queryClient.invalidateQueries(["contacts"])
    }

    useEffect(() => {
        if (data && formData == null) {
            setFormData({
                firstName: data.firstName!,
                middleName: data.middleName!,
                lastName: data.lastName!,
                notes: data.notes!
            })
        }
    }, [formData, data])

    useEffect(() => {
        if (formData) {
            form.setValue("firstName", formData.firstName)
            form.setValue("middleName", formData.middleName)
            form.setValue("lastName", formData.lastName)
            form.setValue("notes", formData.notes)
        }
    }, [formData])

    if (contactDetailsQuery.isLoading) {
        return <div>Loading...</div>
    } else if (contactDetailsQuery.isError) {
        return <div>An error occurred</div>
    }

    return <div>
        <FormProvider {...form}>
            <form onClick={form.handleSubmit(saveChanges)}>
                <ContactDetailsForm/>
                <button type="submit">Save changes</button>
                <button onClick={() => {
                    if (!confirm("Discard changes?")) return
                    props.close()
                    setFormData(null)
                }}>Close
                </button>
            </form>
        </FormProvider>
    </div>;
}

function App() {
    const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false)
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null)

    const contactsQuery = useQuery(["contacts"], () => axios.get<Contact[]>("/api/contacts")
        .then(response => response.data))

    const queryClient = useQueryClient()

    async function deleteContact(contactId: string) {
        if (!confirm("Are you sure?")) return
        const success = await axios.delete(`/api/contacts/${contactId}`).then(() => true).catch(() => false)

        if (!success) {
            alert("An error occurred")
            return
        }

        queryClient.invalidateQueries(["contacts"])
    }

    return <div>
        <h1>Contacts</h1>
        <button onClick={() => setShowAddContactModal(true)}>Add contact</button>
        <div>
            {contactsQuery.isLoading
                ? <div>Loading contacts...</div>
                : contactsQuery.isError
                    ? <div>An error occurred</div>
                    : <div>
                        {contactsQuery.data?.map((value) => (
                            <div key={value.contactId}>
                                {value.firstName} {value.lastName}
                                <button onClick={() => setSelectedContactId(value.contactId!)}>View</button>
                                <button onClick={() => deleteContact(value.contactId!)}>Delete</button>
                            </div>
                        ))}
                    </div>}

        </div>

        {showAddContactModal && <AddNewContactForm close={() => setShowAddContactModal(false)}/>}
        {selectedContactId &&
            <ContactDetailsModal close={() => setSelectedContactId(null)} contactId={selectedContactId}/>}
    </div>
}

export default App
