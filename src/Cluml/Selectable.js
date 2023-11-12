import vector, {Vector} from "./Utility/Vector";
import {Line} from "./Utility/Line";
import {Rect} from "./Utility/Rect";

//region Constants
/**
 * The default font for the drawName function.
 * @type {string}
 */
export const NAME_FONT = "14px Times";

/**
 * The default font for italics
 * @type {string}
 */
export const ITALICS_FONT = "italic 14px Times";

/**
 * The default font for the drawText function.
 * @type {string}
 */
export const CONTENT_FONT = "14px Times";

/**
 * If true, then show the bounds of the component.
 * @type {boolean}
 */
export const DEBUG_BOUNDS = false;
//endregion

/**
 * Base object for anything that is draggable
 * using the mouse.
 * @constructor
 */
export const Selectable = function () {
    this.diagram = null;        // Diagram this selectable is associated with
    this.x = 0;                 // Position of the selectable
    this.y = 0;

    Object.defineProperty(this, 'position', {
        get: function () {
            return new Vector(this.x, this.y);
        },
        set: function (point) {
            this.x = point.x;
            this.y = point.y;
        }
    });

    Object.defineProperty(this, 'moveDelta', {
        /**
         * Returns the move delta.
         * @return {Vector}
         */
        get: function () {
            return new Vector(this.moveX, this.moveY);
        },
        /**
         * Sets the move delta.
         * @param point {Vector}
         */
        set: function (point) {
            this.moveY = point.y;
            this.moveX = point.x;
        }
    })

    this.moveX = 0;             // Position of the selectable while moving
    this.moveY = 0;

    this.placedOnCanvas = false;

    this.movable = true;

    this.selectedStyle = '#ff0000';
    this.unselectedStyle = '#000000';
};

/**
 * Order of which the selectables will be drawn. Larger values
 * will be drawn on top of smaller ones.
 * @type {number}
 */
Selectable.prototype.drawOrder = 0;

Selectable.prototype.copyFrom = function (selectable) {
    this.x = selectable.x;
    this.y = selectable.y;
    this.moveX = selectable.moveX;
    this.moveY = selectable.moveY;
};

/**
 * Is this something that is always selected alone (no multiple selected)
 * @returns {boolean}
 */
Selectable.prototype.single = function () {
    return false;
};

/**
 * Evaluates whether other is selected.
 * @param other {Selectable}
 * @return {boolean}
 */
Selectable.prototype.isSelected = function (other) {
    return this === other;
}

Selectable.prototype.selectStyle = function (context, view) {
    context.lineCap = 'round';
    context.lineJoin = 'round';

    if (view.selection.isSelected(this)) {
        context.strokeStyle = this.selectedStyle;
        context.fillStyle = this.selectedStyle;
        return true;
    } else {
        context.strokeStyle = this.unselectedStyle;
        context.fillStyle = this.unselectedStyle;
        return false;
    }
};

/**
 * Start of the dragging process
 */
Selectable.prototype.grab = function () {
    this.movable = true;
    this.moveX = 0;
    this.moveY = 0;
};

/**
 * Called when a selectable is right-clicked.
 * @param x {number}
 * @param y {number}
 */
Selectable.prototype.rightClick = function (x, y) {

}

/**
 * Called when a double click is detected.
 * @param x {number}
 * @param y {number}
 */
Selectable.prototype.doubleClick = function (x, y) {

}

Selectable.prototype.enableAddPopup = function(enable) {

}

/**
 * Moves this selectable.
 * @param dx {number} The cursor delta x position.
 * @param dy {number} The cursor delta y position.
 * @param x {number} The cursor x position.
 * @param y {number} The cursor y position.
 */
Selectable.prototype.move = function (dx, dy, x, y) {
    if(this.movable) {
        this.moveX += dx;
        this.moveY += dy;

        // this.x += dx;
        // this.y += dy;

        this.x = x;
        this.y = y;

        if (this.diagram !== null) {
            this.diagram.snapIt(this);
        }
    }
};

