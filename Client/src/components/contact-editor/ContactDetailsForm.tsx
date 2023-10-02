import {Button, Col, Form, Row} from "react-bootstrap";
import {ContactDTO} from "../../Api.ts";
import {useFieldArray, useFormContext} from "react-hook-form";
import {PhoneNumberField} from "./PhoneNumberField.tsx";
import {EmailField} from "./EmailField.tsx";


export default function ContactDetailsForm() {
    const form = useFormContext<ContactDTO>()
    const phoneNumbersFieldArray = useFieldArray({control: form.control, name: "phoneNumbers"})
    const emailAddressesFieldArray = useFieldArray({control: form.control, name: "emailAddresses"})
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
        <div className={"mb-3"}>
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
        </div>
        <div>
            <h2>Email Addresses</h2>
            {emailAddressesFieldArray.fields.map((value, index) => (
                <EmailField key={value.id} array={emailAddressesFieldArray} index={index}/>
            ))}
            <Button onClick={() => {
                emailAddressesFieldArray.append({
                    value: "",
                    emailAddressTypeId: "",
                })
            }} variant={"secondary"} size={"sm"}>Add another</Button>
        </div>
        <Row>
            <Form.Group controlId={"notes"}>
                <Form.Label>Notes</Form.Label>
                <textarea className={"form-control"} {...form.register("notes")} placeholder={"Notes"}/>
            </Form.Group>
        </Row>
    </div>

}