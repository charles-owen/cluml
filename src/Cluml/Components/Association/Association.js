import {Component} from "../../Component";
import {TerminationNode} from "./TerminationNode";
import {Rect} from "../../Utility/Rect";
import {LineNode, NODE_TOUCH_RADIUS} from "./LineNode";
import Vector from "../../Utility/Vector";
import {Line} from "../../Utility/Line";
import Selectable from "../../Selectable";
import {Class} from "../Class";

export const ASSOCIATION_MIN_NODE_CREATE_DISTANCE = 25;

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
         * Instantiates the start and end nodes.
         * @param association {Association}
         */
        instantiate: function (association) {
            this.start = new TerminationNode();
            this.start.association = association;
            this.end = new TerminationNode();
            this.end.association = association;

            this.start.linkToNext(this.end);
        },
        /**
         * Copies the nodes.
         * @param association {Association}
         */
        copyFrom: function (association) {
            // Don't need to save end. The saving will propagate through the
            // path.
            // this.start.copyFrom(association.nodes.start);
            // this.end = association.nodes.end;
        }
        // /**
        //  * Saves the start and end nodes.
        //  */
        // saveNodes: function () {
        //     let obj = {
        //         start: this.start.saveComponent(),
        //         end: this.end.saveComponent()
        //     }
        // },
        // /**
        //  * Loads the start/end nodes.
        //  */
        // loadNodes: function (obj) {
        //     this.start = obj.nodes.start;
        //     this.end = obj.nodes.end;
        // },
    }

    // Create the two termination associations
    this.nodes.instantiate(this);
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
    this.nodes.copyFrom(component);
    Component.prototype.copyFrom.call(this, component);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {LineNode|null}
 */
Association.prototype.touch = function (x, y) {
    // Have we touched the component itself?
    if (this.bounds().contains(x, y)) {
        // Return a node instead of the association itself.
        let node = this.nodes.start;

        do {
            if (node.touch(x, y) !== null) {
                return node;
            }
            node = node.nextNode;
        } while (node !== null)

        // No node found. Create a new node.
        return this.createNodeNear(new Vector(x, y));
    }

    return null;
}

// Association.prototype.move = function (dx, dy) {
//     Selectable.prototype.move.call(this, dx, dy);
//
//     let node = this.nodes.start;
//
//     do {
//         node.x += dx;
//         node.y += dy;
//         node = node.nextNode;
//     } while (node !== null);
// }

Association.prototype.drop = function () {
    Selectable.prototype.drop.call(this);

    if (!this.placedOnCanvas) {
        // Instantiate placements.
        const pos = this.position;
        this.addChild(this.nodes.start, new Vector(pos.x - 50, pos.y));
        this.addChild(this.nodes.end, new Vector(pos.x + 50, pos.y));
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
    Component.prototype.draw.call(this, context, view);

    // // Delete line nodes that may have been undoned.
    // for (const selfNode of this.nodeGenerator()) {
    //     if (selfNode.fileLbl === "LineNode") {
    //         let contains = false;
    //
    //         for (const component of view.diagram.components) {
    //             if (selfNode === component) {
    //                 contains = true;
    //                 break;
    //             }
    //         }
    //
    //         if (contains) {
    //             selfNode.remove();
    //         }
    //     }
    // }

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
    bnds.fillRect(context);
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
    obj.startNodeID = this.nodes.start.id;
    obj.endNodeID = this.nodes.end.id;
    return obj;
}

Association.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent(obj);

    this.nodes.start = this.diagram.getComponentByID(obj.startNodeID);
    this.nodes.end = this.diagram.getComponentByID(obj.endNodeID);
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
 * A generator that generates (iterates) all the nodes of the association.
 * @return {Generator<LineNode, void, *>}
 */
Association.prototype.nodeGenerator = function* () {
    let node = this.nodes.start;

    while (node !== null) {
        const next = node.nextNode;
        yield node;
        node = next;
    }
}

/**
 * A generator that generates (iterates) all the edges of the association.
 * @return {Generator<{from: LineNode, to: LineNode}, void, *>}
 */
Association.prototype.edgeGenerator = function* () {
    let node = this.nodes.start;

    while (node !== this.nodes.end) {
        yield {
            from: node,
            to: node.nextNode
        };
        node = node.nextNode;
    }
}

/**
 * Creates a node line node near the point "near".
 * @param near {Vector}
 * @return {LineNode|null}
 */
Association.prototype.createNodeNear = function (near) {
    /**
     * @type {{t: number, distance: number, pointOnLine: Vector}}
     */
    let minTDP = undefined;
    let minEdge = undefined;

    for (const edge of this.edgeGenerator()) {
        const line = new Line(edge.from.position, edge.to.position);
        const tdp = line.pointNearest(near);

        if (tdp.distance < ASSOCIATION_MIN_NODE_CREATE_DISTANCE) {
            if (minTDP === undefined || tdp.distance < minTDP.distance) {
                minTDP = tdp;
                minEdge = edge;
            }
        }
    }

    if (minTDP !== undefined) {
        // Now have the nearest point on the line.
        let newNode = new LineNode();
        newNode.association = this;
        this.addChild(newNode, minTDP.pointOnLine);
        newNode.insertBetween(minEdge.from, minEdge.to);

        return newNode;
    } else {
        return null;
    }


    // let node = this.nodes.start;
    // /**
    //  * @type {{t: number, distance: number, pointOnLine: Vector}}
    //  */
    // let min = undefined;
    // let minNodes = undefined;
    //
    // while (node !== this.nodes.end) {
    //     const line = Selectable.lineBetween(node, node.nextNode);
    //     const pn = line.pointNearest(near);
    //
    //     if (min === undefined || min.distance > pn.distance) {
    //         min = pn;
    //         minNodes = {
    //             from: node,
    //             to: node.nextNode
    //         }
    //     }
    //
    //     node = node.nextNode;
    // }
    //
    //
    // // Now have the nearest point on the line.
    // let newNode = new LineNode();
    // newNode.association = this;
    // this.addChild(newNode, min.pointOnLine);
    // newNode.insertBetween(minNodes.from, minNodes.to);
    //
    // return newNode;
}
//endregion
