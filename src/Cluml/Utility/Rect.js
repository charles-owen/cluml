import Vector from "./Vector";
import {Line} from "./Line";

/**
 * A simple rectangle representation
 * @param left Left. If undefined, uses zero.
 * @param top Top. If undefined, uses zero.
 * @param right Right side. If undefined, uses this.left
 * @param bottom Bottom side. If undefined, used this.top.
 * @constructor
 */
export const Rect = function (left = 0, top = 0, right = 0, bottom = 0) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;

    Object.defineProperty(this, 'max', {
        /**
         * The maximum corner of this rectangle.
         * @returns {Vector}
         */
        get: function () {
            return new Vector(this.right, this.top);
        }
    })

    Object.defineProperty(this, 'min', {
        /**
         * The minimum corner of this rectangle.
         * @returns {Vector}
         */
        get: function () {
            return new Vector(this.left, this.bottom);
        }
    })
};

Rect.prototype.setRightBottom = function (right, bottom) {
    this.right = right;
    this.bottom = bottom;
};

/**
 * Ensure left <= right and top <= bottom for the rectangle
 */
Rect.prototype.normalize = function () {
    if (this.left > this.right) {
        let t = this.left;
        this.left = this.right;
        this.right = t;
    }

    if (this.top > this.bottom) {
        let t = this.top;
        this.top = this.bottom;
        this.bottom = t;
    }
};

Rect.prototype.isEmpty = function () {
    return this.left >= this.right || this.top >= this.bottom;
};

Rect.prototype.contains = function (x, y) {
    return x >= this.left && x <= this.right &&
        y >= this.bottom && y <= this.top;
};

/**
 * Expand this rect to include all of some other rect.
 * @param rect Other rect to include
 */
Rect.prototype.expand = function (rect) {
    if (rect.left < this.left) {
        this.left = rect.left;
    }

    if (rect.right > this.right) {
        this.right = rect.right;
    }

    if (rect.top < this.top) {
        this.top = rect.top;
    }

    if (rect.bottom > this.bottom) {
        this.bottom = rect.bottom;
    }
}

/**
 * Expand this rect to include a given point.
 * @param x
 * @param y
 */
Rect.prototype.expandXY = function (x, y) {
    if (x < this.left) {
        this.left = x;
    }

    if (x > this.right) {
        this.right = x;
    }

    if (y < this.top) {
        this.top = y;
    }

    if (y > this.bottom) {
        this.bottom = y;
    }
}

/**
 * Moves the rectangle.
 * @param x {number}
 * @param y {number}
 */
Rect.prototype.moveXY = function (x, y) {
    this.left += x;
    this.right += x;
    this.top += y;
    this.bottom += y;
}

/**
 * Returns a side of the rectangle. The points that make up each line will be
 * ordered in a clockwise fashion.
 * The north side is [0, 1), east is [1, 2), south is [2, 3),
 * west is [3, 4). The decimal value determines what percent
 * of the side we are on, with 0.0 representing the
 * counter-clockwise most side and 1.0 representing the
 * clockwise most side.
 * @param side
 * @return {Line}
 */
Rect.prototype.getSide = function (side) {
    const rounded = Math.floor(side) % 4;
    switch (rounded) {
        case 0:
            return new Line(
                new Vector(this.left, this.top),
                new Vector(this.right, this.top)
            );
        case 1:
            return new Line(
                new Vector(this.right, this.top),
                new Vector(this.right, this.bottom)
            );
        case 2:
            return new Line(
                new Vector(this.right, this.bottom),
                new Vector(this.left, this.bottom)
            );
        case 3:
            return new Line(
                new Vector(this.left, this.bottom),
                new Vector(this.left, this.top)
            );
    }

    throw new Error(`Value of side ${side} (rounded to ${rounded}) is invalid.`);
}

/**
 * Returns a point that lies on the perimeter of the rectangle.
 * t determines how far along the perimeter to return the point.
 * The north side is [0, 1), east is [1, 2), south is [2, 3),
 * west is [3, 4). The decimal value determines what percent
 * of the side we are on, with 0.0 representing the
 * counter-clockwise most side and 1.0 representing the
 * clockwise most side.
 * @param t {number}
 * @return {Vector}
 */
Rect.prototype.pointOnEdge = function (t) {
    const line = this.getSide(t);
    return line.pointOnLine(t % 1);
}

/**
 * Returns the closest side percentage to point.
 * Each side of the rectangle is labeled with a value range.
 * The north side is [0, 1), east is [1, 2), south is [2, 3),
 * west is [3, 4). The decimal value determines what percent
 * of the side we are on, with 0.0 representing the
 * counter-clockwise most side and 1.0 representing the
 * clockwise most side.
 * @param point {Vector}
 * @return {{side: number, atPoint: Vector, distance: number}}
 */
Rect.prototype.getClosestSideT = function (point) {
    let closestSide = -1;
    let closestPoint;
    let smallestDistance = Infinity;

    for (let i = 0; i < 4; i++) {
        const side = this.getSide(i);
        const sideNDistance = side.pointNearest(point);

        if (smallestDistance > sideNDistance.distance) {
            smallestDistance = sideNDistance.distance;
            closestPoint = sideNDistance.pointOnLine;
            closestSide = sideNDistance.t + i;
        }
    }

    return {
        side: closestSide,
        atPoint: closestPoint,
        distance: smallestDistance
    }
}

/**
 * Draws this rectangle in context.
 * @param context {CanvasRenderingContext2D} Display context
 */
Rect.prototype.fillRect = function (context) {
    context.fillRect(
        this.left, this.top,
        this.right - this.left,
        this.bottom - this.top
    );
}

/**
 * Creates a context rectangle.
 * @param context {CanvasRenderingContext2D} Display context
 */
Rect.prototype.contextRect = function (context) {
    context.rect(
        this.left, this.top,
        this.right - this.left,
        this.bottom - this.top
    );
}

// region Static Constructors
/**
 * Creates a new rectangle from a center and a size (width, height).
 * @param center {Vector}
 * @param size {Vector}
 * @return {Rect}
 */
Rect.fromCenterAndSize = function (center, size) {
    return Rect.fromCenterAndExtents(center, Vector.divideBy(size, 2));
}

/**
 * Creates a new rectangle from a center and an extents (which is half
 * of its size).
 * @param center {Vector}
 * @param extents {Vector}
 * @returns {Rect}
 */
Rect.fromCenterAndExtents = function (center, extents) {
    return new Rect(
        center.x - extents.x,
        center.y + extents.y,
        center.x + extents.x,
        center.y - extents.y,
    )
}

/**
 * Creates a new rectangle from a top point and a size (width, height).
 * @param topPoint {Vector}
 * @param size {Vector}
 * @returns {Rect}
 */
Rect.fromTopAndSize = function (topPoint, size) {
    return this.fromTopAndExtents(
        topPoint, Vector.scale(size, 0.5)
    )
}

/**
 * Creates a new rectangle from a top point and an extents (which is half
 * of its size).
 * @param topPoint {Vector}
 * @param extents {Vector}
 * @returns {Rect}
 */
Rect.fromTopAndExtents = function (topPoint, extents) {
    return this.fromCenterAndExtents(
        new Vector(topPoint.x, topPoint.y + extents.y),
        extents
    )
}

/**
 * Creates a new rectangle from the minimum and maximum corners.
 * @param min {Vector}
 * @param max {Vector}
 * @returns {Rect}
 */
Rect.fromMinAndMax = function (min, max) {
    return new Rect(
        min.x, max.y,
        max.x, min.y
    )
}
// endregion
