import {useQueryClient} from "react-query";
import {FormProvider, useForm} from "react-hook-form";
import {ContactDTO} from "../Api.ts";
import axios from "axios";
import {Button, Form, Stack} from "react-bootstrap";
import ContactDetailsForm from "./contact-editor/ContactDetailsForm.tsx";
import {useParams} from "react-router-dom";
import {useMemo} from "react";

export function AddNewContactForm(props: { close: () => void }) {
    const {orgId} = useParams()
    const queryClient = useQueryClient()
    const form = useForm<ContactDTO>({
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            notes: "",
            phoneNumbers: [],
            phoneNumbersToDelete: [],
            emailAddressesToDelete: []
        }
    })

    const formChanged = useMemo(() => form.formState.isDirty, [form.formState.isDirty])

    async function handleSaveChanges(data: ContactDTO) {
        await axios.post(`/api/organizations/${orgId}/contacts`, data);
        queryClient.invalidateQueries(["organizations", orgId, "contacts"])
    }

    return <div className={"w-100 h-100 position-fixed top-0 start-0 bg-black bg-opacity-50"}>
        <div style={{width: "40%"}} className={"p-4 bg-white position-fixed top-0 end-0 h-100"}>
            <Form onSubmit={form.handleSubmit(handleSaveChanges)}>
                <FormProvider {...form}>
                    <Stack direction="horizontal" className={"mb-4"} gap={2}>
                        <Button type="submit">Add new contact</Button>
                        <Button variant="secondary" type="button" onClick={() => {
                            if (!formChanged || confirm("Discard changes")) {
                                props.close()
                            }
                        }}>Cancel</Button>
                    </Stack>
                    <h2>Add New Contact</h2>
                    <ContactDetailsForm/>
                </FormProvider>
            </Form>
        </div>
    </div>;
}