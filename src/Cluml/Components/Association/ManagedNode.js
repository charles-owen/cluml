import {LineNode, NODE_NORMAL_RADIUS} from "./LineNode";
import Vector from "../../Utility/Vector";
import {DEBUG_BOUNDS} from "../../Selectable";

export const ManagedNode = function () {
    LineNode.call(this);

    this.isManaged = true;
}

ManagedNode.prototype = Object.create(LineNode.prototype);
ManagedNode.prototype.constructor = ManagedNode;


ManagedNode.prototype.touch = function (x, y) {
    // No touchy
    return null;
}

ManagedNode.prototype.draw = function (context, view) {
    // No draw-y
    if (DEBUG_BOUNDS) {
        // If in debug mode, draw circle.
        context.arc(this.x, this.y, NODE_NORMAL_RADIUS / 2, 0, 2 * Math.PI, true);
        context.stroke();
    }
}

ManagedNode.prototype.syncNodes = function () {
    let anyChanges = false;

    const plp = this.hasPrevious ? this.previousNode.lineupPoint() : new Vector(0, 0);
    const nlp = this.hasNext ? this.nextNode.lineupPoint() : new Vector(0, 0);

    if (this.hasPrevious) {

        if (this.previousNode.isManaged) {
            // Should not be a managed node next to another managed node.
            // Remove that one.
            this.previousNode.delete();
            anyChanges = true;
        } else if (this.y !== plp.y) {
            this.y = plp.y;
            if (this.hasNext) {
                this.x = nlp.x;
            }
            anyChanges = true;
        }
    }

    if (this.hasNext) {
        if (this.nextNode.isManaged) {
            // Should not be a managed node next to another managed node.
            // Remove that one.
            this.nextNode.delete();
            anyChanges = true;
        } else if (this.x !== nlp.x) {
            this.x = nlp.x;
            if (this.hasPrevious) {
                this.y = plp.y;
            }
            anyChanges = true;
        }

        return this.nextNode.syncNodes() || anyChanges;
    }

    if (this.hasNext)
        return this.nextNode.syncNodes() || anyChanges;
    else
        return anyChanges
}
