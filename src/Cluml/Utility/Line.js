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
 * @returns {{t: number, distance: number, pointOnLine: Vector}}
 */
Line.prototype.pointNearest = function (point) {
    const vec_ap = Vector.sub(point, this.from);
    const vec_bp = Vector.sub(point, this.to);
    const vec_ab = this.displacement();

    const dist_ap = vec_ap.magnitude();     // D1
    const dist_bp = vec_bp.magnitude();     // D2
    const dist_ab = vec_ab.magnitude();     // D3

    const dist_ac = (dist_bp * dist_bp - (dist_ap * dist_ap) - (dist_ab * dist_ab)) /
        (-2 * dist_ab);
    const t = dist_ac / dist_ab;
    const pointOnLine = this.pointOnLine(t);

    const line_cp = new Line(pointOnLine, point);
    // const lineToPoint = new Line(this.from, point);
    // const len = (disp.x * disp.x) + (disp.y + disp.y);
    // const dot = (lineToPoint.x * disp.x) + (lineToPoint.y + disp.y);
    // const t = Math.min(1, Math.max(0, dot / len));
    // const dispT = Vector.scale(disp, t);
    // const output = Vector.add(this.from, dispT);
    // const distance = Vector.distance(output, point);
    //
    return {
        pointOnLine: pointOnLine,
        t: t,
        distance: line_cp.length(),
    };
}
