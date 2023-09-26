import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import {ContactDTO, PhoneNumberType} from "../Api.ts";
import {useFieldArray, UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import axios from "axios";
import {TrashIcon} from "@heroicons/react/24/outline";
import update from 'immutability-helper'


function PhoneNumberField({array, index}: {
    index: number,
    array: UseFieldArrayReturn<ContactDTO, "phoneNumbers", "id">
}) {
    const form = useFormContext<ContactDTO>()
    const {orgId} = useParams()

    const toDelete = form.watch("toDelete")
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
                form.setValue("toDelete", update(toDelete, {
                    $push: [value.phoneNumberId]
                }))
            }
            array.remove(index)
        }} type={"button"} variant={"danger"} className={"align-self-end"}>
            <TrashIcon color={"white"} width={12} height={12}/>
        </Button>
    </Stack>;
}

export default function ContactDetailsForm() {
    const form = useFormContext<ContactDTO>()
    const phoneNumbersFieldArray = useFieldArray({control: form.control, name: "phoneNumbers"})
    return <div>

        <Row className={"mb-lg-3"}>
            <Col className={"mb-3 mb-md-0"} md={12} lg={4}>
                <Form.Group controlId={"firstName"}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control {...form.register("firstName")} type="text" placeholder={"First Name"}/>
                </Form.Group>
            </Col>
            <Col className={"mb-3 mb-md-0"} md={12} lg={4}>
                <Form.Group controlId={"middleName"}>
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control {...form.register("middleName")} type="text" placeholder={"Middle Name"}/>
                </Form.Group>
            </Col>
            <Col className={"mb-3 mb-md-0"} md={12} lg={4}>
                <Form.Group controlId={"lastName"}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control {...form.register("lastName")} type="text" placeholder={"Last Name"}/>
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col className={"mb-3"}>
                <h2>Phone Numbers</h2>
                {phoneNumbersFieldArray.fields.map((value, index) => (
                    <PhoneNumberField key={value.id} array={phoneNumbersFieldArray} index={index}/>
                ))}
                <Button onClick={() => {
                    phoneNumbersFieldArray.append({
                        value: "",
                        phoneNumberTypeId: "",
                    })
                }} variant={"secondary"} size={"sm"}>Add another</Button>
            </Col>

        </Row>
        <Row>
            <Form.Group controlId={"notes"}>
                <Form.Label>Notes</Form.Label>
                <textarea className={"form-control"} {...form.register("notes")} placeholder={"Notes"}/>
            </Form.Group>
        </Row>
    </div>

}