import {SanityElement} from "./SanityElement";
import {MainSingleton} from "../MainSingleton";

export const VISIBILITY_RX = /^[+#-]/g
export const NAME_RX = /\w+(?=\()/g
export const PAREM_RX = /\(.*\)/g
export const ARG_RX = /(\w+)( *: *)(\w+)/g

export class Operation extends SanityElement {
    constructor(stringValue, relativeTo) {
        super(stringValue, relativeTo);
        this.processSanityCheck();
    }

    bounds() {
        // Trust me, this is a class.
        return this.relativeTo.boundsOfOperation(this);
    }

    draw(context, view)
    {
        const temp = this.elementValue;
        const vMatch = this.elementValue.match(VISIBILITY_RX);
        const what = MainSingleton.singleton.options;
        if(!what.showVisibility && vMatch !== null && vMatch.length > 0)
        {
            this.elementValue = this.elementValue.replace(vMatch[0], '');
        }
        super.draw(context, view);
        this.elementValue = temp;
    }

    processSanityCheck() {
        const messages = super.processSanityCheck();
        const prefixMatch = /\w+/g.exec(this.elementValue);
        const prefixTitle = prefixMatch !== null ? prefixMatch[0] : this.elementValue;
        const prefix = `Operation <a>${prefixTitle}</a>: `;

        const vMatch = this.elementValue.match(VISIBILITY_RX);
        if (vMatch === null || vMatch.length < 1) {
            messages.push(prefix + 'missing visibility.');
        } else {
            this.visibility = vMatch[0];
        }

        const nameMatch = this.elementValue.match(NAME_RX);
        let nameFound = false;
        if (nameMatch === null || nameMatch.length < 1) {
            messages.push(prefix + 'name missing or malformed.');
        } else {
            this.name = nameMatch[0];
            nameFound = true;
        }

        const paramMatch = this.elementValue.match(PAREM_RX);
        if (paramMatch === null || paramMatch.length !== 1) {
            messages.push(prefix + 'parentheses missing or deformed.');
        } else {
            if (nameFound) {
                // See if the name and parenthesis exists next ot each other.
                const nameParamRX = new RegExp(this.name + PAREM_RX.source, 'g');

                if (!nameParamRX.test(this.elementValue)) {
                    const npWhitespaceRX = new RegExp(this.name + '\s+' + PAREM_RX.source, 'g');
                    if (npWhitespaceRX.test(this.elementValue)) {
                        // There's a space between the name and parenthesis.
                        messages.push(prefix + 'has whitespace between name and parenthesis.');
                    } else {
                        // Some other error.
                        messages.push(prefix + 'parenthesis malformed.');
                    }
                }

                const args = paramMatch[0].matchAll(ARG_RX);
            }
        }

        return messages;
    }
}
