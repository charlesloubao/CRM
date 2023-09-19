import {useState} from "react";
import {useQuery} from "react-query";
import axios from "axios";
import {Contact} from "../../../Api.ts";
import {Button, Stack} from "react-bootstrap";
import {AddNewContactForm} from "../../../components/AddNewContactForm.tsx";
import {ContactDetailsModal} from "../../../components/ContactDetailsModal.tsx";
import {useParams} from "react-router-dom";
import {ContactsTable} from "../../../components/ContactsTable.tsx";

export default function DashboardPage() {
    const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false)
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
    const {orgId} = useParams()


    const contactsQuery = useQuery(["organizations", orgId, "contacts"], () => axios.get<Contact[]>(`/api/organizations/${orgId}/contacts`)
        .then(response => response.data))

    return <>
        <Stack gap={2} direction={"horizontal"}>
            <h1>Contacts</h1>
            <Button onClick={() => setShowAddContactModal(true)}>Add contact</Button>
        </Stack>
        <div>
            <ContactsTable query={contactsQuery}/>
        </div>


        {showAddContactModal && <AddNewContactForm close={() => setShowAddContactModal(false)}/>}
        {selectedContactId &&
            <ContactDetailsModal close={() => setSelectedContactId(null)} contactId={selectedContactId}/>}
    </>

}