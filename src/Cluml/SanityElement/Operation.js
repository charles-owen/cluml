import {Property} from "./Property";
import {SanityElement} from "./SanityElement";

const VISIBILITY_RX = /^[+#-]/g
const NAME_RX = /\w+(?=\()/g
const PAREM_RX = /\(.*\)/g

export class Operation extends SanityElement {
    constructor(stringValue) {
        super(stringValue);
        this.processSanityCheck();
    }

    processSanityCheck() {
        const messages = super.processSanityCheck();

        const vMatch = this.elementValue.match(VISIBILITY_RX);
        if (vMatch.length < 1) {
            messages.push('Operation missing visibility.');
        } else {
            this.visibility = vMatch[0];
        }

        const nameMatch = this.elementValue.match(NAME_RX);
        let nameFound = false;
        if (nameMatch.length < 1) {
            messages.push('Operation name missing or malformed.');
        } else {
            this.name = nameMatch[0];
            nameFound = true;
        }

        const paramMatch = this.elementValue.match(PAREM_RX);
        if (paramMatch.length < 1) {
            messages.push('Operation parentheses missing or deformed.');
        } else if (paramMatch.length > 1) {
            messages.push('Operation has too many parentheses.')
        } else {
            if (nameFound) {
                // See if the name and parenthesis exists next ot each other.
                const nameParamRX = new RegExp(this.name + PAREM_RX.source, 'g');

                if (!nameParamRX.test(this.elementValue)) {
                    const npWhitespaceRX = new RegExp(this.name + '\s+' + PAREM_RX.source, 'g');
                    if (npWhitespaceRX.test(this.elementValue)) {
                        // There's a space between the name and parenthesis.
                        messages.push('Operation has whitespace between name and parenthesis.');
                    } else {
                        // Some other error.
                        messages.push('Operation parenthesis malformed.');
                    }
                }
            }
        }

        return messages;
    }
}
