import {useQueryClient} from "react-query";
import {FormProvider, useForm} from "react-hook-form";
import {ContactDTO} from "../Api.ts";
import axios from "axios";
import {Button, Container, Form, Stack} from "react-bootstrap";
import ContactDetailsForm from "./ContactDetailsForm.tsx";
import {useParams} from "react-router-dom";

export function AddNewContactForm(props: { close: () => void }) {
    const {orgId} = useParams()
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
        await axios.post(`/api/organizations/${orgId}/contacts`, data);
        queryClient.invalidateQueries(["organizations", orgId, "contacts"])
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