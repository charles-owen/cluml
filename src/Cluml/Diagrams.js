import {Simulation} from './Simulation';
import {Diagram} from './Diagram';
import {Sanitize} from './Utility/Sanitize';

/**
 * A collection of diagram objects
 * @param model {Model} The model we are a member of
 * @param simulation {Simulation} The simulation object that simulates operation of the diagrams
 * @constructor
 */
export const Diagrams = function (model, simulation) {
    this.model = model;
    /**
     *
     * @type {Diagram[]}
     */
    this.diagramList = [];
    this.grid = 8;
    this.snap = true;
    this.id = model !== null ? model.id : undefined;

    // If none is supplied, create a simulation object
    this.simulation = simulation ? simulation : new Simulation();

    // Previous copy in the copy stack
    this.prev = null;
};

/**
 * Add a diagram to this collection of diagrams
 * @param {Diagram} diagram
 */
Diagrams.prototype.add = function (diagram) {
    this.diagramList.push(diagram);
    diagram.diagrams = this;
    return diagram;
};

Diagrams.prototype.insert = function (diagram) {
    this.diagramList.unshift(diagram);
    diagram.diagrams = this;
    return diagram;
}

/**
 * Get the collection of diagrams.
 * @returns {Array<Diagram>} Array of Diagram objects (copy)
 */
Diagrams.prototype.getDiagrams = function () {
    return this.diagramList.slice();
};

/**
 * Get a diagram by name
 * @param name {string} Name of the diagram
 * @returns {Diagram} Diagram object or null
 */
Diagrams.prototype.getDiagram = function (name) {
    for (let i = 0; i < this.diagramList.length; i++) {
        const diagram = this.diagramList[i];
        if (diagram.name === name) {
            return diagram;
        }
    }

    return null;
};

Diagrams.prototype.advance = function (delta) {
    let ret = false;
    for (let i = 0; i < this.diagramList.length; i++) {
        const diagram = this.diagramList[i];
        if (diagram.advance(delta)) {
            ret = true;
        }
    }

    return ret;
}

/**
 * Determine if a diagram can be deleted.
 * @param ndx {number} Index into the diagrams.
 */
Diagrams.prototype.canDelete = function (ndx) {
    // The main diagram (first) cannot be deleted
    return ndx > 0;
}

/**
 * Determine if a diagram can be moved left as a tab.
 * @param ndx {number} Index into the diagrams.
 * @returns {boolean} True if diagram tag can be moved left
 */
Diagrams.prototype.canMoveLeft = function (ndx) {
    // First two tabs cannot be moved left at all
    return ndx > 1;
}

/**
 * Determine if a diagram can be moved right as a tab
 * @param ndx {number} Index into the diagrams.
 * @returns {boolean} True if diagram tag can be move right
 */
Diagrams.prototype.canMoveRight = function (ndx) {
    // First tab cannot be moved at all. Last tab can't
    // move to the right.
    return ndx > 0 && ndx < this.diagramList.length;
}

Diagrams.prototype.moveLeft = function (ndx) {
    if (this.canMoveLeft(ndx)) {
        this.model.backup();

        const t = this.diagramList[ndx - 1];
        this.diagramList[ndx - 1] = this.diagramList[ndx];
        this.diagramList[ndx] = t;
        return true;
    }

    return false;
}

Diagrams.prototype.moveRight = function (ndx) {
    if (this.canMoveRight(ndx)) {
        this.model.backup();

        const t = this.diagramList[ndx + 1];
        this.diagramList[ndx + 1] = this.diagramList[ndx];
        this.diagramList[ndx] = t;
        return true;
    }

    return false;
}

/**
 * Renames the tab/diagram at index ndx.
 * @param ndx {number} The tab/diagram index.
 * @param name {string} New name for the tab/diagram.
 */
Diagrams.prototype.rename = function (ndx, name) {
    this.model.backup();
    const diagram = this.diagramList[ndx];

    diagram.setName(name);
}

Diagrams.prototype.newTab = function () {
    // for(let i=0; i<this.diagrams.length; i++) {
    //     this.diagrams[i].newTab();
    // }

    for (let i = this.diagramList.length - 1; i >= 0; i--) {
        this.diagramList[i].newTab();
    }
}

Diagrams.prototype.recompute = function () {
    //for(let i=0; i<this.diagrams.length; i++) {
    for (let i = this.diagramList.length - 1; i >= 0; i--) {
        this.diagramList[i].recompute();
    }
}

