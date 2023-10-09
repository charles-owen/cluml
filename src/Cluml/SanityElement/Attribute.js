import {SanityElement} from "./SanityElement";
import {ARG_RX, PAREM_RX, VISIBILITY_RX} from "./Operation";
import {MainSingleton} from "../MainSingleton";

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

    draw(context, view){
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
        const prefix = `Attribute <a>${prefixTitle}</a>: `;

        const vMatch = this.elementValue.match(VISIBILITY_RX);
        let nameMatch;
        if (vMatch === null || vMatch.length < 1) {
            messages.push(prefix + 'missing visibility.');
            nameMatch = /\w+/g.exec(this.elementValue);
        } else {
            this.visibility = vMatch[0];
            nameMatch = NAME_RX.exec(this.elementValue);
            NAME_RX.lastIndex = 0;
        }

        let nameFound = false;
        if (nameMatch === null || nameMatch.length !== 3) {
            messages.push(prefix + 'name missing or malformed.');
        } else {
            this.name = nameMatch[2];
            nameFound = true;
        }

        return messages;
    }
}
