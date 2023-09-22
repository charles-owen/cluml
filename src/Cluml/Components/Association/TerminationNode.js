import {LineNode} from "./LineNode.js"
import {PaletteImage} from "../../Graphics/PaletteImage";
import Selectable from "../../Selectable";
import {Class} from "../Class";

/**
 * Determines how far away to snap nodes to classes.
 * @type {number}
 */
export const NODE_CLASS_SNAP_DIST = 25;

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

    /**
     * The T value. This determines on where and on which side of "attachedTo"
     * this node is attached to. Starting from the upper left corner:
     *
     * [0-1) Node is on the top side. Decimal portion represents where along
     * the side is node is attached to, going from left = 0 to right = 1.
     *
     * [1-2) Node is on the right side. Decimal portion represents where along
     * the side is node is attached to, going from top = 1 to bottom = 2.
     *
     * [2-3) Node is on the bottom side. Decimal portion represents where
     * along the side is node is attached to, going from right = 2 to
     * left = 3.
     *
     * [3-4) Node is on the left side. Decimal portion represents where along
     * the side is node is attached to, going from bottom = 3 to top = 4.
     *
     * @type {number}
     */
    this.side = 0;
    //endregion

    //endregion
}

TerminationNode.prototype = Object.create(LineNode.prototype);
TerminationNode.prototype.constructor = TerminationNode;


TerminationNode.prototype.fileLbl = "TerminationNode";
TerminationNode.prototype.helpLbl = 'terminationNode';
TerminationNode.prototype.paletteLbl = "Termination Node";
TerminationNode.prototype.paletteDesc = "The start and end nodes for an association.";
TerminationNode.prototype.htmlDesc = '<h2>Termination Node</h2><p>The start and end nodes for an association.</p>';
TerminationNode.prototype.paletteOrder = -1;

//region Selectable/Component Methods
/**
 * draw the association to the palette
 * @return {PaletteImage}
 */
TerminationNode.prototype.paletteImage = function () {
    let size = 16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height

    const pi = new PaletteImage(width, height);
    pi.drawLine(10, 20, 50, 20);
    return pi;
}

TerminationNode.prototype.drop = function () {
    // Do not replace with LineNode.prototype.drop. That would destroy
    // the end nodes (bad).
    Selectable.prototype.drop.call(this);

    // Determine if we are near a class. For now, just go
    // through every class.
    const classes = this.diagram.getComponentsByType("Class");

    for (const cl of classes) {
        if (this.tryAttachToClass(cl))
            break;
    }
}
//endregion

// region TerminationNode Specific Methods
/**
 * Tries to attach the termination node to the specified class,
 * if the class is close enough.
 * @param attachTo {Class}
 * @return {Boolean}
 */
TerminationNode.prototype.tryAttachToClass = function (attachTo) {
    const clBounds = attachTo.bounds();
    const someGoodTea = clBounds.getClosestSideT(this.position);

    if (attachTo.bounds().contains(this.x, this.y) ||
        someGoodTea.distance < NODE_CLASS_SNAP_DIST) {

        // Actually attach the class.
        this.attachedTo = attachTo;
        this.position = someGoodTea.atPoint;
        this.side = someGoodTea.side;

        return true;
    }

    return false;
}
// endregion
