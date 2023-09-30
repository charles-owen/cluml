import {MainSingleton} from "../MainSingleton";

export class TextInput {
    /**
     * The size and position of this text input.
     */
    #dimensions;

    /**
     * Defines a basic text input.
     * @constructor
     * @param callback {function} A function with a single parameter. Will be called once value is set.
     * @param dimensions {Rect} Dimensions of this text input.
     * @param font {string} Font to use with the input.
     */
    constructor(callback, dimensions, font = "14px Times") {
        this.callback = callback;
        this.font = font;

        /**
         * The input element. You may edit this to add more styling data, for example.
         * @type {HTMLInputElement}
         */
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.autocomplete = 'on';
        this.inputElement.style.font = font;
        this.inputElement.style.position = 'absolute';

        this.dimensions = dimensions;

        this.inputElement.addEventListener('focusout', (event) => {
            callback(this.inputElement.value);
            this.inputElement.remove();
        });

        MainSingleton.currentTabDiv.append(this.inputElement);
    }

    /**
     * Gets the dimensions of this text input.
     * @return {Rect}
     */
    get dimensions() {
        return this.#dimensions;
    }

    /**
     * Sets the dimensions of this text input.
     * @param value {Rect}
     */
    set dimensions(value) {
        this.#dimensions = value;
        this.inputElement.style.top = value.top + "px";
        this.inputElement.style.left = value.left + "px";
        this.inputElement.style.width = (value.right - value.left) + "px";
        this.inputElement.style.height = (value.top - value.bottom) + "px";
    }
}