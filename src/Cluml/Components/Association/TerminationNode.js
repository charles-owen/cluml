import {LineNode} from "./LineNode.js"

export class TerminationNode extends LineNode {
    //region Fields
    /**
     * The multiplicity value.
     * @type {Multiplicity}
     */
    multiplicityValue = null;

    /**
     * The attribute label.
     * @type {AttrLabel}
     */
    labelValue = null;

    /**
     * The class this is attached to.
     * @type {Class}
     */
    #attachedTo = null;
    //endregion

    //region Constructors
    constructor() {
        super();
    }

    //endregion

    //region Properties
    /**
     * Returns the class that this is attached to, or null if it is not
     * attached to any class.
     * @return {Class}
     */
    get attachedTo() {
        return this.#attachedTo;
    }

    /**
     * Attaches this node to the specified class.
     * @param value {Class} The specified class.
     */
    set attachedTo(value) {
        this.#attachedTo = value;
    }

    //endregion
}