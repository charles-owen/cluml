import {SanityElement} from "./SanityElement";

const spaces = /\s/;
const nonAlphanumeric = /[^A-Za-z0-9]/;

// Sanity element for class names
export class ClassName extends SanityElement {

    // template for class name error messages. Gets set in constructor.
    messageTemplate = '';

    /**
     * Creates a new class name from the provided string.
     * @param stringValue {string} The string value.
     */

    constructor(stringValue) {
        super(stringValue);
        this.messageTemplate = `Class '${stringValue}': name `;

        // Run the sanity check to update the multiplicity types.
        //this.processSanityCheck();
    }

    processSanityCheck() {
        const messages = [];
        if (this.elementValue[0].toUpperCase() !== this.elementValue[0]) {
            messages.push(this.messageTemplate + "not capitalized.");
        }
        if (spaces.test(this.elementValue)) {
            messages.push(this.messageTemplate + "contains spaces.")
        }
        if (nonAlphanumeric.test(this.elementValue)) {
            messages.push(this.messageTemplate + "contains non-alphanumeric characters.");
        }

        if (messages.length === 0)
            return "";
        if (messages.length === 1)
            return messages[0];
        return messages;
    }
}