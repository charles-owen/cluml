import {Component} from "../../Component";
import {TerminationNode} from "./TerminationNode";
import {Rect} from "../../Utility/Rect";
import Selectable from "../../Selectable";
import {LineNode} from "./LineNode";
import Vector from "../../Utility/Vector";

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
        saveNodes: function () {
            let obj = {
                start: this.start.saveComponent(),
                end: this.end.saveComponent()
            }
        },
        /**
         * Loads the start/end nodes.
         */
        loadNodes: function (obj) {
            this.start = obj.nodes.start;
            this.end = obj.nodes.end;
        },
    }

    // Create the two termination associations
    this.nodes.start = new TerminationNode();
    this.nodes.start.x = -5;
    this.nodes.end = new TerminationNode();
    this.nodes.end.x = 5;
    this.nodes.start.linkToNext(this.nodes.end); //this line caused crashes, had to comment out
    //endregion

    //endregion
}

Association.prototype = Object.create(Component.prototype);
Association.prototype.constructor = Association;

//region Type
Association.prototype.fileLbl = "Association";
Association.prototype.helpLbl = 'association';
Association.prototype.paletteLbl = "Association";
Association.prototype.paletteDesc = "Association component.";
Association.prototype.htmlDesc = '<h2>Association</h2><p>A basic association between 2 classes.</p>';
Association.prototype.paletteOrder = 20;
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
    const pos = node.positionRelativeTo(this);

    let min = pos;
    let max = pos;

    while (node !== this.nodes.end) {
        node = node.nextNode;

        max = Vector.maxComponents(
            max,
            Vector.add(node.bounds().max, this.position)
        );
        min = Vector.minComponents(
            min,
            Vector.add(node.bounds().min, this.position)
        )
    }

    return Rect.fromMinAndMax(
        min, max
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
    context.fillStyle = "#e7e8b0";
    context.strokeStyle = "#000000";

    let node = this.nodes.start;

    while (node !== this.nodes.end) {
        let pos = node.positionRelativeTo(this);
        context.moveTo(pos.x, pos.y);

        node = node.nextNode;

        pos = node.positionRelativeTo(this)
        context.lineTo(pos.x, pos.y);
    }

    // context.rect(
    //     this.x, this.y,
    //     100, 100
    // );

    // context.moveTo(this.nodes.start.x, this.nodes.start.y);
    // context.lineTo(this.nodes.end.x, this.nodes.end.y);
    context.fill();
    context.stroke();
}

Association.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
    obj.nodes = this.nodes.saveNodes();
    return obj;
}

Association.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent(obj);

    obj.nodes.loadNodes(obj);
}

/**
 * Call the termination node to draw the PaletteItem to the palette
 * @returns {PaletteImage}
 */
Association.prototype.paletteImage = function () {
    return this.nodes.end.paletteImage();
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