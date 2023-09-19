import './App.css'
import {useEffect, useState} from "react";
import {Contact, ContactDTO} from "./Api.ts";
import axios from "axios";
import ContactDetailsForm from "./components/ContactDetailsForm.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";
import {Button, Container, Form, Navbar, Stack} from "react-bootstrap";

function AddNewContactForm(props: { close: () => void }) {
    const queryClient = useQueryClient()
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
        queryClient.invalidateQueries(["contacts"])
    }

    function handleClose(): void {
        if (confirm("Discard changes")) {
            props.close()
        }
    }

    return <Form onSubmit={form.handleSubmit(handleSaveChanges)}>
        <FormProvider {...form}>
            <Container fluid>
                <h2>Add New Contact</h2>
                <ContactDetailsForm/>
                <Stack direction="horizontal" className={"mt-3"} gap={2}>
                    <Button type="submit">Add new contact</Button>
                    <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
                </Stack>
            </Container>
        </FormProvider>
    </Form>;
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

    return <Container fluid>
        <FormProvider {...form}>
            <form onClick={form.handleSubmit(saveChanges)}>
                <ContactDetailsForm/>
                <Stack direction="horizontal" gap={2}>
                    <Button type="submit">Save changes</Button>
                    <Button variant="secondary" onClick={() => {
                        if (!confirm("Discard changes?")) return
                        props.close()
                        setFormData(null)
                    }}>Close
                    </Button>
                </Stack>
            </form>
        </FormProvider>
    </Container>;
}

function AppBar() {
    return <Navbar className={"text-bg-primary px-4 py-3 shadow"}>
        <div className={"fw-bold fs-4"}>
            CRM.NET
        </div>
    </Navbar>;
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
        <AppBar/>
        <Container fluid className={"py-4"}>
            <h1>Contacts</h1>
            <Button onClick={() => setShowAddContactModal(true)}>Add contact</Button>
            <div>
                {contactsQuery.isLoading
                    ? <div>Loading contacts...</div>
                    : contactsQuery.isError
                        ? <div>An error occurred</div>
                        : <div>
                            {contactsQuery.data?.map((value) => (
                                <Stack direction="horizontal" gap={2} key={value.contactId}>
                                    <div className={"flex-grow-1"}>
                                        {value.firstName} {value.lastName}
                                    </div>
                                    <Button onClick={() => setSelectedContactId(value.contactId!)}>View</Button>
                                    <Button variant={"danger"}
                                            onClick={() => deleteContact(value.contactId!)}>Delete</Button>
                                </Stack>
                            ))}
                        </div>}

            </div>
        </Container>

        {showAddContactModal && <AddNewContactForm close={() => setShowAddContactModal(false)}/>}
        {selectedContactId &&
            <ContactDetailsModal close={() => setSelectedContactId(null)} contactId={selectedContactId}/>}
    </div>
}

export default App
