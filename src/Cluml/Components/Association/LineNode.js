import {Selectable} from "../../Selectable";
import {Vector} from "../../Utility/Vector";
import {Line} from "../../Utility/Line";
import {Rect} from "../../Utility/Rect";
import {NodeWrapper} from "./NodeWrapper";
import {DEBUG_BOUNDS} from "../../Component";
import {MainSingleton} from "../../MainSingleton";
import {TerminationNode} from "./TerminationNode";

/**
 * Determines the radius around the node at which
 * it is considered to be touched.
 * @type {number}
 */
export const NODE_TOUCH_RADIUS = 15;

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

//region Save/Load
/**
 *
 * @return {{x: number, y: number, next: *, nextType: undefined|string}}
 */
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
    MainSingleton.singleton.backup();

    Selectable.prototype.grab.call(this);
    this.touched = true;
}

// LineNode.prototype.move = function (dx, dy, x, y) {
//     Selectable.prototype.move.call(this, dx, dy, x, y);
//     const cursorPos = new Vector(x,y);
//     const delta = Vector.sub(cursorPos, this.movedFrom);
//
//     if (Math.abs(delta.x) > Math.abs(delta.y)) {
//         this.x = this.moveX;
//         this.y = this.movedFrom.y;
//     } else {
//         this.x = this.movedFrom.x;
//         this.y = this.moveY;
//     }
// }

LineNode.prototype.drop = function () {
    Selectable.prototype.drop.call(this);

    if ((this.hasNext && Vector.distance(this.position, this.nextNode.position) < 5) ||
        (this.hasPrevious && Vector.distance(this.position, this.previousNode.position) < 5)) {
        // Delete this node.
        this.remove();
        this.delete();
    }
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
    // Selectable.prototype.draw.call(this, context, view);

    this.selectStyle(context, view);

    if (view.selection.isSelected(this)) {
        context.beginPath();
        context.arc(this.x, this.y, NODE_TOUCH_RADIUS, 0, 2 * Math.PI, true);
        context.fill();
    }

    if (DEBUG_BOUNDS) {
        context.fillStyle = this.selectedStyle;
        context.fillRect(
            this.x - NODE_TOUCH_RADIUS,
            this.y - NODE_TOUCH_RADIUS,
            NODE_TOUCH_RADIUS * 2,
            NODE_TOUCH_RADIUS * 2
        );
    }
}


LineNode.prototype.paletteImage = function () {
    // TODO: Implement (not needed lol).
    return null;
}
//endregion

//region LineNode Specific Methods
/**
 * Links this node with another node.
 * @param next {LineNode} The next line node.
 */
LineNode.prototype.linkToNext = function (next) {
    this.nextNode = next;
    next.previousNode = this;
}

/**
 * Links this node with another node.
 * @param previous {LineNode} The previous line node.
 */
LineNode.prototype.linkToPrevious = function (previous) {
    this.previousNode = previous;
    previous.nextNode = this;
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
LineNode.prototype.remove = function () {
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
        return false;
    else {
        this.nextNode.previousNode = null;
        this.nextNode = null;
        return true;
    }
}
//endregion
