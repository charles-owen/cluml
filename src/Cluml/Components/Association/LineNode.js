import {DEBUG_BOUNDS, Selectable} from "../../Selectable";
import {Vector} from "../../Utility/Vector";
import {Line} from "../../Utility/Line";
import {Rect} from "../../Utility/Rect";
import {MainSingleton} from "../../MainSingleton";
import {TerminationNode} from "./TerminationNode";
import {CustomContextMenu} from "../../ContextMenu/CustomContextMenu";

/**
 * Determines the radius around the node at which
 * it is considered to be touched.
 * @type {number}
 */
export const NODE_TOUCH_RADIUS = 15;

/**
 * Determines the radius of the node graphic when it is
 * not touched.
 * @type {number}
 */
export const NODE_NORMAL_RADIUS = 5;

/**
 * Determines the snapping distance of the node
 * @type {number}
 */
export const NODE_SNAPPING_RADIUS = 5;

export const SPIN_VERTICAL = 0;
export const SPIN_HORIZONTAL = 1;

export const LineNode = function () {
    Selectable.call(this);

    //region Fields
    /**
     * The next LineNode.
     * @type {LineNode}
     */
    this.nextNode = null;

    /**
     * The previous LineNode.
     * @type {LineNode}
     */
    this.previousNode = null;

    /**
     * @type{Association}
     */
    this.association = null;
    //endregion

    //region Properties
    Object.defineProperty(this, 'hasNext', {
        get: function () {
            return this.nextNode !== undefined && this.nextNode !== null;
        }
    });

    Object.defineProperty(this, 'hasPrevious', {
        get: function () {
            return this.previousNode !== undefined && this.previousNode !== null;
        }
    });
    //endregion

    this.selectedStyle = "rgba(255,0,0,0.5)";
}

LineNode.prototype = Object.create(Selectable.prototype);
LineNode.prototype.constructor = LineNode;


LineNode.prototype.fileLbl = "LineNode";
LineNode.prototype.helpLbl = 'lineNode';
LineNode.prototype.paletteLbl = "Line Node";
LineNode.prototype.paletteDesc = "The intermediate nodes of an association.";
LineNode.prototype.htmlDesc = '<h2>Line Node</h2><p>The intermediate nodes of an association.</p>';
LineNode.prototype.paletteOrder = -1;

//region Position
/**
 * Gets the point where the node attaches with the association
 * line.
 * @return {Vector}
 */
LineNode.prototype.lineupPoint = function () {
    return this.position;
}
//endregion

//region Save/Load
LineNode.prototype.saveNode = function () {
    let obj = {
        x: this.x,
        y: this.y,
    }

    if (this.hasNext) {
        obj.next = this.nextNode.saveNode();
        obj.nextType = this.nextNode.hasNext ? "Intermediate" : "Termination";
    } else {
        obj.next = null;
    }

    return obj;
}

/**
 * Loads the node and all nodes next to it.
 * @param obj {*}
 * @param association {Association}
 */
LineNode.prototype.loadNode = function (obj, association) {
    this.association = association;

    this.x = obj.x;
    this.y = obj.y;

    if (obj.next !== null) {
        switch (obj.nextType) {
            case "Intermediate":
                this.nextNode = new LineNode();
                break;
            case "Termination":
                this.nextNode = new TerminationNode();
                break;
            default:
                throw Error("nextType '" + obj.nextType + "' not recognised.");
        }

        this.nextNode.previousNode = this;
    }
}
//endregion

//region Selectable Functions
/**
 * Copies from another selectable.
 * @param selectable {LineNode}
 */
LineNode.prototype.copyFrom = function (selectable) {
    this.nextNode = selectable.nextNode;
    this.previousNode = selectable.previousNode;
    this.association = selectable.association;

    // if (this.hasNext) {
    //     // Propagate.
    //     this.nextNode.copyFrom(selectable.nextNode);
    // }
    Selectable.prototype.copyFrom.call(this, selectable);
}

