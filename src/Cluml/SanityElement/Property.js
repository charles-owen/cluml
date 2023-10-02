import {SanityElement} from "./SanityElement";
import {Name} from "../Utility/Name";

const spaces = /\s/;
const nonAlphanumeric = /[^A-Za-z0-9]/;

/**
 * Sanity element for properties
 */
export class Property extends SanityElement {
    parent;
    visibility = '-';
    name = "attribute";
    type = "String";

    /**
     *
     * @param visibility {String} visibility of the property {private(-), protected(#), public(+)}
     * @param name {String} name of the property
     * @param type {String} type/return type of the property
     */
    constructor(visibility='-', name='attribute', type='') {
        super('');
        this.parent = parent;
        this.visibility = visibility;
        this.name = name;
        this.type = type;
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