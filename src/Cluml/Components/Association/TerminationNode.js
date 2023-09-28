import {LineNode} from "./LineNode.js"
import {PaletteImage} from "../../Graphics/PaletteImage";
import Selectable from "../../Selectable";
import {Class} from "../Class";
import {MainSingleton} from "../../MainSingleton";
import {Multiplicity} from "../../SanityElement/Multiplicity";
import {AttributeDrawer} from "../../Attributes/AttributeDrawer";
import Vector from "../../Utility/Vector";

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
     * @type {AttributeDrawer}
     */
    this.multiplicityValue = new AttributeDrawer(new Multiplicity('1...2'), this);
    this.multiplicityValue.y = 15;

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

//region Selectable Methods
TerminationNode.prototype.drop = function () {
    // Do not replace with LineNode.prototype.drop. That would destroy
    // the end nodes (bad).
    LineNode.prototype.drop.call(this);

    // Determine if we are near a class. For now, just go
    // through every class.
    const classes = MainSingleton.singleton.getCurrentComponentsByType("Class");

    for (const cl of classes) {
        if (this.tryAttachToClass(cl, false))
            break;
    }
}

TerminationNode.prototype.draw = function (context, view) {
    LineNode.prototype.draw.call(this, context, view);

    this.multiplicityValue.draw(context, view);
}
//endregion

// region TerminationNode Specific Methods
/**
 * Tries to attach the termination node to the specified class,
 * if the class is close enough.
 * @param attachTo {Class}
 * @param force {boolean}
 * @return {boolean}
 */
TerminationNode.prototype.tryAttachToClass = function (attachTo, force) {
    const clBounds = attachTo.bounds();
    const someGoodTea = clBounds.getClosestSideT(this.position);

    if (force || attachTo.bounds().contains(this.x, this.y) ||
        someGoodTea.distance < NODE_CLASS_SNAP_DIST) {

        // Actually attach the class.
        this.attachedTo = attachTo;
        this.attachedTo.attachedTNodes.push(this);
        this.position = someGoodTea.atPoint;
        this.side = someGoodTea.side;

        return true;
    }

    return false;
}

/**
 * Refreshes the position of the termination node.
 * @return {Vector} The new position.
 */
TerminationNode.prototype.refreshPosition = function () {
    if (this.attachedTo !== undefined && this.attachedTo !== null) {
        this.position = Vector.add(
            this.attachedTo.bounds().pointOnEdge(this.side),
            this.association.position
        );
        return this.position;
    }
}

TerminationNode.prototype.saveNode = function () {
    let obj = LineNode.prototype.saveNode.call(this);

    if (this.attachedTo !== null) {
        obj.attachedToID = this.attachedTo.id;
        obj.position = this.position;
        obj.side = this.side;
    }

    return obj;
}

TerminationNode.prototype.loadNode = function (obj, association) {
    LineNode.prototype.loadNode.call(this, obj, association);

    if (obj.attachedToID !== undefined) {
        this.attachedTo = association.diagram.getComponentByID(obj.attachedToID);
        this.attachedTo.attachedTNodes.push(this);
        this.position = obj.position;
        this.side = obj.side;
    }
}
// endregion
