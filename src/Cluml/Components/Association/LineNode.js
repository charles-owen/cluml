import {Selectable} from "../../Selectable";
import {Component} from "../../Component";
import {Vector} from "../../Utility/Vector";
import {Line} from "../../Utility/Line";
import {Rect} from "../../Utility/Rect";
import {Association} from "./Association";

/**
 * Determines the radius around the node at which
 * it is considered to be touched.
 * @type {number}
 */
export const NODE_TOUCH_RADIUS = 15;

export const LineNode = function () {
    Component.call(this);

    //region Fields
    /**
     * Determines whether this node has been touched.
     * Untouched nodes may reposition themselves automatically.
     * Touched nodes will not.
     * @type {boolean}
     */
    this.touched = false;

    /**
     * The next LineNode.
     * @type {LineNode}
     */
    let next = null;

    /**
     * The id of the next LineNode.
     * @type {string}
     */
    let nextID = undefined;

    /**
     * The previous LineNode.
     * @type {LineNode}
     */
    let previous = null;

    /**
     * The id of the previous LineNode.
     * @type {string}
     */
    let previousID = undefined;
    //endregion

    //region Properties
    Object.defineProperty(this, 'nextNode', {
        get: function () {
            if (next !== null) {
                return next;
            } else if (nextID !== undefined) {
                return this.diagram.getComponentByID(nextID);
            } else {
                return null;
            }
        },
        set: function (node) {
            nextID = node.id;
            next = node;
        }
    });

    Object.defineProperty(this, 'previousNode', {
        get: function () {
            if (previous !== null) {
                return previous;
            } else if (previousID !== undefined) {
                return this.diagram.getComponentByID(previousID);
            } else {
                return  null;
            }
        },
        set: function (node) {
            previousID = node.id;
            previous = node;
        }
    });
    //endregion

    this.loadIDs = function (idNext, iDPrevious) {
        nextID = idNext;
        previousID = iDPrevious;
    }
}

LineNode.prototype = Object.create(Component.prototype);
LineNode.prototype.constructor = LineNode;

//region Selectable Functions
/**
 * Copies from another component.
 * @param component {LineNode}
 */
LineNode.prototype.copyFrom = function (component) {
    this.touched = component.touched;
    this.nextNode = component.nextNode;
    this.previousNode = component.previousNode;
    Component.prototype.copyFrom.call(this);
}

/**
 * Try to touch this component or some part of
 * the component.
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
    this.selectStyle(context, view);

    // TODO: Implement.
}


LineNode.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
    obj.touched = this.touched;
    obj.nextID = this.nextNode.id;
    obj.previousID = this.previousNode.id;
    return obj;
}

LineNode.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent.call(this, obj);

    this.loadIDs(obj.nextID, obj.previousID);
}

LineNode.prototype.paletteImage = function () {
    // TODO: Implement.
    return null;
}

/**
 * Start of the dragging process
 */
LineNode.prototype.grab = function () {
    Selectable.prototype.grab();
    this.touched = true;
}
//endregion

//region LineNode Methods
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