/**
 * Create a backup clone of this diagram
 * @returns {Diagrams}
 */
Diagrams.prototype.clone = function () {
    const copy = new Diagrams(this.model, this.simulation);
    copy.grid = this.grid;
    copy.snap = this.snap;

    // Add to the copy stack
    copy.prev = this.prev;
    this.prev = copy;

    // Copy the diagram objects
    for (let i = 0; i < this.diagramList.length; i++) {
        const diagram = this.diagramList[i];
        copy.add(diagram.clone());
    }

    return copy;
};

/**
 * Update diagrams after a diagram change.
 * This is used by DiagramRef diagrams to ensure
 * references are always correct.
 * @param diagram Update up until this diagram
 */
Diagrams.prototype.update = function (diagram) {
    for (let d of this.diagramList) {
        if (d === diagram) {
            break;
        }
        d.update();
    }
}

Diagrams.prototype.toJSON = function () {
    return JSON.stringify(this.save());
};

/**
 * Load the diagrams from a JSON-encoded object
 * @param json
 */
Diagrams.prototype.fmJSON = function (json) {
    const obj = JSON.parse(json);
    this.load(obj);
};

/**
 * Save this object into an object suitable for conversion to
 * a JSON object for storage.
 * @returns Object
 */
Diagrams.prototype.save = function () {
    const diagrams = [];
    for (let i = 0; i < this.diagramList.length; i++) {
        const diagram = this.diagramList[i];
        diagrams.push(diagram.save());
    }

    let obj = {
        "grid": this.grid,
        "diagrams": diagrams, "id": this.id
    };

    if (this.snap) {
        obj.snap = true;
    }

    return obj;
};

/**
 * Load this object from an object converted from a JSON
 * object used for storage.
 * @param obj
 */
Diagrams.prototype.load = function (obj) {

    this.grid = +obj["grid"];
    this.snap = Sanitize.boolean(obj["snap"]);
    this.prev = null;
    this.diagramList = [];

    if (obj["id"] !== undefined) {
        this.id = Sanitize.sanitize(obj["id"]);
    }

    let i;

    //
    // Load diagrams in reverse order
    //
    for (i = obj.diagrams.length - 1; i >= 0; i--) {
        const diagramObj = obj.diagrams[i];
        const diagram = new Diagram(diagramObj.name);
        this.insert(diagram);
        diagram.load(diagramObj);
    }

    // In reverse order, ensure all diagrams have
    // had compute called on all diagrams
    for (i = this.diagramList.length - 1; i >= 0; i--) {
        this.diagramList[i].pending();
    }

};

Diagrams.prototype.addDiagram = function (name) {
    const diagram = new Diagram(name);
    this.add(diagram);
}

/**
 * Delete a diagram by the index to the diagram
 * @param index Index into the diagrams array
 */
Diagrams.prototype.deleteDiagramByIndex = function (index) {
    this.diagramList.splice(index, 1);
}


/**
 * Get a component by its naming
 * @param naming Naming to search for
 * @returns {*}
 */
Diagrams.prototype.getComponentByNaming = function (naming) {
    for (let i = 0; i < this.diagramList.length; i++) {
        const diagram = this.diagramList[i];
        const pin = diagram.getComponentByNaming(naming);
        if (pin !== null) {
            return pin;
        }
    }

    return null;
}

/**
 * Get all diagrams by type
 * @param type Naming to search for
 * @returns Array with collection of diagrams of that type
 */
Diagrams.prototype.getComponentsByType = function (type) {
    let components = [];

    for (let i = 0; i < this.diagramList.length; i++) {
        const diagram = this.diagramList[i];
        const c = diagram.getComponentsByType(type);
        components = components.concat(c);
    }

    return components;
}

/**
 * Replace a diagram that currently exists with a new version.
 */
Diagrams.prototype.replaceDiagram = function (diagram) {
    diagram.diagrams = this;

    for (let i = 0; i < this.diagramList.length; i++) {
        if (this.diagramList[i].name === diagram.name) {
            this.diagramList[i] = diagram;

            // Ensure all diagrams in the new diagram are pending, so they
            // all get updated.
            diagram.components.forEach(function (component) {
                component.pending();
            });

            // Force this to appear to be a new tab
            this.model.newTab();
            break;
        }
    }


}
