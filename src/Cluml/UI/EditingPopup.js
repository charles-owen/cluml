export const EditingPopup = function (component) {
    Object.defineProperty(this, 'popup', {

    });
    this.component = component;
    this.margin = 5;

    this.height = 35;
    this.width = 200;

    this.x = component.lastSelectedX;
    this.y = component.lastSelectedY;
};

/**
 * Constructor
 * @type {EditingPopup}
 */
EditingPopup.prototype.constructor = EditingPopup;

/**
 * Draw function for the editing popup over the class name
 * @param context the context needed to draw this popup
 * @param view the view this popup will be drawn in
 * @param bounds the bounds of the class' name box
 */
EditingPopup.prototype.drawNameEdit = function(context, view, bounds) {
    context.beginPath();
    context.fillStyle = "#000000";
    context.strokeStyle = "#ffffff";
    bounds.contextRect(context);
    context.fill();
    context.stroke();
}

/**
 * Draw function for the editing popup over the attributes/operations of the class
 * @param context the context needed to draw this popup
 * @param view the view this popup will be drawn in
 * @param x the x value of this popup rectangle
 * @param y the y value of this popup rectangle
 * @param width the width of this popup rectangle
 * @param height the height of this popup rectangle
 */
EditingPopup.prototype.drawAttributionEdit = function(context, view, x, y, width, height) {
    context.beginPath();
    context.fillStyle = "#000000";
    context.strokeStyle = "#ffffff";
    context.rect(x, y, width, height);
    context.fill();
    context.stroke();
}

EditingPopup.prototype.touch = function(x, y) {
    if (x >= this.x - this.width/2 &&
        x <= this.x + this.width/2 &&
        y >= this.y - this.height/2 &&
        y <= this.y + this.height/2) {
        return this;
    }
    return null;
}