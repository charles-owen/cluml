import Selectable, {CONTENT_FONT} from "../Selectable";
import {Rect} from "../Utility/Rect";
import Vector from "../Utility/Vector";

export class SanityElementDrawer extends Selectable {
    //region Fields
    /**
     * @type {SanityElement}
     */
    encapsulatedElement;

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
     * Color to use if encapsulatedElement passes the sanity check.
     * @type {string}
     */
    validColor = '#000';

    /**
     * Color to use if encapsulatedElement fails the sanity check.
     * @type {string}
     */
    invalidColor = '#ff0000';

    /**
     * @type {TextMetrics}
     */
    #fontMetrics;
    //endregion

    /**
     * A class that encapsulates a SanityElement, allowing
     * us to draw the elementValue of the SanityElement.
     * @param sanityElement {SanityElement}
     * @param relativeTo {Selectable}
     */
    constructor(sanityElement, relativeTo) {
        super();
        this.encapsulatedElement = sanityElement;
        this.relativeTo = relativeTo;
    }

    get relativePosition() {
        if (this.relativeTo === undefined || this.relativeTo === null) {
            return this.position;
        } else {
            return Vector.add(this.position, this.relativeTo.position);
        }
    }

    /**
     * The value of the encapsulated element.
     * @return {string} Value of the element value.
     */
    get elementValue() {
        return this.encapsulatedElement.elementValue;
    }

    /**
     * The value of the encapsulated element.
     * @param value {string}
     */
    set elementValue(value) {
        this.encapsulatedElement.elementValue = value;
    }

    /**
     * Draws this thing.
     * @param context {CanvasRenderingContext2D}
     * @param view {View}
     */
    draw(context, view) {
        super.draw(context, view);
        const oldColor = context.strokeStyle;

        const errors = this.encapsulatedElement.processSanityCheck();
        context.fillStyle = errors.length <= 0 ? this.validColor : this.invalidColor;

        const pos = Vector.sub(this.relativePosition, this.position);

        this.drawText(context, this.encapsulatedElement.elementValue, pos.x, pos.y, this.font);

        this.#fontMetrics = context.measureText(this.font);

        context.fillStyle = oldColor;

        this.bounds();
    }

    bounds() {
        if (this.#fontMetrics !== undefined) {
            const pos = this.relativePosition;
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

    /**
     * Yields an object that implements either the functions
     * processSanityCheck() or forwardSanityCheck().
     * Can also yield an object that contains both.
     *
     * @return {Generator<*, void, *>}
     */
    * forwardSanityCheck() {
        yield this.encapsulatedElement;
    }
}