/**
 * Try to touch this selectable or some part of
 * the selectable.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {LineNode|null}
 */
LineNode.prototype.touch = function (x, y) {
    let diff = new Line(
        new Vector(x, y),
        new Vector(this.x, this.y)
    );

    if (diff.length() <= NODE_TOUCH_RADIUS) {
        return this;
    }

    return null;
}

/**
 * Start of the dragging process
 */
LineNode.prototype.grab = function () {
    // Do backup.
    //console.log('LineNode called model.backup');
    //MainSingleton.singleton.backup();

    Selectable.prototype.grab.call(this);
    this.touched = true;
}

LineNode.prototype.move = function (dx, dy, x, y) {
    Selectable.prototype.move.call(this, dx, dy, x, y);

    if (this.hasNext && this.nextNode.hasNext) {
        if (Math.abs(this.x - this.nextNode.nextNode.x) < NODE_SNAPPING_RADIUS) {
            // Snap to next node in the X axis
            this.x = this.nextNode.nextNode.x;
            this.moveX = this.x;
        }
        if (Math.abs(this.y - this.nextNode.nextNode.y) < NODE_SNAPPING_RADIUS) {
            // Snap to next node in the Y axis
            this.y = this.nextNode.nextNode.y;
            this.moveY = this.y;
        }
    }

    if (this.hasPrevious && this.previousNode.hasPrevious) {
        if (Math.abs(this.x - this.previousNode.previousNode.x) < NODE_SNAPPING_RADIUS) {
            // Snap to previous node in the X axis
            this.x = this.previousNode.previousNode.x;
            this.moveX = this.x;
        }
        if (Math.abs(this.y - this.previousNode.previousNode.y) < NODE_SNAPPING_RADIUS) {
            // Snap to previous node in the Y axis
            this.y = this.previousNode.previousNode.y;
            this.moveY = this.y;
        }
    }
}

/**
 * Syncs all the nodes in the association.
 * @param cullRedundant {boolean} If true, then remove redundant nodes.
 * @return {boolean}
 */
LineNode.prototype.syncNodes = function (cullRedundant) {
    let anyChanges = false;

    if (cullRedundant) {
        // Check if this node is redundant.
        if (this.hasPrevious && this.hasNext) {
            if (this.y === this.previousNode.y && this.y === this.nextNode.y) {
                // Vertically redundant.
                this.delete();
            } else if (this.x === this.previousNode.x && this.x === this.nextNode.x) {
                // Horizontally redundant.
                this.delete();
            }
        }
    }

    // Check the prev and next nodes, update if they don't have the correct position.
    if (this.hasPrevious) {
        if (!this.previousNode.isManaged) {
            // No managed node? Make one.
            this.association.insertManagedBetween(this.previousNode, this);
            anyChanges = true;
        }
    }

    if (this.hasNext) {
        if (!this.nextNode.isManaged) {
            // No managed node? Make one.
            this.association.insertManagedBetween(this, this.nextNode);
            anyChanges = true;
        }

        return this.nextNode.syncNodes() || anyChanges;
    }

    return anyChanges;
}

LineNode.prototype.drop = function () {
    Selectable.prototype.drop.call(this);

    if ((this.hasNext && Vector.distance(this.position, this.nextNode.position) < 5) ||
        (this.hasPrevious && Vector.distance(this.position, this.previousNode.position) < 5)) {
        // Delete this node if we drop it really close to another node.
        this.delete();
    }
}

/**
 * Opens context menu for the line node.
 * @param x {number} X-coordinate of the mouse.
 * @param y {number} Y-coordinate of the mouse.
 */
LineNode.prototype.rightClick = function (x, y) {
    Selectable.prototype.rightClick.call(this, x, y);

    // Show context menu.
    const contextMenu = new CustomContextMenu(this, new Vector(x, y));
    contextMenu.addEntry("Delete Node", function () {
        this.delete();
        MainSingleton.singleton.redraw();
    });
}

