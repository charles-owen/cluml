export const EditingPopup = function (component) {
    Object.defineProperty(this, 'popup', {

    });
    this.component = component;
    this.margin = 5;

    this.height = 35;
    this.width = 200;

    this.x = 0;
    this.y = 0;
};

EditingPopup.prototype.constructor = EditingPopup;

EditingPopup.prototype.draw = function(context, view, x, y) {
    this.x = x;
    this.y = y;

    context.beginPath();
    context.fillStyle = "#000000";
    context.strokeStyle = "#ffffff";

    context.rect(this.x - this.width/2, this.y, this.width, this.height);

    context.fill();
    context.stroke();
}