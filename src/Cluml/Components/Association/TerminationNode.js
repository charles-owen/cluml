import {LineNode} from "./LineNode.js"
import Selectable from "../../Selectable";
import {Class} from "../Class";
import {MainSingleton} from "../../MainSingleton";
import {Multiplicity} from "../../SanityElement/Multiplicity";
import Vector from "../../Utility/Vector";
import {CustomContextMenu} from "../../ContextMenu/CustomContextMenu";
import {TerminationNodeDlg} from "../../Dlg/TerminationNodeDlg.js";
import {TNodeRole} from "../../SanityElement/TNodeRole.js";
import {SanityElement} from "../../SanityElement/SanityElement.js";


/**
 * Determines how far away to snap nodes to classes.
 * @type {number}
 */
export const NODE_CLASS_SNAP_DIST = 25;

/**
 * Determines how far away from any attached classes to start drawing the line.
 * @type {number}
 */
export const ATTACHMENT_OFFSET = 25;

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
     * @type {TNodeRole}
     */
    this.roleValue = new TNodeRole('role', this);
    this.roleValue.y = -7;

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
TerminationNode.prototype.isTail = false;

//region Selectable Methods
/**
 *
 * @param other {TerminationNode}
 */
TerminationNode.prototype.copyFrom = function (other) {
    LineNode.prototype.copyFrom.call(this, other);

    this.multiplicityValue.elementValue = other.multiplicityValue.elementValue;
    this.roleValue.elementValue = other.roleValue.elementValue;
}

TerminationNode.prototype.drop = function () {
    // Do not replace with LineNode.prototype.drop. That would destroy
    // the end nodes (bad).
    Selectable.prototype.drop.call(this);

    // Determine if we are near a class. For now, just go
    // through every class.
    let classes = MainSingleton.singleton.getCurrentComponentsByType("Class");
    classes = classes.concat(MainSingleton.singleton.getCurrentComponentsByType("InterfaceClass"));

    for (const cl of classes) {
        // Attach to the first class we see.
        if (this.tryAttachToClass(cl, false))
            return;
    }

    // Not attached to any class. Make sure to remove the class
    // we would be attached to.
    this.detachFromClass();
}

/**
 * Opens context menu for the termination node.
 * @param x {number} X-coordinate of the mouse.
 * @param y {number} Y-coordinate of the mouse.
 */
TerminationNode.prototype.rightClick = function (x, y) {
    Selectable.prototype.rightClick.call(this, x, y);

    // Show context menu.
    const contextMenu = new CustomContextMenu(this, new Vector(x, y));
    if (!this.association || this.association.showTags) {
        // Only allow users to open dialog if tags (role/multiplicity) are to be shown.
        contextMenu.addEntry("Edit Multiplicity/Label", function () {
            const tNodeDlg = new TerminationNodeDlg(this);
            tNodeDlg.open();
        });
    }
    contextMenu.addEntry("Swap Start and End", function () {
        this.association.swapEnds();
        MainSingleton.singleton.currentView.selection.selected = [this];
        MainSingleton.singleton.redraw();
    });
    contextMenu.addEntry("Delete " + this.association.paletteLbl, function () {
        this.delete();
        MainSingleton.singleton.redraw();
    });
}