/**
 * Returns the bounds of the LineNode, used to ensure the
 * object remains on screen.
 * @return {Rect}
 */
LineNode.prototype.bounds = function () {
    return Rect.fromCenterAndExtents(
        new Vector(this.x, this.y),
        new Vector(NODE_TOUCH_RADIUS, NODE_TOUCH_RADIUS)
    )
}

/**
 * Draws the LineNode object.
 *
 * @param context {CanvasRenderingContext2D} Display context
 * @param view {View} View object
 */
LineNode.prototype.draw = function (context, view) {
    // Don't need to call the super function here.
    // Selectable.prototype.draw.call(this, context, view);

    if (this.association)
        this.association.selectStyle(context, view);
    else
        this.selectStyle(context, view);

    // Either draws a small dot if not selected or a bigger dot if it is selected.
    // These dots inform the user where the grab points of the association are.
    context.beginPath();
    if (view.selection.isSelected(this)) {
        context.arc(this.x, this.y, NODE_NORMAL_RADIUS, 0, 2 * Math.PI, true);
    } else {
        context.arc(this.x, this.y, 1, 0, 2 * Math.PI, true);
    }
    context.fill();

    if (this.lineupPoint() !== this.position) {
        // Draw line from the attachment position to the actual position.
        context.beginPath();

        const line = new Line(this.position, this.lineupPoint());
        line.contextLineTo(context);

        context.stroke();
    }

    if (DEBUG_BOUNDS) {
        // If in debug mode, draw circle.
        context.arc(this.x, this.y, NODE_NORMAL_RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
    }
}
//endregion

//region LineNode Specific Methods
/**
 * Links this node with another node. Does nothing if next === this.
 * @param next {LineNode} The next line node.
 */
LineNode.prototype.linkToNext = function (next) {
    if (this !== next) {
        this.nextNode = next;
        next.previousNode = this;
    }
}

/**
 * Links this node with another node. Does nothing if previous === this.
 * @param previous {LineNode} The previous line node.
 */
LineNode.prototype.linkToPrevious = function (previous) {
    if (this !== previous) {
        this.previousNode = previous;
        previous.nextNode = this;
    }
}

/**
 * Inserts this node between two other nodes.
 * @param previous {LineNode} The previous line node.
 * @param next {LineNode} The next line node.
 */
LineNode.prototype.insertBetween = function (previous, next) {
    if (next !== undefined && next !== null)
        this.linkToNext(next);

    if (previous !== undefined && previous != null)
        this.linkToPrevious(previous);
}

/**
 * Removes this node from the linked list.
 */
LineNode.prototype.delete = function () {
    if (this.nextNode !== null) {
        this.nextNode.previousNode = this.previousNode;
    }

    if (this.previousNode !== null) {
        this.previousNode.nextNode = this.nextNode;
    }
}

/**
 * Tries to unlink from the next node.
 * @return {boolean} True if next exists and is removed, false otherwise.
 */
LineNode.prototype.tryUnlinkFromNext = function () {
    if (this.nextNode === null)
        // The next node does not exist.
        return false;
    else {
        // Node found. Remove it.
        this.nextNode.previousNode = null;
        this.nextNode = null;
        return true;
    }
}

/**
 * Tries to unlink from the previous node.
 * @return {boolean} True if previous exists and is removed, false otherwise.
 */
LineNode.prototype.tryUnlinkFromPrevious = function () {
    if (this.previousNode === null)
        // The previous node does not exist.
        return false;
    else {
        // Node found. Remove it.
        this.previousNode.nextNode = null;
        this.previousNode = null;
        return true;
    }
}

/**
 * Tries to unlink from both previous and next nodes.
 * @return {number} The number of nodes unlinked from.
 */
LineNode.prototype.tryUnlinkFromBoth = function () {
    let cnt = 0;

    if (this.tryUnlinkFromPrevious())
        cnt++;
    if (this.tryUnlinkFromNext())
        cnt++;

    return cnt;
}
//endregion
