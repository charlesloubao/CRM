import {useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {Contact, ContactDTO} from "../../../Api.ts";
import {useMemo, useRef, useState} from "react";
import {formatContactFullName} from "../../../utils/contactUtils.ts";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import {FormProvider, useForm} from "react-hook-form";
import ContactDetailsForm from "../../../components/ContactDetailsForm.tsx";

type ContactDetailsPageMode = "view" | "edit"

function ContactDetails({contact, onEditContactButtonClick}: { contact: Contact, onEditContactButtonClick: () => void }) {
    return <div>
        <h1>{formatContactFullName(contact, false)}</h1>
        <Button onClick={onEditContactButtonClick}>Edit</Button>
    </div>
}

function EditContactForm({contact, onCancelClick}: { contact: Contact, onCancelClick: () => void }) {
    const originalContact = useRef<Contact>(contact)
    const queryClient = useQueryClient()

    const form = useForm<ContactDTO>({
        defaultValues: {
            firstName: contact.firstName,
            middleName: contact.middleName,
            lastName: contact.lastName,
            notes: contact.notes
        }
    })

    const formData = form.watch()

    const dataChanged = useMemo(() => {
        const {firstName, middleName, lastName, notes} = originalContact.current
        return firstName !== formData.firstName || middleName !== formData.middleName
            || lastName !== formData.lastName || notes !== formData.notes
    }, [formData, originalContact])

    const saveChanges = useMutation((data: ContactDTO) =>
        axios.put(`/api/organizations/${contact.organizationId}/contacts/${contact.contactId}`, data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["contact", contact.contactId])
            onCancelClick()
        },
        onError: (error) => {
            alert(error)
        }
    })

    return <Form onSubmit={form.handleSubmit(data => saveChanges.mutate(data))}>
        <div>
            <Button type={"button"} onClick={() => {
                if (!dataChanged || confirm("Discard changes?")) {
                    onCancelClick()
                }
            }}>Cancel</Button>
            <Button type={"submit"}>Save</Button>
        </div>
        <FormProvider {...form}>
            <ContactDetailsForm/>
        </FormProvider>
    </Form>;
}

export default function ContactDetailsPage() {
    const [mode, setMode] = useState<ContactDetailsPageMode>("view")
    const {orgId, contactId} = useParams()
    const contactQuery = useQuery(["contact", contactId],
        () => axios.get<Contact>(`/api/organizations/${orgId}/contacts/${contactId}`)
            .then(response => response.data))

    const contact = useMemo(() => contactQuery.data!, [contactQuery])

    if (contactQuery.isLoading) {
        return <div>Loading...</div>
    } else if (contactQuery.isError) {
        return <div>An error occurred</div>
    }

    return <div className={"p-4"}>
        {mode === "view"
            ? <ContactDetails onEditContactButtonClick={() => setMode("edit")} contact={contact}/>
            : <EditContactForm onCancelClick={() => setMode("view")} contact={contact}/>}
    </div>
}