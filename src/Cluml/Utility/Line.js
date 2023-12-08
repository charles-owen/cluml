import Vector from "./Vector";

/**
 * A simple line representation.
 * @param from {Vector} Start point of the line.
 * @param to {Vector} End point of the line.
 * @constructor
 */
export const Line = function (from, to) {
    this.from = from;
    this.to = to;
}

/**
 * Creates a line from numerical coordinates.
 * @param x1 {number}
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @return {Line}
 */
Line.fromCoordinates = function (x1, y1, x2, y2) {
    return new Line(
        new Vector(x1, y1),
        new Vector(x2, y2)
    );
}

/**
 * Returns the displacement of the line.
 * @return {Vector}
 */
Line.prototype.displacement = function () {
    return Vector.sub(this.to, this.from);
}

/**
 * Returns the normalized displacement of the line.
 * @returns {Vector}
 */
Line.prototype.direction = function () {
    return Vector.normalize(this.displacement());
}

/**
 * Returns the length of the line.
 * @return {number}
 */
Line.prototype.length = function () {
    return Vector.distance(this.to, this.from);
}

/**
 * Calls the function lineTo() on context.
 * @param context {CanvasRenderingContext2D} Display context
 */
Line.prototype.contextLineTo = function (context) {
    context.moveTo(this.from.x, this.from.y);
    context.lineTo(this.to.x, this.to.y);
}

/**
 * Returns a point that lies on the line.
 * @param t {number} A value ranging [0, 1] where 0 corresponds with from and
 * 1 corresponds with to.
 * @return {Vector}
 */
Line.prototype.pointOnLine = function (t) {
    const disp = this.displacement();
    const scaled = Vector.scale(disp, t);

    return Vector.add(this.from, scaled);
}

/**
 * Returns the point on the line that is nearest to the specified point.
 * Adapted from https://stackoverflow.com/a/74134734.
 * @param point {Vector}
 * @returns {{t: number, distance: number, normalLine: Line, pointOnLine: Vector}}
 */
Line.prototype.pointNearest = function (point) {
    const direction = this.direction();
    const maxDist = this.length();

    const lhs = Vector.sub(point, this.from);
    let t = Vector.dot(lhs, direction);
    // Clamp t value to be between 0 and 1.
    t = Math.min(t, maxDist);
    t = Math.max(t, 0);
    t /= maxDist;

    const pointOnLine = this.pointOnLine(t);
    const normalLine = new Line(pointOnLine, point);

    return {
        pointOnLine: pointOnLine,
        t: t,
        normalLine: normalLine,
        distance: normalLine.length(),
    };
}
