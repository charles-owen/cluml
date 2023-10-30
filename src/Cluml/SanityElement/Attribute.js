import {SanityElement} from "./SanityElement";
import {Name} from "../Utility/Name";
import {MainSingleton} from "../MainSingleton";
import {VISIBILITY_RX} from "./SanityRegExpressions";
import {SanityErrorInfo} from "./SanityErrorInfo";

const spaces = /\s/;
const nonAlphanumeric = /[^A-Za-z0-9]/;

/**
 * Sanity element for properties
 */
export class Attribute extends SanityElement {
    parent;
    visibility = '';
    name = "";
    type = "";

    constructor(stringValue) {
        stringValue = stringValue.trim();
        super(stringValue);

        // process the string value;
        let nameStart = 0;
        if (VISIBILITY_RX.test(stringValue)) {
            this.visibility = stringValue[0];
            nameStart = 1;
        }
        const colonIndex = stringValue.indexOf(':');
        if (colonIndex === -1) {
            this.name = stringValue.substring(nameStart).trim();
            this.type = '';
            return;
        }
        this.name = stringValue.substring(nameStart, colonIndex).trim();
        this.type = stringValue.substring(colonIndex).replace(':', '').trim();

        this.#reconstructString();
    }

    /**
     * Reconstructs the element value with the given visibility, name, and type
     */
    #reconstructString() {
        this.elementValue = this.visibility + this.name
            + (this.elementValue.indexOf(':') !== -1 ? ': ' : '') + this.type;
    }

    /**
     * Sets the attribute's visibility
     * @param visibility the new visibility
     */
    setVisibility(visibility) {
        if (!/^[+#-]$/.test(visibility))
            return;
        this.visibility = visibility;
        this.#reconstructString();
    }

    processSanityCheck() {
        let messages = Name.Check(100, "Attribute",
            this.elementValue, this.name, "Name");

        messages = messages.concat(Name.Check(104, "Attribute",
            this.elementValue, this.type, "Type", true));

        const showVisibility = MainSingleton.singleton.options.showVisibility;
        if (this.visibility === '' && showVisibility) {
            messages.push(new SanityErrorInfo("00108", "Attribute",
                this.elementValue, "Visibility missing"));
        }
        if (this.name === '')
            messages.push(new SanityErrorInfo("0109", "Attribute",
                this.elementValue, "Name missing"));
        if (this.type === '')
            messages.push(new SanityErrorInfo("0110", "Attribute",
                this.elementValue, "Type missing"));

        return messages;
    }

    /**
     * Copy any attribute data needed for undo
     * @param attribute to copy data from
     */
    copyFrom(attribute)
    {
        this.visibility = attribute.visibility;
        this.name = attribute.name;
        this.type = attribute.type;
        this.elementValue = attribute.elementValue;
    }

    /**
     * Gets an object that contains the serializable data of the sanity element.
     * @returns {{value: string, x: number, y: number}}
     */
    saveSanityElement() {
        return {
            value: this.elementValue,
            x: this.x,
            y: this.y,
            visibility: this.visibility
        };
    }
}