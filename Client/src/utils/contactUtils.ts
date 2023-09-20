import {Contact} from "../Api.ts";

export function formatContactFullName(contact: Contact, shortMiddleName = true) {
    return [contact.firstName, (shortMiddleName ? contact.middleName[0] ?? "" : contact.middleName), contact.lastName]
        .filter(token => token.length > 0).join(" ");
}