import {Class} from "../Components/Class";
import {Attribute} from "../SanityElement/Attribute";

export const ClassContextMenu = function (component) {
    Object.defineProperty(this, 'popup', {

    });

    /**
     * The component (class) this popup belongs to
     */
    this.component = component;

    /**
     * X Offset for formatting
     * @type {number}
     */
    this.xOffset = 50;

    /**
     * Y Offset for formatting
     * @type {number}
     */
    this.yOffset = 100;

    /**
     * Margin used for formatting
     * @type {number}
     */
    this.margin = 5;

    /**
     * Height of the popup box
     * @type {number}
     */
    this.height = 90;

    /**
     * Width of the popup box
     * @type {number}
     */
    this.width = 150;

    /**
     * X position relative to where component is
     * @type {number}
     */
    this.x = 0;

    /**
     * Y position relative to where component is
     * @type {number}
     */
    this.y = 0;

    /**
     * Top of popup box relative to where component is
     * @type {number}
     */
    this.top = 0;
};
ClassContextMenu.prototype.constructor = ClassContextMenu;

/**
 * Draw the Context Menu
 * @param context Display
 * @param view view popup is on
 * @param x parent component x position
 * @param y parent component y position
 */
ClassContextMenu.prototype.draw = function (context, view, x, y) {
    this.x = x + this.xOffset + (this.width / 2);
    this.y = y + this.yOffset - (this.height / 2);
    this.top = this.y - (this.height / 2);

    context.beginPath();
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#000000";

    context.rect(
        x+this.xOffset,
        y+this.yOffset-this.height,
        this.width, this.height);

    context.fill();
    context.stroke();

    // Add text
    context.fillStyle = "#000000";
    context.textAlign = "left"
    context.fillText("Add",
        x+this.xOffset+this.margin,
        this.top + (this.height / 3) - 10,this.width);

    context.fillText("Ctrl+A",
        x+this.width,
        this.top + (this.height / 3) - 10,this.width);

    // Draw Divider1
    context.beginPath();
    context.moveTo(x+this.xOffset, this.top + (this.height / 3));
    context.lineTo(x+this.xOffset+this.width, this.top + (this.height / 3));
    context.stroke();

    // Properties text
    context.fillText("Properties",
        x+this.xOffset+this.margin,
        this.top + 2*(this.height / 3) - 10,this.width);

    context.fillText("Ctrl+P",
        x+this.width,
        this.top + 2*(this.height / 3) - 10,this.width);

    // Draw Divider2
    context.beginPath();
    context.moveTo(x+this.xOffset, this.top + 2*(this.height / 3));
    context.lineTo(x+this.xOffset+this.width, this.top + 2*(this.height / 3));
    context.stroke();

    // Delete text
    context.fillText("Delete",
        x+this.xOffset+this.margin,
        this.top + 2*(this.height / 3) + 20,this.width);

    context.fillText("Delete",
        x+this.width,
        this.top + 2*(this.height / 3) + 20,this.width);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {ClassContextMenu|null}
 */
ClassContextMenu.prototype.touch = function (x, y) {
    // this.x & this.y are the very middle of the box
    if (x >= this.x - this.width / 2 &&
        x <= this.x + this.width / 2 &&
        y >= this.y - this.height / 2 &&
        y <= this.y + this.height / 2) {

        if (y < this.top + (this.height / 3))
        {
            this.component.addAttribute(new Attribute('-attribute: string', this.component));
        }
        else if (y > this.top + 2*(this.height / 3))
        {
            this.component.delete();
        }
        else
        {
            this.component.openProperties();
        }
        return this;
    }
    return null;
}