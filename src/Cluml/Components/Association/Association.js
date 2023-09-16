import {Component} from "../../Component";
import {TerminationNode} from "./TerminationNode";
import {Rect} from "../../Utility/Rect";
import Selectable from "../../Selectable";
import Vector from "../../Utility/Vector";
import {LineNode} from "./LineNode";

export const Association = function () {
    Component.call(this);

    //region Fields
    this.nodes = {
        /**
         * The start node of this association.
         * @type {TerminationNode}
         */
        start: null,
        /**
         * The end node of this association.
         * @type {TerminationNode}
         */
        end: null,
        /**
         * Saves the start and end nodes.
         */
        save: function () {
            let obj = {
                start: this.start.saveComponent(),
                end: this.end.saveComponent()
            }
        },
    }

    // Create the two termination associations
    this.nodes.start = new TerminationNode();
    this.nodes.end = new TerminationNode();
    this.nodes.start.linkToNext(this.nodes.end);
    //endregion

    //endregion
}

Association.prototype = Object.create(Component.prototype);
Association.prototype.constructor = Association;

//region Type
Association.fileLbl = "Association";
Association.helpLbl = 'association';
Association.paletteLbl = "Association";
Association.paletteDesc = "Association component.";
Association.htmlDesc = '<h2>Association</h2><p>A basic association between 2 classes.</p>';
Association.paletteOrder = 1;
//endregion

//region Component Methods
/**
 * Copies from another Association.
 * @param component {Association}
 */
Association.prototype.copyFrom = function (component) {
    this.nodes = component.nodes;
    Component.prototype.copyFrom.call(this, component);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {Association|null}
 */
Association.prototype.touch = function (x, y) {
    // Have we touched the component itself?
    if (this.bounds().contains(x, y)) {
        return this;
    }

    return null;
}

/**
 * Returns the largest bounds this association displaces.
 * @return {Rect}
 */
Association.prototype.bounds = function () {
    let node = this.nodes.start;

    let minX = node.start.x;
    let minY = node.start.y;
    let maxX = node.start.x;
    let maxY = node.start.y;

    while (node !== this.nodes.end) {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);

        node = node.nextNode;
    }

    return new Rect(
        minX, maxX,
        minY, maxY
    );
}

/**
 * Draw an association object.
 *
 * @param context {CanvasRenderingContext2D} Display context
 * @param view {View} View object
 */
Association.prototype.draw = function (context, view) {
    this.selectStyle(context, view);

    // Draw the line.
    context.beginPath();

    let path = new Path2D();
    let node = this.nodes.start;
    path.moveTo(node.start.x, node.start.y);

    while (node !== this.nodes.end) {
        path.lineTo(node.x, node.y);
        node = node.nextNode();
        path.moveTo(node.x, node.y);
    }
}

Association.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
    obj.nodes = this.nodes.saveComponent();
    return obj;
}

//endregion

//region Association Methods.
/**
 * Creates a node line node near the point "near".
 * @param near {Vector}
 */
Association.prototype.createNodeNear = function (near) {
    let node = this.nodes.start;
    /**
     * @type {{t: number, distance: number, pointOnLine: Vector}}
     */
    let min = undefined;
    let minNodes = undefined;

    while (node !== this.nodes.end) {
        const line = Selectable.lineBetween(node, node.nextNode);
        const pn = line.pointNearest(near);

        if (min === undefined || min.distance > pn.distance) {
            min = pn;
            minNodes = {
                from: node,
                to: node.nextNode
            }
        }

        node = node.nextNode;
    }


    // Now have the nearest point on the line.
    let newNode = new LineNode();
    newNode.position = min.pointOnLine;
    newNode.insertBetween(minNodes.from, minNodes.to);
}
//endregion