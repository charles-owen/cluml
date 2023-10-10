import { LineNode } from "./LineNode.js"
import Selectable from "../../Selectable";
import { Class } from "../Class";
import { MainSingleton } from "../../MainSingleton";
import { Multiplicity } from "../../SanityElement/Multiplicity";
import Vector from "../../Utility/Vector";
import { CustomContextMenu } from "../../ContextMenu/CustomContextMenu";
import { TerminationNodeDlg } from "../../Dlg/TerminationNodeDlg.js";
import { TNodeTag } from "../../SanityElement/TNodeTag.js";
import { SanityElement } from "../../SanityElement/SanityElement.js";


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
    this.multiplicityValue = new Multiplicity('*', this);
    this.multiplicityValue.y = 10;

    /**
     * The attribute label.
     * @type {TNodeTag}
     */
    this.tagValue = new TNodeTag('tag', this);
    this.tagValue.y = -7;

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
/**
 *
 * @param other {TerminationNode}
 */
TerminationNode.prototype.copyFrom = function (other) {
    LineNode.prototype.copyFrom.call(this, other);

    this.multiplicityValue.elementValue = other.multiplicityValue.elementValue;
    this.tagValue.elementValue = other.tagValue.elementValue;
}

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

TerminationNode.prototype.rightClick = function (x, y) {
    Selectable.prototype.rightClick.call(this, x, y);

    // Show context menu.
    const contextMenu = new CustomContextMenu(this, new Vector(x, y));
    contextMenu.addEntry("Edit Multiplicity/Label", function () {
        const tNodeDlg = new TerminationNodeDlg(this);
        tNodeDlg.open();
    });
    contextMenu.addEntry("Swap Start and End", function () {
        this.association.swapEnds();
    });
}

TerminationNode.prototype.draw = function (context, view) {
    LineNode.prototype.draw.call(this, context, view);

    const side = Math.floor(this.side);

    switch (side) {
        case 1:
        case 3:
            this.multiplicityValue.y = -7;
            this.tagValue.y = 10;
            break;
        default:
            this.multiplicityValue.x = -5;
            this.tagValue.x = 5;
            break;
    }

    switch (side) {
        case 0:
            this.multiplicityValue.textAlign = 'right';
            this.tagValue.textAlign = 'left';
            this.multiplicityValue.y = 7;
            this.tagValue.y = 7;
            break;
        case 1:
            this.multiplicityValue.textAlign = 'left';
            this.tagValue.textAlign = 'left';
            this.multiplicityValue.x = 5;
            this.tagValue.x = 5;
            break;
        case 2:
            this.multiplicityValue.textAlign = 'right';
            this.tagValue.textAlign = 'left';
            this.multiplicityValue.y = -5;
            this.tagValue.y = -5;
            break;
        case 3:
            this.multiplicityValue.textAlign = 'right';
            this.tagValue.textAlign = 'right';
            this.multiplicityValue.x = -5;
            this.tagValue.x = -5;
            break;
    }

    this.multiplicityValue.draw(context, view);
    this.tagValue.draw(context, view);
}
//endregion

// region TerminationNode Specific Methods
/**
 * Actually attaches the class.
 * @param attachTo {Class}
 * @param position {Vector}
 * @param side {number}
 */
TerminationNode.prototype.attachToClass = function (attachTo, position, side) {
    this.attachedTo = attachTo;
    this.attachedTo.attachedTNodes.push(this);
    this.position = position;
    this.side = side;
}

/**
 * Tries to attach the termination node to the specified class,
 * if the class is close enough.
 * @param attachTo {Class}
 * @param force {boolean} Ignores distance check.
 * @return {boolean}
 */
TerminationNode.prototype.tryAttachToClass = function (attachTo, force) {
    const clBounds = attachTo.bounds();
    const someGoodTea = clBounds.getClosestSideT(this.position);

    if (force || attachTo.bounds().contains(this.x, this.y) ||
        someGoodTea.distance < NODE_CLASS_SNAP_DIST) {

        // Actually attach the class.
        this.attachToClass(attachTo, someGoodTea.atPoint, someGoodTea.side);

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

    obj.multiplicity = this.multiplicityValue.saveSanityElement();
    obj.tag = this.tagValue.saveSanityElement();

    return obj;
}

TerminationNode.prototype.loadNode = function (obj, association) {
    LineNode.prototype.loadNode.call(this, obj, association);

    if (obj.attachedToID !== undefined) {
        const at = association.diagram.getComponentByID(obj.attachedToID);

        this.attachToClass(at, obj.position, obj.side);
    }

    this.multiplicityValue = SanityElement.loadSanityElement(Multiplicity,
        obj.multiplicity, this);
    this.tagValue = SanityElement.loadSanityElement(TNodeTag,
        obj.tag, this);
}

/**
 * Deletes this termination node. This also deletes the
 * association.
 */
TerminationNode.prototype.delete = function () {
    this.association.delete();
}
// endregion
