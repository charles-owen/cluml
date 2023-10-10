import { Sanitize } from './Utility/Sanitize';
import { Rect } from "./Utility/Rect";
import { Diagrams } from "./Diagrams";
import { Component } from "./Component";
import { MainSingleton } from "./MainSingleton";

/**
 * Construct a diagram
 * @param name {string} Name of the diagram
 * @constructor
 */
export const Diagram = function (name) {

    /**
     * The diagram container.
     * @type{Diagrams}
     */
    this.diagrams = null;

    /**
     * The array of components.
     * @type{Array<Component>}
     */
    this.components = [];

    /**
     * Name of this diagram.
     * @type {string}
     */
    this.name = name;

    /**
     * Width of the diagram.
     * @type {number}
     */
    this.width = this.defWidth;
    /**
     * Height of the diagram.
     * @type {number}
     */
    this.height = this.defHeight;

    // Previous copy in the copy stack
    this.prev = null;

    /**
     * See if some object has been touched by the mouse.
     * @param x {number} Mouse X
     * @param y {number} Mouse Y
     * @return {Component} Touched element or null if none
     */
    this.touch = function (x, y) {
        //
        // First we try to grab a component.
        // We do this in reverse order, so we are selecting
        // from top down.
        //
        for (let i = this.components.length - 1; i >= 0; i--) {
            let component = this.components[i];
            let grabbed = component.touch(x, y);
            if (grabbed !== null) {
                return grabbed;
            }
        }

        return null;
    };

    /**
     * Advance the animation by delta time...
     * @param delta
     */
    this.advance = function (delta) {
        let any = false;
        for (let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            if (component.advance(delta)) {
                any = true;
            }
        }
        return any;
    }

};

/**
 * Default width of the diagram.
 * @type {number}
 */
Diagram.prototype.defWidth = 1920;
/**
 * Default height of the diagram.
 * @type {number}
 */
Diagram.prototype.defHeight = 1080;

/**
 * Create a backup clone of this Diagram
 * @returns {Diagram} The clone of the diagram.
 */
Diagram.prototype.clone = function () {
    const copy = new Diagram(this.name);
    copy.isClone = true;
    copy.width = this.width;
    copy.height = this.height;

    // Add to the copy stack
    copy.prev = this.prev;
    this.prev = copy;

    // Iterate over the components, cloning each of them.
    for (const component of this.components) {
        if (component.placedOnCanvas) {
            const componentCopy = component.clone();
            copy.add(componentCopy);
        }
    }

    // // Again we iterate over the diagrams, this time
    // // cloning the output connections.
    // for (let i = 0; i < this.diagrams.length; i++) {
    //     component = this.diagrams[i];
    //     for (let j = 0; j < component.outs.length; j++) {
    //         const out = component.outs[j];
    //         for (let k = 0; k < out.to.length; k++) {
    //             out.to[k].clone();
    //         }
    //     }
    // }

    return copy;
};

/**
 * Update diagram after a diagram change.
 * This is used by DiagramRef diagrams to ensure
 * references are always correct.
 */
Diagram.prototype.update = function () {
    for (let component of this.components) {
        component.update();
    }
}

Diagram.prototype.draw = function (context, view) {
    for (const component of this.components) {
        component.draw(context, view);
    }
};

Diagram.prototype.newTab = function () {
    // There was code here to iterate over the diagrams
    // in reverse order. I don't recall why that was. I think
    // it may be a holdover from the diagrams being in reverse
    // order. I'm removed it and will see if it breaks anything.
    // for(let i=this.diagrams.length-1; i>= 0; i--) {


    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];

        // Tell any diagrams that need to know that
        // we have selected a new tab. This is
        // important for the reference component.
        component.newTab();
    }
}

Diagram.prototype.recompute = function () {
    for (let i = 0; i < this.diagrams.length; i++) {
        // Ensure everything get recomputed
        this.diagrams[i].pending();
    }
}

/**
 * Test if diagrams or bends are contained in a given rectangle.
 * @param rect Rect object
 * @returns {Array} Array of all contained diagrams
 */
Diagram.prototype.inRect = function (rect) {
    const ret = [];
    for (let i = this.components.length - 1; i >= 0; i--) {
        this.components[i].inRect(rect, ret);
    }

    return ret;
};

