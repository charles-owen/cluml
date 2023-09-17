import {Component} from "../../Component";
import {TerminationNode} from "./TerminationNode";
import {Rect} from "../../Utility/Rect";
import Selectable from "../../Selectable";
import {LineNode, NODE_TOUCH_RADIUS} from "./LineNode";
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
    this.nodes.end = new TerminationNode();
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
        // TODO: Return a node instead.
        // let node = this.nodes.start;
        //
        // do {
        //     const localize = Vector.sub(
        //         node.position,
        //         this.position
        //     );
        //     node = node.nextNode;
        // } while (node !== null)


        return this;
    }

    return null;
}

Association.prototype.move = function (dx, dy) {
    Selectable.prototype.move.call(this, dx, dy);

    let node = this.nodes.start;

    do {
        node.x += dx;
        node.y += dy;
        node = node.nextNode;
    } while (node !== null);
}

Association.prototype.drop = function () {
    if (!this.placedOnCanvas) {
        // Instantiate placements.
        const pos = this.position;
        this.nodes.start.x = pos.x - 50;
        this.nodes.start.y = pos.y;
        this.nodes.end.x = pos.x + 50;
        this.nodes.end.y = pos.y;
    }
}

/**
 * Returns the largest bounds this association displaces.
 * @return {Rect}
 */
Association.prototype.bounds = function () {
    let node = this.nodes.start;

    let min = node.bounds().max;
    let max = node.bounds().min;

    do {
        max = Vector.maxComponents(
            max,
            node.bounds().max
        );
        min = Vector.minComponents(
            min,
            node.bounds().min
        )
        node = node.nextNode;
    } while (node !== null);

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
    // context.fillStyle = "#e7e8b0";
    context.strokeStyle = "#000000";

    let node = this.nodes.start;

    // region DEBUG
    const startPos = node.position;
    context.fillStyle = 'rgba(255,0,0,0.5)';
    context.fillRect(
        startPos.x - NODE_TOUCH_RADIUS,
        startPos.y - NODE_TOUCH_RADIUS,
        NODE_TOUCH_RADIUS * 2,
        NODE_TOUCH_RADIUS * 2
    );

    context.fillStyle = 'rgba(255,156,0,0.3)';
    const bnds = this.bounds();
    bnds.drawRect(context);
    // endregion

    while (node !== this.nodes.end) {
        let pos = node.position;
        context.moveTo(pos.x, pos.y);

        node = node.nextNode;

        pos = node.position;
        context.lineTo(pos.x, pos.y);

        // region DEBUG
        context.fillStyle = 'rgba(255,0,0,0.5)';
        context.fillRect(
            pos.x - NODE_TOUCH_RADIUS,
            pos.y - NODE_TOUCH_RADIUS,
            NODE_TOUCH_RADIUS * 2,
            NODE_TOUCH_RADIUS * 2
        );
        // endregion
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