// Selectable.prototype.place = function (x, y) {
//     this.moveX = x;
//     this.moveY = y;
//     this.x = this.moveX;
//     this.y = this.moveY;
//
//     if (this.diagram !== null) {
//         this.diagram.snapIt(this);
//     }
// };

Selectable.prototype.delete = function () {
};
/**
 * Called when this selectable is dropped.
 */
Selectable.prototype.drop = function () {
    this.movable = false;
};

/**
 * A selected connection that we try to drag will create
 * a new bending point. This is overridden in the Connection
 * object.
 * @returns null
 */
Selectable.prototype.spawn = function (x, y) {
    return null;
};

/**
 * Compute a bounding box that completely contains the component
 * @returns {Rect}
 */
Selectable.prototype.bounds = function () {
    return new Rect(0, 0, 0, 0);
}

/**
 * Draw selectable object.
 *
 * Default version for simple box objects
 * @param context Display context
 * @param view View object
 */
Selectable.prototype.draw = function (context, view) {
    if (DEBUG_BOUNDS) {
        context.fillStyle = "rgba(231,89,89,0.25)";
        this.bounds().fillRect(context);
    }
}

//region Helpers
//region Drawing Functions
/**
 * Draw text on a component
 * @param context {CanvasRenderingContext2D} Context to draw on
 * @param text {string} Text to draw
 * @param x {number} X location
 * @param y {number} Y location
 * @param font {string} Optional font to use
 * @param textAlign {CanvasTextAlign} The text align of the text.
 */
Selectable.prototype.drawText = function (context, text, x, y,
    font = CONTENT_FONT, textAlign = 'center') {
    context.beginPath();
    context.font = font !== undefined ? font : CONTENT_FONT;
    context.textAlign = textAlign;
    context.fillText(text, this.x + x, this.y + y);
    context.stroke();
}

/**
 * Many diagrams are a trapezoid. This is a function to draw that trapezoid
 * @param context Context to draw on
 * @param indentL {number} Top/bottom indent size for left side (default = 0)
 * @param indentR {number} Top/bottom indent size for right size (default = 20)
 * @param width {number} Width of the trapezoid.
 * @param height {number} Height of the trapezoid.
 */
Selectable.prototype.drawTrapezoid = function (context, width, height, indentL, indentR) {
    if (indentL === undefined) {
        indentL = 0;
    }

    if (indentR === undefined) {
        indentR = 20;
    }

    const leftX = this.x - width / 2 - 0.5;
    const rightX = this.x + width / 2 + 0.5;
    const topY = this.y - height / 2 - 0.5;
    const botY = this.y + height / 2 + 0.5;

    context.fillStyle = '#ffffff';
    // Left side
    context.beginPath();
    context.moveTo(leftX, topY + indentL);
    context.lineTo(leftX, botY - indentL);

    // Bottom
    context.lineTo(rightX, botY - indentR);

    // Right side
    context.lineTo(rightX, topY + indentR);

    // Top
    context.lineTo(leftX, topY + indentL);

    context.fill();

    context.stroke();
}

/**
 * Draw a jagged (stair-step) line from x1,y1 to x2,y2
 * @param context Context to draw on
 * @param x1 Starting x
 * @param y1 Starting y
 * @param x2 Ending x
 * @param y2 Ending y
 * @param t Percentage of say from x1 to x2 the vertical line is
 */
Selectable.prototype.jaggedLine = function (context, x1, y1, x2, y2, t) {
    const xh = Math.round(x1 + (x2 - x1) * t) + 0.5;
    y1 += 0.5;
    y2 += 0.5;

    context.moveTo(x1, y1);
    context.lineTo(xh, y1);
    context.lineTo(xh, y2)
    context.lineTo(x2, y2);
    context.stroke();
}
//endregion


/**
 * Returns the line that traces between the specified selectables.
 * @param from {Selectable}
 * @param to {Selectable}
 * @returns {Line}
 */
Selectable.lineBetween = function (from, to) {
    return new Line(from.position, to.position);
}
//endregion

export default Selectable;
