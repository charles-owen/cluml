import { SanityElement } from "./SanityElement";
import { SPACES_RX, NON_ALPHANUMERIC_RX, NON_ALPHABETICAL_RX} from "../Utility/Name";
import {SanityErrorInfo} from "./SanityErrorInfo";

const LOWERCASE_RX = /[a-z]/;

export class TNodeTag extends SanityElement {

    constructor(stringValue, relativeTo) {
        super(stringValue, relativeTo);
    }

    processSanityCheck() {
        // Checks go here.
        const errors =  super.processSanityCheck();

        if (SPACES_RX.test(this.elementValue))
        {
            errors.push(new SanityErrorInfo(
                '0001',
                'Role',
                this.elementValue,
                'Element contains spaces.'
            ));
        }
        if (NON_ALPHANUMERIC_RX.test(this.elementValue))
        {
            errors.push(new SanityErrorInfo(
                '0002',
                'Role',
                this.elementValue,
                'Element contains non-alphanumeric characters.'
            ));
        }
        if (this.elementValue.length > 0)
        {
            const lowerCase = this.elementValue[0].match(LOWERCASE_RX);
            if (lowerCase === null || lowerCase.length === 0) {
                errors.push(new SanityErrorInfo(
                    '0003',
                    'Role',
                    this.elementValue,
                    'Element is not in camelCase format.'
                ));
            }
        }
        return errors;
    }
}
