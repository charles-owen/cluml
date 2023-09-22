import {Component} from "../Component";
import {Rect} from "../Utility/Rect";
import {PaletteImage} from "../Graphics/PaletteImage";
import {AddPopup} from "../UI/AddPopup";

export const Class = function () {
    Component.call(this);

    /**
     * Component height.
     * @type {number}
     */
    this.height = 100;

    /**
     * Component width.
     * @type {number}
     */
    this.width = 200;

    /**
     * The array of attributes.
     * @type{Array<String>}
     */
    this.attributes = ["-attribute1 :", "-attribute2 :"];

    /**
     * The array of operations.
     * @type{Array<String>}
     */
    this.operations = ["+operation1() :", "+operation2() :"];

    this.addPopup = null;

    this.nameHeight = 30;
    this.attributesHeight = 40;
    this.operationsHeight = 40;

    //this doesn't actually control font its just what it seemed to be hardcoded into
    this.fontHeight = 16;
}

Class.prototype = Object.create(Component.prototype);
Class.prototype.constructor = Class;


Class.prototype.fileLbl = "Class";
Class.prototype.helpLbl = 'class';
Class.prototype.paletteLbl = "Class";
Class.prototype.paletteDesc = "Class component.";
Class.prototype.htmlDesc = '<h2>Class</h2><p>A basic class.</p>';
Class.prototype.paletteOrder = 1;

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
        y >= this.y - this.height &&
        y <= this.y) {
        return this;
    }

    return null;
}

Class.prototype.tryTouchAddPopup = function(x,y) {
    if (this.addPopup != null)
    {
        return this.addPopup.touch(x,y);
    }
    return null;
}
/**
 * Returns the bounds of the Class, used to ensure the
 * object remains on screen.
 * @return {Rect}
 */
Class.prototype.bounds = function () {
    return new Rect(this.x - this.width / 2,
        this.y - this.height / 2,
        this.x + this.width / 2,
        this.y + this.height / 2);
}

Class.prototype.enableAddPopup = function (enable) {
    if (enable)
    {
        this.addPopup = new AddPopup(this);
    }
    else
    {
        this.addPopup = null;
    }
}

/**
 * Draws the class object.
 *
 * @param context {CanvasRenderingContext2D} Display context
 * @param view {View} View object
 */
Class.prototype.draw = function (context, view) {
    this.height = this.nameHeight + this.attributesHeight + this.operationsHeight;
    this.selectStyle(context, view);

    context.beginPath();
    context.fillStyle = "#e7e8b0";
    context.strokeStyle = "#000000";

    // Class Name rect
    context.rect(
        this.x - this.width / 2,
        this.y - this.height,
        this.width, this.nameHeight);

    // Attribute rect
    context.rect(
        this.x - this.width / 2,
        this.y - this.height + this.nameHeight,
        this.width, this.attributesHeight);

    // Operations rect
    context.rect(
        this.x - this.width / 2,
        this.y - this.height + this.nameHeight + this.attributesHeight,
        this.width, this.operationsHeight);

    context.fill();
    context.stroke();

    // Defaults the name to NewClass if no name is given
    if (this.naming == null) {
        this.naming = "ClassName"
    }

    context.fillStyle = "#000000";

    this.drawName(context,
        0,
        0 - this.height + 20);

    context.textAlign = "left"
    // Attributes text
    for(let i = 0; i < this.attributes.length; i++) {
        context.fillText(this.attributes[i],
            this.x - this.width / 2 + 5,
            this.y - this.height + this.nameHeight + (i * this.fontHeight) + 15,
            this.width)
    }

    // Operations text
    for(let j = 0; j < this.operations.length; j++) {
        context.fillText(this.operations[j],
            this.x - this.width / 2 + 5,
            this.y - this.height + this.nameHeight + this.attributesHeight + (j * this.fontHeight) + 15,
            this.width)
    }

    if (this.addPopup != null)
    {
        this.addPopup.draw(context, view, this.x, this.y);
    }
}

Class.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
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
 * Create a PaletteImage object for the component
 * @returns {PaletteImage}
 */
Class.prototype.paletteImage = function() {
    // let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height

    const pi = new PaletteImage(width, height);

    pi.box(40, 30);
    pi.fillStroke("#e7e8b0");
    pi.box(40, 15);
    pi.fillStroke("#e7e8b0");

    return pi;
}

/**
 * Add an attribute to this Class
 */
Class.prototype.addAttribute = function(attribute) {
    this.attributes.push(attribute)
    this.attributesHeight += this.fontHeight;
}

/**
 * Add an operation to this Class
 */
Class.prototype.addOperation = function(operation) {
    this.operations.push(operation)
}