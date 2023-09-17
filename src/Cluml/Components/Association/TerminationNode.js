import {LineNode} from "./LineNode.js"
import {PaletteImage} from "../../Graphics/PaletteImage";
import {Component} from "../../Component";
import {Association} from "./Association";

export const TerminationNode = function () {
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

TerminationNode.prototype = Object.create(LineNode.prototype);
TerminationNode.prototype.constructor = TerminationNode;

//draw the association to the palette
TerminationNode.prototype.paletteImage = function () {
    let size = 16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height

    const pi = new PaletteImage(width, height);
    pi.drawLine(10, 20, 50, 20);
    return pi;
}