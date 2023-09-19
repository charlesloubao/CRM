import {useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {Contact} from "../../../Api.ts";
import {Button, Stack} from "react-bootstrap";
import {AddNewContactForm} from "../../../components/AddNewContactForm.tsx";
import {ContactDetailsModal} from "../../../components/ContactDetailsModal.tsx";
import {useParams} from "react-router-dom";

export default function DashboardPage() {
    const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false)
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
    const {orgId} = useParams()


    const contactsQuery = useQuery(["organizations", orgId, "contacts"], () => axios.get<Contact[]>(`/api/organizations/${orgId}/contacts`)
        .then(response => response.data))

    const queryClient = useQueryClient()

    async function deleteContact(contactId: string) {
        if (!confirm("Are you sure?")) return
        const success = await axios.delete(`/api/organizations/${orgId}/contacts/${contactId}`).then(() => true).catch(() => false)

        if (!success) {
            alert("An error occurred")
            return
        }

        queryClient.invalidateQueries(["contacts"])
    }

    return <>
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


        {showAddContactModal && <AddNewContactForm close={() => setShowAddContactModal(false)}/>}
        {selectedContactId &&
            <ContactDetailsModal close={() => setSelectedContactId(null)} contactId={selectedContactId}/>}
    </>

}