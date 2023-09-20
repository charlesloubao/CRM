import {Contact} from "../Api.ts";
import {formatContactFullName} from "../utils/contactUtils.ts";

const avatarSizes = {
    "small": {size: 42, textSize: 15},
    "medium": {size: 72, textSize: 24},
}

export interface ContactAvatarProps {
    size?: "small" | "medium",
    variant?: "square" | "circle"
    contact: Contact,
}

export function ContactAvatar({contact, size, variant}: ContactAvatarProps) {
    const avatarSize = avatarSizes[size ?? "small"]
    return <div style={{width: avatarSize.size, height: avatarSize.size, fontSize: avatarSize.textSize}}
                className={`fw-semibold ${(variant ?? "circle") === 'circle' ? 'rounded-circle' : 'rounded'} text-uppercase text-bg-primary d-flex align-items-center justify-content-center`}>
        {formatContactFullName(contact).substring(0, 2)}
    </div>;
}