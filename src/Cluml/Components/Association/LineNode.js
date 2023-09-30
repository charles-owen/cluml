import {Selectable, DEBUG_BOUNDS} from "../../Selectable";
import {Vector} from "../../Utility/Vector";
import {Line} from "../../Utility/Line";
import {Rect} from "../../Utility/Rect";
import {MainSingleton} from "../../MainSingleton";
import {TerminationNode} from "./TerminationNode";

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

// /**
//  * The "orientation" of the node. A Vertical spin means that
//  * the node will be drawn with a vertical line first, then a
//  * horizontal line, traveling from start to end. A Horizontal
//  * spin means that the node will be drawn with a horizontal
//  * line first, then a vertical line, traveling from start to end.
//  */
// LineNode.prototype.spin = function () {
//     if (this.hasNext) {
//         if (this.hasPrevious) {
//             let xRel = 0, yRel = 0;
//
//             if (this.previousNode.x < this.x && this.x < this.nextNode.x) {
//                 // Between the 2 nodes.
//                 xRel = 0;
//             } else if (this.previousNode.x > this.x  && this.x < this.nextNode.x) {
//                 // Left of the 2 nodes.
//                 xRel = -1;
//             } else {
//                 // Right of the 2 nodes.
//                 xRel = 1;
//             }
//
//             if (this.previousNode.y > this.y && this.y > this.nextNode.y) {
//                 // Between the 2 nodes.
//                 yRel = 0;
//             } else if (this.previousNode.y < this.y  && this.y > this.nextNode.y) {
//                 // Below the 2 nodes.
//                 yRel = -1;
//             } else {
//                 // Above the 2 nodes.
//                 yRel = 1;
//             }
//
//             if (xRel === 0 && yRel === 0) {
//                 // Between the nodes.
//                 // *
//                 //   *
//                 //     *
//                 if (this.y < this.nextNode.y) {
//                     // Above next.
//                     return SPIN_VERTICAL;
//                 } else {
//                     // Below next.
//                     return SPIN_HORIZONTAL;
//                 }
//             } else if (xRel === 0) {
//                 // Below/above both nodes.
//                 return SPIN_HORIZONTAL;
//             } else if (xRel < 0) {
//                 // Left of both nodes.
//                 return SPIN_HORIZONTAL;
//             } else {
//                 // Right of both nodes.
//             }
//         } else {
//             // Start node.
//             if (this.x < this.nextNode.x) {
//                 // To the left.
//                 if (this.y < this.nextNode.y) {
//                     // Left and below.
//                     return SPIN_VERTICAL;
//                 } else {
//                     // Left and above.
//                     return SPIN_VERTICAL;
//                 }
//             } else {
//                 // To the right.
//                 if (this.y < this.nextNode.y) {
//                     // Right and below.
//                     return SPIN_HORIZONTAL;
//                 } else {
//                     // Right and above.
//                     return SPIN_HORIZONTAL;
//                 }
//             }
//         }
//     }
//
//     // Spin doesn't matter for the end node.
//     return SPIN_VERTICAL;
// }

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
    } else {
        context.beginPath();
        context.arc(this.x, this.y, NODE_NORMAL_RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
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
