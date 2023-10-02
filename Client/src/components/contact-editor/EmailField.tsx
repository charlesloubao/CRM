import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {ContactDTO, EmailAddressType} from "../../Api.ts";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import axios from "axios";
import {Button, Form, Stack} from "react-bootstrap";
import update from "immutability-helper";
import {TrashIcon} from "@heroicons/react/24/outline";

export function EmailField({array, index}: {
    index: number,
    array: UseFieldArrayReturn<ContactDTO, "emailAddresses", "id">
}) {
    const form = useFormContext<ContactDTO>()
    const {orgId} = useParams()

    const toDelete = form.watch("emailAddressesToDelete")
    const value = form.watch(`emailAddresses.${index}`)

    const emailAddressTypes = useQuery([orgId, "emailAddressTypes"],
        () => axios.get<EmailAddressType[]>(`/api/organizations/${orgId}/emailAddressTypes`)
            .then(response => response.data))

    return <Stack direction={"horizontal"} gap={2}>
        <Form.Group className={"flex-grow-1"} controlId={"emailAddress"}>
            <Form.Label>Email Address</Form.Label>
            <Form.Control {...form.register(`emailAddresses.${index}.value`)} type="email"
                          placeholder={"johm@acme.com"}/>
        </Form.Group>

        <Form.Group controlId={"emailAddressType"}>
            <Form.Label>Type</Form.Label>
            <Form.Select {...form.register(`emailAddresses.${index}.emailAddressTypeId`)} aria-label="Type">
                <option value={""} disabled={true}>Pick one</option>
                {emailAddressTypes.data?.map(value => (
                    <option key={value.emailAddressTypeId}
                            value={value.emailAddressTypeId}>{value.name}</option>
                ))}
            </Form.Select>
        </Form.Group>
        <Button onClick={() => {
            if (value.emailAddressId) {
                form.setValue("emailAddressesToDelete", update(toDelete, {
                    $push: [value.emailAddressId]
                }))
            }
            array.remove(index)
        }} type={"button"} variant={"danger"} className={"align-self-end"}>
            <TrashIcon color={"white"} width={12} height={12}/>
        </Button>
    </Stack>;
}