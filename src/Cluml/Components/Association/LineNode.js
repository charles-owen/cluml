import {Selectable} from "../../Selectable";
import {Component} from "../../Component";
import vector, {Vector} from "../../Utility/Vector";
import {Line} from "../../Utility/Line";

/**
 * Determines the radius around the node at which
 * it is considered to be touched.
 * @type {number}
 */
const NODE_TOUCH_RADIUS = 15;

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
    this.next = null;

    /**
     * The previous LineNode.
     * @type {LineNode}
     */
    this.previous = null;
    //endregion
}

/**
 * Copies from another component.
 * @param component {LineNode}
 */
LineNode.prototype.copyFrom = function (component) {
    this.touched = component.touched;
    this.next = component.next;
    this.previous = component.previous;
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

LineNode.prototype.bounds = function () {
    return new Rect
}

//region LineNode Methods
/**
 * Links this node with another node.
 * @param next {LineNode} The next line node.
 */
LineNode.prototype.linkTo = function (next) {
    this.next = next;
    next.previous = this;
}

/**
 * Tries to unlink from the next node.
 * @return {boolean} True if next exists and is removed, false otherwise.
 */
LineNode.prototype.tryUnlinkFromNext = function () {
    if (this.next === null)
        return false;
    else {
        this.next.previous = null;
        this.next = null;
        return true;
    }
}

LineNode.prototype.grab = function () {
    Selectable.prototype.grab();
    this.touched = true;
}
//endregion