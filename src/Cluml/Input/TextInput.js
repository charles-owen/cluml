import {MainSingleton} from "../MainSingleton";

export class TextInput {
    /**
     * The size and position of this text input.
     */
    #dimensions;

    /**
     * The open text inputs.
     * @type {TextInput[]}
     */
    static #instances = [];

    /**
     * The initial value.
     * @type {string}
     */
    #initialValue;

    /**
     * Defines a basic text input.
     * @constructor
     * @param dimensions {Rect} Dimensions of this text input.
     * @param initialValue {string} The original value of the input, if any.
     * @param font {string} Font to use with the input.
     * @param onExit {function} A function with a single parameter
     * (the value of the text box). Will be called once focus is lost.
     * @param onNext {function} A function with a single parameter
     * (the value of the text box). Will be called if the user presses
     * Enter or Tab. Called after onExit.
     */
    constructor(onExit, onNext, dimensions, initialValue= '', font = "14px Times") {
        this.font = font;
        this.#initialValue = initialValue;

        /**
         * The input element. You may edit this to add more styling data, for example.
         * @type {HTMLInputElement}
         */
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.autocomplete = 'on';
        this.inputElement.style.font = font;
        this.inputElement.style.position = 'absolute';
        this.inputElement.value = initialValue;

        this.dimensions = dimensions;

        this.inputElement.addEventListener('focusout', (event) => {
            onExit(this.inputElement.value);
            this.close();
        });

        this.inputElement.addEventListener('onkeypress', (event) => {
            if (event.key === 'Enter' || event.key === 'Tab') {
                onExit(this.inputElement.value);
                this.close();
                onNext(this.inputElement.value);
            }
        });

        MainSingleton.currentTabDiv.append(this.inputElement);
        TextInput.#instances.push(this);
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

    close() {
        if (this.#initialValue !== this.inputElement.value) {
            // Value has been changed.
            MainSingleton.singleton.backup();
        }

        this.inputElement.remove();
    }

    static closeAllInputs() {
        for (const instance of TextInput.#instances) {
            instance.close();
        }

        TextInput.#instances = [];
    }
}
