import {SanityElement} from "./SanityElement";
import {VISIBILITY_RX, NAME_RX, PAREM_RX} from "./SanityRegExpressions";
import {Name} from "../Utility/Name";
import {MainSingleton} from "../MainSingleton";

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


        // reformat the string
        this.elementValue = this.visibility + this.name + (parenStart !== -1 ? '(' : '');
        for (let i = 0; i < this.parameters.length; i++)
        {
            const param = this.parameters[i];
            const paramText = param[0] + (param[1] !== '' ? ':' : '') + param[1]
                                       + (i < this.parameters - 1 ? ", " : "");
            this.elementValue += paramText;
        }
        this.elementValue += (parenEnd !== -1 ? ")" : "") + (this.type !== '' ? ": " : "") + this.type;

        this.processSanityCheck();
    }

    processSanityCheck() {
        let messages = Name.Check(this.name);

        for (const message of Name.Check(this.type))
        {
            messages.push(message.replace("Name", "Type"));
        }

        const showVisibility = MainSingleton.singleton.options.showVisibility;
        if (this.visibility === '' && showVisibility) {
            messages.push(
                `Operation <a>${this.elementValue}</a>: visibility missing`);
        }
        if (this.name === '')
            messages.push(
                `Operation <a>${this.elementValue}</a>: name missing`);
        if (this.type === '')
            messages.push(
                `Operation <a>${this.elementValue}</a>: type missing`);

        const paramMessages = this.#checkParameters();
        messages = messages.concat(paramMessages);

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

    /**
     * Sanity checks the parameters
     */
    #checkParameters()
    {
        let messages = [];

        for (const param of this.parameters)
        {
            const name = param[0];
            const type = param[1];
            if (name === '')
                messages.push(`Operation <a>${this.elementValue}</a>: parameter name missing`);
            if (type === '')
                messages.push(`Operation <a>${this.elementValue}</a>: parameter type missing`);

            for (const message of Name.Check(name))
            {
                messages.push(message.replace("Name", "Parameter name"));
            }
            for (const message of Name.Check(type))
            {
                messages.push(message.replace("Name", "Parameter type"));
            }
        }

        return messages;
    }

}
