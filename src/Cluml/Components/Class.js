import {Component} from "../Component";
import {Rect} from "../Utility/Rect";

export const Class = function () {
    Component.call(this);

    /**
     * Component height.
     * @type {number}
     */
    this.height = 10;
    /**
     * Component width.
     * @type {number}
     */
    this.width = 10;
}

Class.prototype = Object.create(Component.prototype);
Class.prototype.constructor = Class;

/**
 * Copies from another component.
 * @param component {Class}
 */
Class.prototype.copyFrom = function (component) {
    this.height = component.height;
    this.width = component.width;
    Component.prototype.copyFrom.call(this, component);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {Class|null}
 */
Class.prototype.touch = function (x, y) {
    // Have we touched the component itself?
    if (x >= this.x - this.width / 2 &&
        x <= this.x + this.width / 2 &&
        y >= this.y - this.height / 2 &&
        y <= this.y + this.height / 2) {
        return this;
    }

    return null;
}

Class.prototype.bounds = function () {
    return new Rect(this.x - this.width / 2,
        this.y - this.height / 2,
        this.x + this.width / 2,
        this.y + this.height / 2);
}

Class.prototype.draw = function (context, view) {
    this.selectStyle(context, view);

    context.beginPath();
    context.fillStyle = "#e7e8b0";
    context.strokeStyle = "#000000";
    context.rect(
        this.x - this.width / 2 - 0.5,
        this.y - this.height / 2 - 0.5,
        this.width / 2, this.height);
    context.fill();
    context.stroke();

    this.drawName(context, 0, 3);

}

Class.prototype.save = function () {
    const obj = Component.prototype.save.call(this);
    obj.size = this.height;
    obj.bus = this.width;
    return obj;
}

Class.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent.call(this, obj);

    this.height = +obj["height"];
    this.width = +obj["width"];
}

/**
 * Makes sure this component is at least partially within the bounds of screen.
 */
Class.prototype.drop = function () {
    if (this.x < this.width / 2) {
        this.x = this.width / 2;
    }

    if (this.y < this.height / 2) {
        this.y = this.height / 2;
    }
};

/**
 * Clone this component object: AND gate.
 * @return {Class}
 * @instance Class
 */
Class.prototype.clone = function() {
    const copy = new Class();
    copy.copyFrom(this);
    return copy;
};