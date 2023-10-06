import {SanityElement} from "./SanityElement";

const spaces = /\s/;
const nonAlphanumeric = /[^A-Za-z0-9]/;

// Sanity element for class names
export class ClassName extends SanityElement {

    /**
     * Creates a new class name from the provided string.
     * @param stringValue {string} The string value.
     * @param relativeTo
     */
    constructor(stringValue, relativeTo) {
        super(stringValue, relativeTo);

        // Run the sanity check to update the multiplicity types.
        //this.processSanityCheck();
    }

    bounds() {
        return this.relativeTo.nameBounds;
    }

    processSanityCheck() {
        const errors = [];
        const messageTemplate = `Class <a>${this.elementValue}</a>: name `;

        if (this.elementValue[0].toUpperCase() !== this.elementValue[0]) {
            errors.push(messageTemplate + "not capitalized.");
        }
        if (spaces.test(this.elementValue)) {
            errors.push(messageTemplate + "contains spaces.")
        }
        if (nonAlphanumeric.test(this.elementValue)) {
            errors.push(messageTemplate + "contains non-alphanumeric characters.");
        }

        return errors;
    }
}
