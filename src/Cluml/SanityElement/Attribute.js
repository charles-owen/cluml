import {SanityElement} from "./SanityElement";
import {ARG_RX, PAREM_RX, VISIBILITY_RX} from "./Operation";

export const NAME_RX = /([-+#])(\w+)/g

export class Attribute extends SanityElement {
    constructor(stringValue, relativeTo) {
        super(stringValue, relativeTo);
        this.processSanityCheck();
    }

    bounds() {
        // Trust me, this is a class.
        return this.relativeTo.boundsOfAttribute(this);
    }

    processSanityCheck() {
        const messages = super.processSanityCheck();

        const vMatch = this.elementValue.match(VISIBILITY_RX);
        if (vMatch !== null && vMatch.length < 1) {
            messages.push('Attribute missing visibility.');
        } else {
            this.visibility = vMatch[0];
        }

        const nameMatch = NAME_RX.exec(this.elementValue);
        NAME_RX.lastIndex = 0;
        let nameFound = false;
        if (nameMatch !== null && nameMatch.length !== 3) {
            messages.push('Attribute name missing or malformed.');
        } else {
            this.name = nameMatch[2];
            nameFound = true;
        }

        return messages;
    }
}
