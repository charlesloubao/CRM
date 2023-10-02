import {UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {ContactDTO, PhoneNumberType} from "../../Api.ts";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import axios from "axios";
import {Button, Form, Stack} from "react-bootstrap";
import update from "immutability-helper";
import {TrashIcon} from "@heroicons/react/24/outline";

export function PhoneNumberField({array, index}: {
    index: number,
    array: UseFieldArrayReturn<ContactDTO, "phoneNumbers", "id">
}) {
    const form = useFormContext<ContactDTO>()
    const {orgId} = useParams()

    const toDelete = form.watch("phoneNumbersToDelete")
    const value = form.watch(`phoneNumbers.${index}`)

    const phoneNumberTypes = useQuery([orgId, "phoneNumberTypes"],
        () => axios.get<PhoneNumberType[]>(`/api/organizations/${orgId}/phoneNumberTypes`)
            .then(response => response.data))

    return <Stack direction={"horizontal"} gap={2}>
        <Form.Group className={"flex-grow-1"} controlId={"phoneNumber"}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control {...form.register(`phoneNumbers.${index}.value`)} type="text"
                          placeholder={"+1 123 456 7890"}/>
        </Form.Group>

        <Form.Group controlId={"phoneNumberType"}>
            <Form.Label>Type</Form.Label>
            <Form.Select {...form.register(`phoneNumbers.${index}.phoneNumberTypeId`)} aria-label="Type">
                <option value={""} disabled={true}>Pick one</option>
                {phoneNumberTypes.data?.map(value => (
                    <option key={value.phoneNumberTypeId}
                            value={value.phoneNumberTypeId}>{value.name}</option>
                ))}
            </Form.Select>
        </Form.Group>
        <Button onClick={() => {
            if (value.phoneNumberId) {
                form.setValue("phoneNumbersToDelete", update(toDelete, {
                    $push: [value.phoneNumberId]
                }))
            }
            array.remove(index)
        }} type={"button"} variant={"danger"} className={"align-self-end"}>
            <TrashIcon color={"white"} width={12} height={12}/>
        </Button>
    </Stack>;
}