TerminationNode.prototype.draw = function (context, view) {
    const side = Math.floor(this.side);

    switch (side) {
        case 1:
        case 3:
            this.multiplicityValue.y = -7;
            this.roleValue.y = 10;
            break;
        default:
            this.multiplicityValue.x = 5;
            this.roleValue.x = -5;
            break;
    }

    switch (side) {
        case 0:
            this.multiplicityValue.textAlign = 'left';
            this.roleValue.textAlign = 'right';
            this.multiplicityValue.y = 7;
            this.roleValue.y = 7;
            break;
        case 1:
            this.multiplicityValue.textAlign = 'left';
            this.roleValue.textAlign = 'left';
            this.multiplicityValue.x = 5;
            this.roleValue.x = 5;
            break;
        case 2:
            this.multiplicityValue.textAlign = 'left';
            this.roleValue.textAlign = 'right';
            this.multiplicityValue.y = -5;
            this.roleValue.y = -5;
            break;
        case 3:
            this.multiplicityValue.textAlign = 'right';
            this.roleValue.textAlign = 'right';
            this.multiplicityValue.x = -5;
            this.roleValue.x = -5;
            break;
    }

    // Draw the tails of the association
    if (this.isTail) {
        // Tail termination node doesn't call LineNode.draw
        this.association.drawTail(context, view, this);
    } else {
        LineNode.prototype.draw.call(this, context, view);
    }

    if (!this.association || this.association.showTags) {
        // Only show multiplicity and role if the association requests it.
        // If no association, default to drawing the tags.
        this.multiplicityValue.draw(context, view);
        this.roleValue.draw(context, view);
    }
}
//endregion

//region LineNode Overrides
TerminationNode.prototype.lineupPoint = function () {
    if (!this.attachedTo)
        return this.position;

    const side = Math.floor(this.side);
    const normal = new Vector(0, 0);

    switch (side) {
        case 0:
            normal.y = ATTACHMENT_OFFSET;
            break;
        case 1:
            normal.x = ATTACHMENT_OFFSET;
            break;
        case 2:
            normal.y = -ATTACHMENT_OFFSET;
            break;
        case 3:
            normal.x = -ATTACHMENT_OFFSET;
            break;
    }

    return Vector.add(this.position, normal);
}

/**
 * Links this node with another node. As the termination node can only be
 * linked with one other node, calling this method unlinks this from the
 * other node, if it exists.
 * @param next {LineNode} The next line node.
 */
TerminationNode.prototype.linkToNext = function (next) {
    if (this !== next) {
        // Unlink from everything. See function comment.
        this.tryUnlinkFromPrevious();
        this.tryUnlinkFromNext();

        // Link to next.
        LineNode.prototype.linkToNext.call(this, next);
    }
}

/**
 * Links this node with another node. As the termination node can only be
 * linked with one other node, calling this method unlinks this from the
 * other node, if it exists.
 * @param previous {LineNode} The previous line node.
 */
TerminationNode.prototype.linkToPrevious = function (previous) {
    if (this !== previous) {
        // Unlink from everything. See function comment.
        this.tryUnlinkFromPrevious();
        this.tryUnlinkFromNext();

        // Link to previous.
        LineNode.prototype.linkToPrevious.call(this, previous);
    }
}

/**
 * As the termination node can only have one neighbor, this function does
 * nothing.
 * @param previous
 * @param next
 * @return {undefined}
 */
TerminationNode.prototype.insertBetween = function (previous, next) {
    return undefined;
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
    // Make sure we aren't attached to anything already.
    this.detachFromClass();

    this.attachedTo = attachTo;
    this.attachedTo.attachedTNodes.push(this);
    this.position = position;
    this.side = side;

    // Redraw the association.
    MainSingleton.singleton.redraw();
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
 * Detaches this termination node from the class it is attached to.
 * @return {boolean} True if the detachment from class is successful, false otherwise.
 */
TerminationNode.prototype.detachFromClass = function () {
    if (this.attachedTo) {
        const i = this.attachedTo.attachedTNodes.indexOf(this);

        if (i >= 0) {
            this.attachedTo.attachedTNodes.splice(i, 1);
        }

        this.attachedTo = null;
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
    obj.role = this.roleValue.saveSanityElement();

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
    this.roleValue = SanityElement.loadSanityElement(TNodeRole,
        obj.role, this);
}

/**
 * Deletes this termination node. This also deletes the
 * association.
 */
TerminationNode.prototype.delete = function () {
    this.association.delete();
}
// endregion
