import {Selectable} from "../../Selectable";
import {Component} from "../../Component";

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