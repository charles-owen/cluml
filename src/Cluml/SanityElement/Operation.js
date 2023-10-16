import {SanityElement} from "./SanityElement";
import {VISIBILITY_RX, NAME_RX, PAREM_RX} from "./SanityRegExpressions";

export class Operation extends SanityElement {
    visibility = '';
    name = "";
    parameters = "";
    type = "";

    constructor(stringValue) {
        stringValue = stringValue.trim();
        super(stringValue);

        // variables to keep track of certain indices
        let nameStart = 0;
        let parenStart = -1;
        let parenEnd = -1;
        let colonIndex = -1;

        if (VISIBILITY_RX.test(stringValue)) {
            this.visibility = stringValue[0];
            nameStart = 1;
        }
        parenStart = stringValue.indexOf('(');

        this.name = stringValue.substring(nameStart, parenStart !== -1 ? parenStart : stringValue.length).trim();

        // add to parameters only if an open parenthesis exists
        if (parenStart !== -1) {
            parenEnd = stringValue.indexOf(')', parenStart);
            this.parameters = stringValue.substring(parenStart + 1, parenEnd !== -1 ? parenEnd : stringValue.length);
            this.#processParameters();
        }

        // set the type only if a close parenthesis exists
        if (parenEnd !== -1) {
            colonIndex = stringValue.indexOf(':', parenEnd);
            this.type = colonIndex !== -1 ? stringValue.substring(colonIndex + 1).trim()
                                          : stringValue.substring(parenEnd + 1).trim();
        }

        this.processSanityCheck();
    }

    processSanityCheck() {
        const messages = super.processSanityCheck();

        const vMatch = this.elementValue.match(VISIBILITY_RX);
        if (vMatch === null || vMatch.length < 1) {
            messages.push('Operation missing visibility.');
        } else {
            this.visibility = vMatch[0];
        }

        const nameMatch = this.elementValue.match(NAME_RX);
        let nameFound = false;
        if (nameMatch === null || nameMatch.length < 1) {
            messages.push('Operation name missing or malformed.');
        } else {
            this.name = nameMatch[0];
            nameFound = true;
        }

        const paramMatch = this.elementValue.match(PAREM_RX);
        if (paramMatch === null || paramMatch.length < 1) {
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

    /**
     * Converts the parameters from a string into an array of tuples (name, type)
     */
    #processParameters()
    {
        // split the parameters and trim them
        this.parameters = this.parameters.trim().split(',').map((value) => value.trim());

        // remove empty parameters
        this.parameters = this.parameters.filter((value) => value !== '');

        for (let i = 0; i < this.parameters.length; i++) {
            const param = this.parameters[i];
            let parameterFinal = ["", ""];
            const colonIndex = param.indexOf(':');
            parameterFinal[0] = param.substring(0, colonIndex !== -1 ? colonIndex : param.length).trim();
            parameterFinal[1] = colonIndex !== -1 ? param.substring(colonIndex + 1).trim() : "";
            this.parameters[i] = parameterFinal;
        }
    }
}
