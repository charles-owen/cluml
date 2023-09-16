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
 * Returns the displacement of the line.
 * @return {Vector}
 */
Line.prototype.displacement = function () {
    return Vector.sub(this.to, this.from);
}

/**
 * Returns the length of the line.
 * @return {number}
 */
Line.prototype.length = function () {
    return Vector.distance(this.to, this.from);
}

/**
 * Returns a point that lies on the line.
 * @param t {number} A value ranging [0, 1] where 0 corresponds with from and
 * 1 corresponds with to.
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
 * @returns {{t: number, distance: number, pointOnLine: Vector}}
 */
Line.prototype.pointNearest = function (point) {
    const disp = this.displacement();
    const lineToPoint = new Line(this.from, point);
    const len = (disp.x * disp.x) + (disp.y + disp.y);
    const dot = (lineToPoint.x * disp.x) + (lineToPoint.y + disp.y);
    const t = Math.min(1, Math.max(0, dot / len));
    const dispT = Vector.scale(disp, t);
    const output = Vector.add(this.from, dispT);
    const distance = Vector.distance(output, point);

    return {
        pointOnLine: output,
        t: t,
        distance: distance
    };
}