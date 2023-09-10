import {Component} from "../Component";
import {Rect} from "../Utility/Rect";

export const BoxedComponent = function () {
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

BoxedComponent.prototype = Object.create(Component.prototype);
BoxedComponent.prototype.constructor = BoxedComponent;

/**
 * Copies from another component.
 * @param component {BoxedComponent}
 */
BoxedComponent.prototype.copyFrom = function (component) {
    this.height = component.height;
    this.width = component.width;
    Component.prototype.copyFrom.call(this, component);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {BoxedComponent|null}
 */
BoxedComponent.prototype.touch = function (x, y) {
    // Have we touched the component itself?
    if (x >= this.x - this.width / 2 &&
        x <= this.x + this.width / 2 &&
        y >= this.y - this.height / 2 &&
        y <= this.y + this.height / 2) {
        return this;
    }

    return null;
}

BoxedComponent.prototype.bounds = function () {
    return new Rect(this.x - this.width / 2,
        this.y - this.height / 2,
        this.x + this.width / 2,
        this.y + this.height / 2);
}

BoxedComponent.prototype.draw = function (context, view) {
    this.drawBox(context, undefined);
}

/**
 * Many diagrams are just a box. This is a function to draw that box
 * @param context Context to draw on
 * @param fillStyle {string} The fill style.
 */
BoxedComponent.prototype.drawBox = function (context, fillStyle) {
    if(fillStyle !== 'none') {
        let save = context.fillStyle;
        context.fillStyle = fillStyle !== undefined ? fillStyle : '#ffffff';
        context.fillRect(this.x - this.width / 2 - 0.5,
            this.y - this.height / 2 - 0.5,
            this.width, this.height);
        context.fillStyle = save;
    }

    context.beginPath();
    context.rect(
        this.x - this.width / 2 - 0.5,
        this.y - this.height / 2 - 0.5,
        this.width, this.height);
    context.stroke();
}

BoxedComponent.prototype.save = function () {
    const obj = Component.prototype.save.call(this);
    obj.size = this.height;
    obj.bus = this.width;
    return obj;
}

BoxedComponent.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent.call(this, obj);

    this.height = +obj["height"];
    this.width = +obj["width"];
}

/**
 * Makes sure this component is at least partially within the bounds of screen.
 */
BoxedComponent.prototype.drop = function () {
    if (this.x < this.width / 2) {
        this.x = this.width / 2;
    }

    if (this.y < this.height / 2) {
        this.y = this.height / 2;
    }
};