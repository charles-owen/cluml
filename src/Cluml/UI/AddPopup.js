import {Class} from "../Components/Class";

export const AddPopup = function (component) {
    Object.defineProperty(this, 'popup', {

    });
    this.component = component;
    this.xOffset = 50;
    this.yOffset = 155;
    this.margin = 5;

    this.height = 60;
    this.width = 150;

    this.x = 0;
    this.y = 0;
};
AddPopup.prototype.constructor = AddPopup;

AddPopup.prototype.draw = function (context, view, x, y) {
    this.x = x + this.xOffset + (this.width / 2);
    this.y = y + this.yOffset - (this.height / 2);

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
        y+this.yOffset-10-(this.height/2),this.width);

    // Draw Divider
    context.beginPath();
    context.moveTo(x+this.xOffset, this.y);
    context.lineTo(x+this.xOffset+this.width, this.y);
    context.stroke();

    // Delete text
    context.fillText("Delete",
        x+this.xOffset+this.margin,
        y+this.yOffset-10,this.width);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {AddPopup|null}
 */
AddPopup.prototype.touch = function (x, y) {
    // this.x & this.y are the very middle of the box
    if (x >= this.x - this.width / 2 &&
        x <= this.x + this.width / 2 &&
        y >= this.y - this.height / 2 &&
        y <= this.y + this.height / 2) {

        if (y < this.y)
        {
            this.component.addAttribute("-attribute : ");
        }
        else
        {
            this.component.delete();
        }
        return this;
    }
    return null;
}