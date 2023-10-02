import {Property} from "./Property";

export class Operation extends Property {
    parameters = [];

    /**
     *
     * @param parent the class of the operation
     * @param visibility {String} visibility of the operation {private(-), protected(#), public(+)}
     * @param name {String} name of the operation
     * @param type {String} return type
     * @param parameters {Property[]} function parameters
     */
    constructor(parent, visibility, name, type, parameters)
    {
        super(parent, visibility, name, type);
        this.parameters = parameters;
    }

    processSanityCheck() {
        const messages = super.processSanityCheck();

        for (const parameter of this.parameters)
        {
            for (const message of parameter.processSanityCheck())
            {
                messages.push(message);
            }
        }
        return messages;
    }
}