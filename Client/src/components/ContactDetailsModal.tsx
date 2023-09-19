import {useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {Contact, ContactDTO} from "../Api.ts";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {Button, Container, Stack} from "react-bootstrap";
import ContactDetailsForm from "./ContactDetailsForm.tsx";

export function ContactDetailsModal(props: { contactId: string, close: () => void }) {
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