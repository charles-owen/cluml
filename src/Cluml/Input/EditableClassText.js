import {MainSingleton} from "../MainSingleton";

export const EditableClassText = function (component) {
    Object.defineProperty(this, '', {});
    this.component = component;
    this.x = 0;
    this.y = 0;
    this.font = "14px Times"
    this.text = "";
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.style.font = this.font;
    this.inputElement.style.position = 'absolute';
    this.inputElement.style.backgroundColor = '#e7e8b0';
    this.inputElement.defaultValue = this.text;
}

/**
 * Constructor
 * @type {EditableClassText}
 */
EditableClassText.prototype.constructor = EditableClassText;

EditableClassText.prototype.setCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
}

EditableClassText.prototype.setInputElementDimensions = function (top, left, width, height) {
    this.inputElement.style.top = top + "px";
    this.inputElement.style.left = left + "px";
    this.inputElement.style.width = width - 8 + "px";
    this.inputElement.style.height = height - 6 + "px";
}

/**
 * Draws the editable text to the canvas
 * @param context the context for drawing this editable text
 * @param view the view that this editable text will be drawn in
 * @param align the alignment of the editable text being drawn
 */
EditableClassText.prototype.drawText = function(context, view, align) {
    MainSingleton.currentTabDiv.append(this.inputElement);
    this.inputElement.focus();
}
