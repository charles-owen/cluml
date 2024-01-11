import Side from "./Side";

/**
 * General purpose object for 2D vectors.
 *
 * Points are represented with x,y properties:
 * var p = {x: 23, y: -7.3};
 * @param x {number}
 * @param y {number}
 * @constructor
 */
export const Vector = function (x, y) {
    /**
     * The x component.
     * @type {number}
     */
    this.x = x;

    /**
     * The y component.
     * @type {number}
     */
    this.y = y;
}

/**
 * Returns the magnitude of this vector.
 * @return {number} The magnitude.
 */
Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

/**
 * Normalize a vector
 */
Vector.prototype.normalize = function () {
    this.divide(this.magnitude());
};

/**
 * Returns a normalized vector.
 * @param vector {Vector}
 * @return {Vector}
 */
Vector.normalize = function (vector) {
    const len = vector.magnitude();
    return new Vector(vector.x / len, vector.y / len);
};

/**
 * Multiplies each component.
 * @param multiplier {number}
 */
Vector.prototype.multiply = function (multiplier) {
    this.x *= multiplier;
    this.y *= multiplier;
}

/**
 * Returns a new vector whose components are multiplied.
 * @param vector {Vector}
 * @param multiplier {number}
 * @return {Vector}
 */
Vector.multiplyBy = function (vector, multiplier) {
    return new Vector(vector.x * multiplier, vector.y * multiplier);
}

/**
 * Divides each component.
 * @param divisor {number}
 */
Vector.prototype.divide = function (divisor) {
    this.x *= divisor;
    this.y *= divisor;
}

/**
 * Returns a new vector whose components are divided.
 * @param vector {Vector}
 * @param divisor {number}
 * @return {Vector}
 */
Vector.divideBy = function (vector, divisor) {
    return new Vector(vector.x / divisor, vector.y / divisor);
}

/**
 * Rotate a vector by some angle
 * @param vector Vector to rotate
 * @param angle Angle rotate by (radians)
 * @returns {Vector} New vector result
 */
Vector.rotate = function (vector, angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Vector(c * vector.x - s * vector.y,
        s * vector.x + c * vector.y);
};

/**
 * Compute the nearest distance to a line defined
 * a ax + by + c.
 * @param p Vector
 * @param a scalar
 * @param b scalar
 * @param c scalar
 */
Vector.distanceToLine = function (p, a, b, c) {
    if (a === 0) {
        // Horizontal line
        return Math.abs((b * p.y + c) / b);
    } else if (b === 0) {
        // Vertical line
        return Math.abs((a * p.x + c) / a);
    } else {
        return Math.abs(a * p.x + b * p.y + c) / Math.sqrt(a * a + b * b);
    }
};

/**
 * Compute the nearest distance to a line defined
 * by two points
 * @param p Vector
 * @param p1 First point (Vector)
 * @param p2 Second point (Vector)
 */
Vector.distanceToLineP2 = function (p, p1, p2) {
    return Vector.distanceToLine(p,
        (p1.y - p2.y), (p2.x - p1.x), (p1.x * p2.y - p2.x * p1.y));
};

/**
 * Compute the nearest point on a line defined
 * a ax + by + c.
 * @param p Vector
 * @param a
 * @param b
 * @param c
 */
Vector.nearestOnLine = function (p, a, b, c) {
    if (a === 0) {
        // Horizontal line
        return {x: p.x, y: -c / b};
    } else if (b === 0) {
        // Vertical line
        return {x: -c / a, y: p.y};
    } else {
        return {
            x: (b * (b * p.x - a * p.y) - a * c) / (a * a + b * b),
            y: (a * (-b * p.x + a * p.y) - b * c) / (a * a + b * b)
        }
    }
};

/**
 * Compute the nearest point on a line defined
 * using two points p1, p2.
 * @param p Vector
 * @param p1
 * @param p2
 * @returns {{x, y}}
 */
