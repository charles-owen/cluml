import {SanityElement} from "./SanityElement";
import {VISIBILITY_RX, NAME_RX, PAREM_RX} from "./SanityRegExpressions";
import {Name} from "../Utility/Name";
import {MainSingleton} from "../MainSingleton";
import {SanityErrorInfo} from "./SanityErrorInfo";
import {Class} from "../Components/Class";

export class Operation extends SanityElement {
    visibility = '';
    name = "";
    parameters = "";
    type = "";
    abstract = false;

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

        this.#reconstructString();
    }

    /**
     * Reconstructs the element value with the visibility, name, parameters, and type
     */
    #reconstructString() {
        let parenStart = parenStart = this.elementValue.indexOf('(');
        let parenEnd = parenStart !== -1 ? this.elementValue.indexOf(')', parenStart) : -1;

        this.elementValue = this.visibility + this.name + (parenStart !== -1 ? '(' : '');
        for (let i = 0; i < this.parameters.length; i++)
        {
            const param = this.parameters[i];
            const paramText = param[0] + (param[1] !== '' ? ': ' : '') + param[1]
                + (param.length > 2 ? ` = ${param[2]}` : '')
                + (i < this.parameters.length - 1 ? ", " : "");
            this.elementValue += paramText;
        }
        this.elementValue += (parenEnd !== -1 ? ")" : "") + (this.type !== '' ? ": " : "") + this.type;
    }

    /**
     * Sets the operation's visibility
     * @param visibility the new visibility
     */
    setVisibility(visibility) {
        if (!/^[+#-]$/.test(visibility))
            return;
        this.visibility = visibility;
        this.#reconstructString();
    }

    processSanityCheck() {
        let messages = Name.Check(200, "Operation",
            this.elementValue, this.name, "Name", true);

        messages = messages.concat(Name.Check(204, "Operation",
            this.elementValue, this.type, "Type"));

        const showVisibility = Class.prototype.showVisibility;
        if (this.visibility === '' && showVisibility) {
            messages.push(new SanityErrorInfo('0208',
                "Operation", this.elementValue, "Visibility missing"));
        }
        if (this.name === '') {
            messages.push(new SanityErrorInfo("0209",
                "Operation", this.elementValue, "Name missing"));
        }

        if (this.elementValue.indexOf(')', this.elementValue.indexOf('(')) === -1) {
            messages.push(new SanityErrorInfo("0210", "Operation",
                this.elementValue, "Closed parenthesis missing"));
        }

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
            if (colonIndex === -1) {
                parameterFinal[0] = param.substring(0).trim();
                this.parameters[i] = parameterFinal;
                continue;
            }
            parameterFinal[0] = param.substring(0, colonIndex).trim();

            // check for default values
            const equalIndex = param.indexOf('=', colonIndex);
            if (equalIndex === -1) {
                parameterFinal[1] = param.substring(colonIndex + 1).trim();
                this.parameters[i] = parameterFinal;
                continue;
            }

            parameterFinal[1] = param.substring(colonIndex + 1, equalIndex).trim();
            const defaultValue = param.substring(equalIndex + 1).trim();
            if (defaultValue !== "") {
                parameterFinal.push(defaultValue);
            }
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
                messages.push(new SanityErrorInfo("0211", "Operation",
                    this.elementValue, "Parameter name missing"));
            if (type === '')
                messages.push(new SanityErrorInfo("0212", "Operation",
                    this.elementValue, "Parameter type missing"));

            messages = messages.concat(Name.Check(213, "Operation",
                this.elementValue, name, "Parameter name", false));

            messages = messages.concat(Name.Check(217, "Operation",
                this.elementValue, type, "Parameter type"));
        }

        return messages;
    }

    /**
     * Copy any operation data needed for undo
     * @param operation to copy
     */
    copyFrom(operation)
    {
        this.abstract = operation.abstract;
        this.visibility = operation.visibility;
        this.name = operation.name;
        this.type = operation.type;
        this.elementValue = operation.elementValue;
    }

    /**
     * Gets an object that contains the serializable data of the sanity element.
     * @returns {{value: string, x: number, y: number}}
     */
    saveSanityElement() {
        return {
            value: this.elementValue,
            x: this.x,
            y: this.y,
            visibility: this.visibility,
            abstract: this.abstract
        };
    }
}
