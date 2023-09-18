import {ContactDTO} from "../Api.ts";
import {useFormContext} from "react-hook-form";

export default function ContactDetailsForm() {
    const form = useFormContext<ContactDTO>()

    return <div>

        <div>
            <input {...form.register("firstName")} type="text" placeholder={"First Name"}/>
            <input {...form.register("middleName")} type="text" placeholder={"Middle Name"}/>
            <input {...form.register("lastName")} type="text" placeholder={"Last Name"}/>
        </div>
        <div>
            <textarea {...form.register("notes")} placeholder={"Notes"}/>
        </div>
    </div>

}