import { SanityElement } from "./SanityElement";
import { SPACES_RX, NON_ALPHANUMERIC_RX, NON_ALPHABETICAL_RX} from "../Utility/Name";

const LOWERCASE_RX = /[a-z]/;

export class TNodeTag extends SanityElement {

    constructor(stringValue) {
        super(stringValue);
    }

    processSanityCheck() {
        // Checks go here.
        const errors =  super.processSanityCheck();

        if (SPACES_RX.test(this.elementValue))
        {
            errors.push(`Role <a>${this.elementValue}</a> contains spaces`);
        }
        if (NON_ALPHANUMERIC_RX.test(this.elementValue))
        {
            errors.push(`Role <a>${this.elementValue}</a> contains non-alphanumeric characters`);
        }
        if (this.elementValue.length > 0)
        {
            const lowerCase = this.elementValue[0].match(LOWERCASE_RX);
            if (lowerCase === null || lowerCase.length === 0)
                errors.push(`Role <a>${this.elementValue}</a> is not in the camelCase format`);
        }
        return errors;
    }
}
