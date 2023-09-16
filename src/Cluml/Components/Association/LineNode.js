import {Selectable} from "../../Selectable";
import {Component} from "../../Component";
import {Vector} from "../../Utility/Vector";
import {Line} from "../../Utility/Line";
import {Rect} from "../../Utility/Rect";
import Components from "../../Components";
import {Diagram} from "../../Diagram";

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
     * The id of the next LineNode.
     * @type {string|null}
     */
    this.nextID = null;

    /**
     * The id of the previous LineNode.
     * @type {string|null}
     */
    this.previousID = null;
    //endregion

    this.next = function () {
        return Diagram.prototype.getComponentByID(this.nextID);
    }

    this.previous = function () {
        return Diagram.prototype.getComponentByID(this.previousID);
    }
}

/**
 * Copies from another component.
 * @param component {LineNode}
 */
LineNode.prototype.copyFrom = function (component) {
    this.touched = component.touched;
    this.nextID = component.nextID;
    this.previousID = component.previousID;
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
    obj.nextID = this.nextID;
    obj.previousID = this.previousID;
    return obj;
}

//region LineNode Methods
/**
 * Links this node with another node.
 * @param next {LineNode} The next line node.
 */
LineNode.prototype.linkTo = function (next) {
    this.nextID = next;
    next.previousID = this;
}

/**
 * Tries to unlink from the next node.
 * @return {boolean} True if next exists and is removed, false otherwise.
 */
LineNode.prototype.tryUnlinkFromNext = function () {
    if (this.nextID === null)
        return false;
    else {
        this.nextID.previous = null;
        this.nextID = null;
        return true;
    }
}

LineNode.prototype.grab = function () {
    Selectable.prototype.grab();
    this.touched = true;
}
//endregion