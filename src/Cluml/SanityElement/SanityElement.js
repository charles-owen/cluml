import { MainSingleton } from "../MainSingleton";
import Selectable, { CONTENT_FONT } from "../Selectable";
import Vector from "../Utility/Vector";
import {Rect} from "../Utility/Rect";

export class SanityElement extends Selectable {
    // region Fields
    /**
     * The string value of the sanity element.
     * @type {string}
     */
    elementValue = '';

    /**
     * @type {Selectable}
     */
    relativeTo;

    /**
     * Font of the text.
     * @type {string}
     */
    font = CONTENT_FONT

    /**
     * The alignment of the text.
     * @type {CanvasTextAlign}
     */
    textAlign = 'center';

    /**
     * Color to use if this passes the sanity check.
     * @type {string}
     */
    validColor = '#000';

    /**
     * Color to use if this fails the sanity check.
     * @type {string}
     */
    invalidColor = '#ff0000';

    /**
     * @type {TextMetrics}
     */
    #fontMetrics;
    // endregion

    // region Constructor
    /**
     * Creates a new SanityElement from the provided string.
     * @param {string} stringValue The string value.
     * @param {Selectable} relativeTo The selectable this is positioned relative
     * to.
     */
    constructor(stringValue, relativeTo) {
        super();

        if (relativeTo !== undefined) {
            this.relativeTo = relativeTo;
            this.drawOrder = relativeTo.drawOrder + 1;
        }

        this.elementValue = stringValue;

        // Run the sanity check to update the types.
        //this.processSanityCheck();
    }
    // endregion

    //region Sanity Check Specific
    /**
     * Processes the sanity check for this element.
     * @return {SanityErrorInfo[]} The list of errors, or an empty
     * list if there are none.
     */
    processSanityCheck() {
        return [];
    }
    //endregion

    //region Getters/Setters
    // get elementValue() {
    //     return this.elementValue;
    // }

    // set elementValue(value) {
    //     if (this.elementValue !== value) {
    //         this.elementValue = value;
    //         this.processSanityCheck();
    //         MainSingleton.singleton.redraw();
    //     }
    // }

    get absolutePosition() {
        if (this.relativeTo === undefined || this.relativeTo === null) {
            return this.position;
        } else {
            return Vector.add(this.position, this.relativeTo.position);
        }
    }

    set absolutePosition(value) {
        if (this.relativeTo === undefined || this.relativeTo === null) {
            this.position = value;
        } else {
            this.position = Vector.sub(value, this.relativeTo.position);
        }
    }
    // endregion

    /**
     * Modifies the context, changing the fill style to be either the valid or
     * invalid color, based on whether this SanityElement has errors.
     * <br/>-----<br/>
     * Usage:
     *
     * const oldColor = modifyContextFill(context);<br/>
     * thing.draw(context, view);<br/>
     * context.fillColor = oldColor;
     * @param context {RenderingContext}
     * @return {string}
     */
    modifyContextFill(context) {
        const oldColor = context.fillStyle;
        const errors = this.processSanityCheck();
        context.fillStyle = errors.length <= 0 ? this.validColor : this.invalidColor;

        return oldColor;
    }

    // region Selectable methods
    draw(context, view) {
        super.draw(context, view);
        const oldColor = context.fillStyle;

        const errors = this.processSanityCheck();
        context.fillStyle = errors.length <= 0 ? this.validColor : this.invalidColor;

        const pos = this.absolutePosition;

        this.drawText(context, this.elementValue, pos.x, pos.y, this.font, this.textAlign);

        this.#fontMetrics = context.measureText(this.elementValue);

        context.fillStyle = oldColor;

        // this.bounds();
    }

    bounds() {
        return this.minBounds();
    }

    minBounds() {
        if (this.#fontMetrics !== undefined) {
            const pos = this.absolutePosition;
            const max = new Vector(
                this.#fontMetrics.actualBoundingBoxRight + pos.x,
                this.#fontMetrics.actualBoundingBoxDescent + pos.y
            );
            const min = new Vector(
                -this.#fontMetrics.actualBoundingBoxLeft + pos.x,
                -this.#fontMetrics.actualBoundingBoxAscent + pos.y
            );

            return Rect.fromMinAndMax(min, max);
        } else {
            return new Rect(0, 0, 0, 0);
        }
    }
    //endregion

    //region Save/Loading
    /**
     * Gets an object that contains the serializable data of the sanity element.
     * @returns {{value: string, x: number, y: number}}
     */
    saveSanityElement() {
        return {
            value: this.elementValue,
            x: this.x,
            y: this.y
        };
    }

    /**
     * Saves multiple sanity elements into a structure that can be
     * added to a saving structure.
     * @param elements {Array<SanityElement>} Array of sanity elements.
     * @return {*}
     */
    static saveMultiple(elements) {
        return elements.map(
            (elem) => elem.saveSanityElement()
        );
    }

    /**
     *
     * @param {function} type The constructor for the SanityElement.
     * @param {{value: string, x: number, y: number}} sanitySaveObj The save object for the sanity element.
     * @param {Selectable} relativeTo The selectable this is positioned relative
     * to.
     * @returns {*}
     */
    static loadSanityElement(type, sanitySaveObj, relativeTo) {
        const elem = new type(sanitySaveObj.value, relativeTo);
        elem.x = sanitySaveObj.x;
        elem.y = sanitySaveObj.y;
        return elem;
    }

    /**
     *
     * @param type {function} Type of element.
     * @param name {string} Filename of element.
     * @param saveObj {*} The save object.
     * @param relativeTo {Selectable}
     * @return {*[]}
     */
    static loadMultiple(type, name, saveObj, relativeTo) {
        const elemObjs = saveObj[name];

        return elemObjs.map((e) => SanityElement.loadSanityElement(type, e, relativeTo));
    }
    //endregion

    //region Sanity Static Functions
    /**
     * Yields everything with the processSanityCheck function.
     * @return {Generator<SanityElement, void, SanityElement>}
     */
    static * getAllSanityElements() {

        const components = MainSingleton.singleton.allCurrentComponents;

        for (const component of components) {
            yield* this.#getForwarders(component);

            for (const property in component) {
                const propVal = component[property];

                if (propVal !== null && typeof propVal.processSanityCheck === 'function') {
                    yield propVal;
                }
            }
        }
    }

    static * #getForwarders(parent) {
        if (typeof parent.forwardSanityCheck === 'function') {
            // console.log("forwardSanityCheck: " + component.forwardSanityCheck);
            for (const element of parent.forwardSanityCheck()) {
                if (element != null) {
                    if (typeof element.processSanityCheck === 'function') {
                        // This can check sanity.
                        yield element;
                    }

                    if (typeof element.forwardSanityCheck === 'function') {
                        // Found another forwarder.
                        yield* this.#getForwarders(element);
                    }
                }
            }
        }
    }
    //endregion
}
