import {useQueryClient, UseQueryResult} from "react-query";
import {Contact} from "../Api.ts";
import {Button, Table} from "react-bootstrap";
import axios from "axios";
import {Link} from "react-router-dom";
import moment from "moment/moment";

function formatContactFullName(contact: Contact) {
    return [contact.firstName, contact.middleName[0] ?? "", contact.lastName]
        .filter(token => token.length > 0).join(" ");
}

function ContactAvatar({contact}: { contact: Contact }) {
    return <div style={{width: 42, height: 42}}
                className={"rounded-circle text-uppercase text-bg-primary d-flex align-items-center justify-content-center"}>
        {formatContactFullName(contact).substring(0, 2)}
    </div>;
}

function ContactTableRow({contact}: { contact: Contact }) {

    const queryClient = useQueryClient()

    async function deleteContact() {
        const orgId = contact.organizationId
        if (!confirm("Are you sure?")) return
        const success = await axios.delete(`/api/organizations/${contact.organizationId}/contacts/${contact.contactId}`).then(() => true).catch(() => false)

        if (!success) {
            alert("An error occurred")
            return
        }

        queryClient.invalidateQueries(["organizations", orgId, "contacts"])
    }


    return <tr>
        <td className={"align-middle"}>
            <div className={"d-flex align-items-center gap-3"}>
                <Link to={`/app/organizations/${contact.organizationId}/contacts/${contact.contactId}`}>
                    <ContactAvatar contact={contact}/>
                </Link>
                <Link className={"fw-semibold"}
                      to={`/app/organizations/${contact.organizationId}/contacts/${contact.contactId}`}>
                    {formatContactFullName(contact)}
                </Link>
            </div>
        </td>
        <td className={"align-middle"}>{/*TODO: Display email here*/}</td>
        <td className={"align-middle"}>{/*TODO: Display Phone number here*/}</td>
        <td className={"align-middle"}>{/*TODO: Display Company here*/}</td>
        <td className={"align-middle"}>{moment(contact.createdAt).format("MM/DD/YYYY hh:mm A")}</td>
        <td className={"align-middle text-end"}>
            <Button onClick={deleteContact} size={"sm"} variant={"danger"}>Delete</Button>
        </td>
    </tr>;
}

export function ContactsTable({query}: {
    query: UseQueryResult<Contact[]>
}) {
    const contacts = query.data!

    if (query.isLoading) {
        return <div>Loading...</div>
    } else if (query.isError) {
        return <div>An error occurred</div>
    } else if (contacts.length === 0) {
        return <div>No contacts</div>
    }
    return <div>
        <Table responsive>
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Company</th>
                <th>Added on</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {contacts.map(contact => (
                <ContactTableRow key={contact.contactId} contact={contact}/>
            ))}
            </tbody>
        </Table>
    </div>;
}