Vector.nearestOnLineP2 = function (p, p1, p2) {
    return Vector.nearestOnLine(p,
        (p1.y - p2.y), (p2.x - p1.x), (p1.x * p2.y - p2.x * p1.y));
};

/**
 * For the line segment [p1, p2], compute the t value.
 * t=0 for p1, t=1 for p2, t=[0,1] is on the line segment.
 * @param p Vector
 * @param p1
 * @param p2
 */
Vector.computeT = function (p, p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    if (Math.abs(dx) > Math.abs(dy)) {
        // Line is more horizontal than vertical
        return (p.x - p1.x) / dx;
    } else {
        return (p.y - p1.y) / dy;
    }
};

/**
 * Compute distance between two points.
 * @param p1 {Vector}
 * @param p2 {Vector}
 */
Vector.distance = function (p1, p2) {
    const x = p2.x - p1.x;
    const y = p2.y - p1.y;
    return Math.sqrt(x * x + y * y);
};

/**
 * Determine the distance from a point to the nearest
 * location on a line segement.
 * @param p Point to test (Vector)
 * @param p1
 * @param p2
 * @return Object with: d: distance, p (x,y) nearest point.
 */
Vector.distanceToLineSegment = function (p, p1, p2) {
    // What is the nearest point on the line through
    // p1 and p2?
    var n = Vector.nearestOnLineP2(p, p1, p2);

    // Is n in the line segment?
    var t = Vector.computeT(n, p1, p2);
    if (t >= 0 && t <= 1) {
        return {d: Vector.distance(p, n), p: n};
    }

    // Determine nearest end point
    var d1 = Vector.distance(p, p1);
    var d2 = Vector.distance(p, p2);
    if (d1 < d2) {
        return {d: d1, p: p1};
    } else {
        return {d: d2, p: p2};
    }
};

/**
 * Adds two vectors together and returns the result.
 * @param v1 {Vector} first vector.
 * @param v2 {Vector} second vector;
 */
Vector.add = function (v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
}

/**
 * Subtracts v2 from v1 (calculates v1 - v2) and returns the result.
 * @param v1 {Vector} first vector.
 * @param v2 {Vector} second vector;
 */
Vector.sub = function (v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
}

/**
 * Negates all diagrams of v and returns the result.
 * @param v {Vector}
 */
Vector.neg = function (v) {
    return new Vector(-v.x, -v.y);
}

/**
 * Multiples all diagrams of v by a scaler and returns the result.
 * @param v {Vector}
 * @param s {number}
 * @return {Vector}
 */
Vector.scale = function (v, s) {
    return new Vector(v.x * s, v.y * s);
}

/**
 * Returns the dot product of the two vectors.
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {number} The dot product.
 */
Vector.dot = function (v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
}

/**
 *
 * @param vectors {Vector}
 * @returns {Vector}
 */
Vector.minComponents = function (...vectors) {
    const x = vectors.map((v) => v.x);
    const y = vectors.map((v) => v.y);
    return new Vector(
        Math.min(...x),
        Math.min(...y)
    );
}

/**
 *
 * @param vectors {Vector}
 * @returns {Vector}
 */
Vector.maxComponents = function (...vectors) {
    const x = vectors.map((v) => v.x);
    const y = vectors.map((v) => v.y);
    return new Vector(
        Math.max(...x),
        Math.max(...y)
    );
}

/**
 * Gets the major cardinal direction, that is, the largest
 * component of the difference between from and to.
 * @param from {Vector} Starting point.
 * @param to {Vector} Ending point.
 * @return {number}
 */
Vector.majorCardinalDirection = function (from, to) {
    const diff = Vector.sub(to, from);

    if (Math.abs(diff.x) >= Math.abs(diff.y)) {
        return diff.x > 0 ? Side.Right : Side.Left;
    } else {
        return diff.y > 0 ? Side.Top : Side.Bottom
    }
}

export default Vector;