Diagram.prototype.snapIt = function (item) {
    if (this.diagrams.snap) {
        item.x = this.diagrams.grid * Math.round(item.x / this.diagrams.grid);
        item.y = this.diagrams.grid * Math.round(item.y / this.diagrams.grid);
    }
};

/**
 * Adds a component to the diagram.
 * @param {Component} component 
 * @returns {Component}
 */
Diagram.prototype.add = function (component) {
    if (this.components.length > 2) {
        // Binary search and insertion.
        const val = component.drawOrder;
        let from = 0;
        let at = 0;
        let to = this.components.length - 1;
        let added = false;

        while (from < to) {
            at = Math.floor((from + to) / 2);
            const left = this.components[at].drawOrder;
            const right = this.components[at + 1].drawOrder;
 

            if (left <= val && val <= right) {
                // In middle of same values.
                added = true;
            
                // Insert value.
                this.components.splice(at + 1, 0, component);
                break;
            } else if (left > val) {
                // Left is greater than middle.
                to = at - 1;
            } else if (val > right) {
                // Right is less than middle.
                from = at + 1;
            } else {
                throw new Error("Line should not be executed.");
            }
        }

        if (!added) {
            // Add to either end or beginning.
            if (from === this.components.length - 1) {
                this.components.push(component);
            } else if (to === 0) {
                this.components.splice(0, 0, component);
            } else {
                throw new Error("Was not able to insert component.");
            }
        }
    } else {
        // Not too many elements. Just sort the array.
        this.components.push(component);
        this.components.sort(function (c1, c2) {
            return c1.drawOrder - c2.drawOrder;
        })
    }

    component.added(this);
    return component;
};

/**
 * Delete a specific item from the list of diagrams
 * @param toDelete {Component} Item to delete
 */
Diagram.prototype.delete = function (toDelete) {
    for (let i = 0; i < this.components.length; i++) {
        if (this.components[i] === toDelete) {
            this.components.splice(i, 1);
            break;
        }
    }
};

/**
 * Save this object into an object suitable for conversion to
 * a JSON object for storage.
 * @returns Object
 */
Diagram.prototype.save = function () {
    // Iterate over the diagrams, saving each of them
    const comps = [];

    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];

        // Set an ID on each component
        // component.id = "c" + (i + 1001);

        comps.push(component.saveComponent());
    }

    // // Then iterate over the connections, saving each of them
    // for (let i = 0; i < this.diagrams.length; i++) {
    //     const component = this.diagrams[i];
    // }

    return {
        "name": this.name, "width": this.width, "height": this.height,
        "components": comps
    };
};

/**
 * Load this object from an object that was converted from a
 * JSON object for storage.
 * @param obj
 */
Diagram.prototype.load = function (obj) {
    this.name = Sanitize.sanitize(obj.name);
    this.width = +obj.width;
    this.height = +obj.height;

    // Load the diagrams
    const compsMap = {};  // Map from component ID to component object

    /**
     * 
     * @param {Component} b 
     * @param {Component} a 
     * @returns 
     */
    function compareComps(a, b) {
        return a.loadOrder - b.loadOrder;
    }

    const compsList = obj.components.sort(compareComps);

    for (const componentData of compsList) {
        const componentConstructor = this.diagrams.model.main.components.get(componentData.fileLbl);
        if (componentConstructor !== null) {
            /**
             * @type {Component}
             */
            const component = new componentConstructor();
            component.diagram = this;
            component.loadComponent(componentData);
            compsMap[component.id] = component;
            this.add(component);
        } else {
            console.log(componentData);
        }
    }

    // // Load the connections
    // for (let i = 0; i < obj.connections.length; i++) {
    //     const connectionObj = obj.connections[i];
    //     const fmComp = compsMap[connectionObj["from"]];
    //     if (fmComp === undefined) {
    //         console.log("From object undefined");
    //         console.log(this);
    //         console.log(connectionObj);
    //         continue;
    //     }
    //
    //     const toComp = compsMap[connectionObj["to"]];
    //     if (toComp === undefined) {
    //         console.log("To object undefined");
    //         console.log(this);
    //         console.log(connectionObj);
    //         continue;
    //     }
    //
    //     const outNdx = connectionObj["out"];
    //     const inNdx = connectionObj["in"];
    //     const connection = this.connect(fmComp, outNdx, toComp, inNdx);
    //     if (connection !== null) {
    //         connection.load(connectionObj);
    //     }
    // }
};

