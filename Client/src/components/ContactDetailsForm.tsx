import {Col, Form, Row} from "react-bootstrap";
import {ContactDTO} from "../Api.ts";
import {useFormContext} from "react-hook-form";

export default function ContactDetailsForm() {
    const form = useFormContext<ContactDTO>()

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
            <Form.Group controlId={"notes"}>
                <Form.Label>Notes</Form.Label>
                <textarea className={"form-control"} {...form.register("notes")} placeholder={"Notes"}/>
            </Form.Group>
        </Row>
    </div>

}