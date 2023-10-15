import {SanityElement} from "./SanityElement";
import {Name} from "../Utility/Name";
import {MainSingleton} from "../MainSingleton";
import {VISIBILITY_RX} from "./SanityRegExpressions";

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
        if (VISIBILITY_RX.test(stringValue))
        {
            this.visibility = stringValue[0];
            nameStart = 1;
        }
        const colonIndex = stringValue.indexOf(':');
        if (colonIndex === -1)
        {
            this.name = stringValue.substring(nameStart).trim();
            this.type = '';
            return;
        }
        this.name = stringValue.substring(nameStart, colonIndex).trim();
        this.type = stringValue.substring(colonIndex).replace(':', '').trim();

        this.elementValue = this.visibility + this.name
            + (this.elementValue.indexOf(':') !== -1 ? ': ' : '') + this.type;
    }

    draw(context, view)
    {
        const temp = this.elementValue;
        const showVisibility = MainSingleton.singleton.options.showVisibility;
        this.elementValue = (showVisibility ? this.visibility : '') + this.name
            + (this.elementValue.indexOf(':') !== -1 ? ': ' : '') + this.type;

        // Uncomment when SanityElement draw function is added
        // super.draw(context, view);

        this.elementValue = temp;
    }


    processSanityCheck() {
        const messages = Name.Check(this.name);

        for (const message of Name.Check(this.type))
        {
            messages.push(message.replace("Name", "Type"));
        }

        const showVisibility = MainSingleton.singleton.options.showVisibility;
        if (this.visibility === '' && showVisibility) {
            messages.push(
                `Attribute <a>${this.elementValue.replaceAll(' ', '_')}</a>: visibility missing`);
        }
        if (this.name === '')
            messages.push(
                `Attribute <a>${this.elementValue.replaceAll(' ', '_')}</a>: name missing`);
        if (this.type === '')
            messages.push(
                `Attribute <a>${this.elementValue.replaceAll(' ', '_')}</a>: type missing`);

        return messages;
    }
}