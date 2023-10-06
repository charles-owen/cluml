import {MainSingleton} from "../MainSingleton";

export class TextInput {
    /**
     * The open text inputs.
     * @type {TextInput[]}
     */
    static #instances = [];
    /**
     * The size and position of this text input.
     */
    #dimensions;
    /**
     * The initial value.
     * @type {string}
     */
    #initialValue;

    #closed = false;

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
    constructor(onExit, onNext, dimensions, initialValue = '', font = "14px Times") {
        this.font = font;
        this.#initialValue = initialValue;

        /**
         * The input element. You may edit this to add more styling data, for example.
         * @type {HTMLInputElement}
         */
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.autocomplete = 'on';
        this.inputElement.style.padding = '0';
        this.inputElement.style.margin = '0';
        this.inputElement.style.border = 'none';
        this.inputElement.style.font = font;
        this.inputElement.style.position = 'absolute';
        this.inputElement.value = initialValue;

        this.dimensions = dimensions;

        this.onUnfocusClose = (event) => {
            if (!this.#closed) {
                this.#closed = true;

                if (onExit !== undefined) {
                    onExit(this.inputElement.value);
                }

                if (this.#initialValue !== this.inputElement.value) {
                    // Value has been changed.
                    MainSingleton.singleton.backup();

                    MainSingleton.singleton.currentView.draw();
                }

                this.inputElement.remove();
            }
        };

        this.onTabbedClose = (event) => {
            if (!this.#closed) {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    this.onUnfocusClose(event);
                    if (onNext !== undefined) {
                        onNext(this.inputElement.value);
                    }
                }
            }
        }

        this.inputElement.addEventListener('focusout', this.onUnfocusClose);

        this.inputElement.addEventListener('keypress', this.onTabbedClose);

        MainSingleton.currentTabDiv.append(this.inputElement);

        this.inputElement.focus();
        this.inputElement.select();

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
        const height = value.top - value.bottom;
        this.#dimensions = value;

        this.inputElement.style.top = value.top - height + "px";
        this.inputElement.style.left = value.left + "px";
        this.inputElement.style.width = (value.right - value.left) + "px";
        this.inputElement.style.height = height + "px";
    }

    //region Static Constructor Functions
    /**
     * Creates a text input from the provided SanityElement.
     * @param target {*}
     * @param sanityElement {SanityElement}
     * @param getNext {function(target : *, sanityElement : SanityElement)}
     * @return {TextInput}
     */
    static createFromSanityElement(target, sanityElement, getNext) {
        return new TextInput(
            (value) => {
                sanityElement.elementValue = value;
            },
            (value) => {
                if (getNext !== undefined) {
                    const next = getNext(target, sanityElement);

                    if (next !== undefined && next !== null) {
                        TextInput.createFromSanityElement(target, next, getNext);
                    }
                }
            },
            sanityElement.bounds(),
            sanityElement.elementValue
        );
    }

    /**
     * Tries to create a text input from the provided mouse input and SanityElement.
     * @param mouseX {number}
     * @param mouseY {number}
     * @param sanityElement {SanityElement}
     * @param next
     * @return {TextInput}
     */
    static createFromMouseClick(mouseX, mouseY, sanityElement, next) {
        const bounds = sanityElement.bounds();

        if (bounds.contains(mouseX, mouseY)) {
            let onNext = undefined;
            // if (next !== undefined) {
            //     onNext = (value) => {
            //         TextInput.createFromSanityElement(next);
            //     };
            // }

            return new TextInput(
                (value) => {
                    sanityElement.elementValue = value;
                },
                onNext,
                bounds,
                sanityElement.elementValue
            );
        }

        return undefined;
    }
    //endregion

    static closeAllInputs() {
        for (const instance of TextInput.#instances) {
            instance.onUnfocusClose(undefined);
        }

        TextInput.#instances = [];
    }
}
