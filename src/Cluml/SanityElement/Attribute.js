import {SanityElement} from "./SanityElement";
import {Name} from "../Utility/Name";

const spaces = /\s/;
const nonAlphanumeric = /[^A-Za-z0-9]/;

/**
 * Sanity element for properties
 */
export class Attribute extends SanityElement {
    parent;
    visibility = '-';
    name = "attribute";
    type = "Int";

    constructor(stringValue) {
        super(stringValue);

        // process the string value;
        let nameStart = 0;
        if (/[+#\-]/.test(stringValue[0]))
        {
            this.visibility = stringValue[0];
            nameStart = 1;
        }
        const colonIndex = stringValue.indexOf(':');
        if (colonIndex === -1)
        {
            this.name = stringValue.substring(nameStart).trim();
            this.type = '';
            return;
        }
        this.name = stringValue.substring(nameStart, colonIndex).trim();
        this.type = stringValue.substring(colonIndex).replace(':', '').trim();
    }

    processSanityCheck() {
        const messages = Name.Check(this.name);

        for (const message of Name.Check(this.type))
        {
            message.replace("Name", "Type");
            messages.push(message);
        }

        return messages;
    }


}