/**
 * Get a component by its naming
 * @param naming {string} Naming to search for
 * @returns {Component|null}
 */
Diagram.prototype.getComponentByNaming = function (naming) {
    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];
        if (component.naming === naming) {
            return component;
        }
    }

    return null;
};

/**
 * Get a component by its id.
 * @param id {string} ID to search for.
 * @returns {Component|null}
 */
Diagram.prototype.getComponentByID = function (id) {
    if (id === undefined || id === null || id === '') {
        throw Error("Value of ID " + id + " is invalid.");
    }

    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];
        if (component.id.length > 0 && component.id === id) {
            return component;
        }
    }

    return null;
};


/**
 * Get all diagrams by type
 * @param fileLbl {string} Naming to search for
 * @returns {Component[]} with collection of components of that type
 */
Diagram.prototype.getComponentsByType = function (fileLbl) {
    /**
     * @type {Component[]}
     */
    const components = [];

    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];
        if (component.fileLbl === fileLbl) {
            components.push(component);
        }
    }

    return components;
}

Diagram.prototype.mouseUp = function () {
    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];
        component.mouseUp();
    }
};

/**
 * Determine the maximum size in each dimension for this diagram.
 * Does include an extra 16 pixel bias in each dimension to account for
 * associations.
 * @returns {{x: number, y: number}}
 */
Diagram.prototype.maxXY = function () {
    let maxX = 1;
    let maxY = 1;

    for (let i = 0; i < this.components.length; i++) {
        const bounds = this.components[i].bounds();
        if (bounds.right > maxX) {
            maxX = bounds.right;
        }

        if (bounds.bottom > maxY) {
            maxY = bounds.bottom;
        }
    }

    return { x: maxX + 16, y: maxY + 16 };
}

/**
 * Compute a bounding box that encloses all of this diagram.
 * @returns {Rect}
 */
Diagram.prototype.bounds = function () {
    if (this.components.length === 0) {
        return new Rect();
    }

    const bounds = this.components[0].bounds();

    for (let i = 0; i < this.components.length; i++) {
        const b = this.components[i].bounds();
        bounds.expand(b);
    }

    return bounds;
}

Diagram.prototype.pending = function () {
    for (let i = 0; i < this.components.length; i++) {
        const component = this.components[i];
        component.pending();
    }
}

Diagram.prototype.getName = function () {
    return this.name;
};

Diagram.prototype.setName = function (name) {
    this.name = name;
}

/**
 * Obtain basic statistics about this diagram.
 * @returns {{name: *, numComponents: Number, numConnections: number, width: *, height: *}}
 */
Diagram.prototype.stats = function () {
    let numConnections = 0;
    // this.diagrams.forEach((component) => {
    //     component.outs.forEach((out) => {
    //         numConnections += out.to.length;
    //     });
    // });

    return {
        name: this.name,
        numComponents: this.components.length,
        numConnections: numConnections,
        width: this.width,
        height: this.height
    };
}

/**
 * Moves the specified component to the front of the diagrams list.
 * @param component {Component} the component to move.
 */
Diagram.prototype.moveToFront = function (component) {

    for (let i = 0; i < this.components.length; i++) {
        if (this.components[i] === component) {
            this.components.splice(i, 1);
            this.components.push(component);
            break;
        }
    }
}

// /**
//  * Return all DiagramRef diagrams that refer to a diagram
//  * @param diagram {Diagram} Diagram we are testing. If omitted, all DiagramRef diagrams are returned.
//  * @return array of DiagramRef diagrams.
//  */
// Diagram.prototype.references = function (diagram) {
//     let references = [];
//
//     for (let component of this.diagrams) {
//         if (component instanceof DiagramRef) {
//             if (diagram !== undefined) {
//                 if (component.diagramName === diagram.name) {
//                     references.push(component);
//                 }
//             } else {
//                 references.push(component);
//             }
//
//         }
//     }
//
//     return references;
// }
