import {Class} from "../Components/Class";

export const AddPopup = function (component) {
    Object.defineProperty(this, 'popup', {

    });
    this.component = component;
    this.xOffset = 50;
    this.yOffset = 55;

    this.height = 60;
    this.width = 150;
};
AddPopup.prototype.constructor = AddPopup;

AddPopup.prototype.draw = function (context, view, x, y) {
    context.beginPath();
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#000000";

    context.rect(
        x+this.xOffset,
        y-this.yOffset,
        this.width, this.height);

    context.fill();
    context.stroke();

    context.fillStyle = "#000000";
    context.textAlign = "left"
    context.fillText("Add",
        x+this.xOffset+5,
        y-35,100);

    context.beginPath(); // Start a new path
    context.moveTo(x+this.xOffset, y-22); // Move the pen to (30, 50)
    context.lineTo(x+this.xOffset+150,
        y-22);
    context.stroke();

    context.fillText("Delete",
        x+this.xOffset+5,
        y-4,100);
}