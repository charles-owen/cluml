import {LineNode} from "./LineNode.js"

export const TerminationNode = function() {
    LineNode.call(this);

    //region Fields
    /**
     * The multiplicity value.
     * @type {Multiplicity}
     */
    this.multiplicityValue = null;

    /**
     * The attribute label.
     * @type {AttrLabel}
     */
    this.labelValue = null;

    /**
     * The class this is attached to.
     * @type {Class}
     */
    this.attachedTo = null;
    //endregion

    //endregion
}