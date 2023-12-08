import {SanityElement} from "./SanityElement";
import {SPACES_RX, NON_ALPHANUMERIC_RX, NON_ALPHABETICAL_RX} from "./SanityRegExpressions";
import {SanityErrorInfo} from "./SanityErrorInfo";

// Sanity element for class names
export class ClassName extends SanityElement {

    // template for class name error messages. Gets set in constructor.
    messageTemplate = '';

    /**
     * Creates a new class name from the provided string.
     * @param stringValue {string} The string value.
     */

    constructor(stringValue) {
        stringValue = stringValue.trim();
        super(stringValue);
        this.messageTemplate = `Class <a>${stringValue}</a>: name `;

        // Run the sanity check to update the multiplicity types.
        //this.processSanityCheck();
    }

    processSanityCheck() {
        const errors = [];
        if (this.elementValue === '') {
            errors.push(new SanityErrorInfo("0400", "Class",
                this.elementValue, "Name is missing"));
            return errors;
        }
        if (NON_ALPHABETICAL_RX.test(this.elementValue[0])) {
            errors.push(new SanityErrorInfo("0401", "Class",
                this.elementValue, "Name's first character is not alphabetical"));
        }
        else if (this.elementValue[0].toUpperCase() !== this.elementValue[0]) {
            errors.push(new SanityErrorInfo("0402", "Class",
                this.elementValue, "Name not capitalized"));
        }
        if (SPACES_RX.test(this.elementValue)) {
            errors.push(new SanityErrorInfo("0403", "Class",
                this.elementValue, "Name contains spaces"));
        }
        if (NON_ALPHANUMERIC_RX.test(this.elementValue)) {
            errors.push(new SanityErrorInfo("0404", "Class",
                this.elementValue, "Name contains non-alphanumeric characters"));
        }

        return errors;
    }
}
