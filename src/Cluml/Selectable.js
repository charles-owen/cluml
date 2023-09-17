import vector, {Vector} from "./Utility/Vector";
import {Line} from "./Utility/Line";

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
            return new vector(this.x, this.y);
        },
        set: function (point) {
            this.x = point.x;
            this.y = point.y;
        }
    });

    this.moveX = 0;             // Position of the selectable while moving
    this.moveY = 0;

    this.selectedStyle = '#ff0000';
    this.unselectedStyle = '#000000';

    /**
     * Gets the relative position of this Selectable, relative to some other
     * Selectable.
     * @param relativeTo {Selectable}
     * @returns {Vector}
     */
    this.positionRelativeTo = function(relativeTo)
    {
        return Vector.add(relativeTo.position, this.position);
    }
};

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

Selectable.prototype.selectStyle = function (context, view) {
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
    this.moveX = this.x;
    this.moveY = this.y;
};

Selectable.prototype.move = function (dx, dy) {
    this.moveX += dx;
    this.moveY += dy;

    this.x = this.moveX;
    this.y = this.moveY;

    if (this.diagram !== null) {
        this.diagram.snapIt(this);
    }
};

Selectable.prototype.place = function (x, y) {
    this.moveX = x;
    this.moveY = y;
    this.x = this.moveX;
    this.y = this.moveY;

    if (this.diagram !== null) {
        this.diagram.snapIt(this);
    }
};

Selectable.prototype.delete = function () {
};
Selectable.prototype.drop = function () {
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
 * Returns the line that traces between the specified selectables.
 * @param from {Selectable}
 * @param to {Selectable}
 * @returns {Line}
 */
Selectable.lineBetween = function (from, to) {
    return new Line(from.position, to.position);
}

export default Selectable;