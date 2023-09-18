/**
 * Defines a basic text input.
 * @constructor
 * @param callback {function} A function with a single parameter. Will be called once value is set.
 * @param dimensions {Rect} Dimensions of this text input.
 * @param font {string} Font to use with the input.
 */
export const TextInput = function (callback, dimensions, font = "14px Times") {
    // this.callback = callback;
    // this.dimensions = dimensions;
    // this.font = font;

    /**
     * The input element. You may edit this to add more styling data, for example.
     * @type {HTMLInputElement}
     */
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.autocomplete = 'on';
    this.inputElement.style.font = this.font;
    this.inputElement.style.position = 'absolute';
    this.inputElement.style.top = dimensions.top + "px";
    this.inputElement.style.left = dimensions.left + "px";
    this.inputElement.style.width = (dimensions.right - dimensions.left) + "px";
    this.inputElement.style.height = (dimensions.top - dimensions.bottom) + "px";

    this.inputElement.addEventListener('focusout', (event) => {
        callback(this.inputElement.value);
        this.inputElement.remove();
    });
}