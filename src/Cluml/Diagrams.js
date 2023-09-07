import {Diagram} from './Diagram';

/**
 * A collection of diagram objects
 * @param model The model we are a member of
 *  @constructor
 */
export const Diagrams = function(model) {
    this.model = model;
    this.diagrams = [];
    this.grid = 8;
    this.snap = true;
    this.id = model !== null ? model.id : undefined;

    // Previous copy in the copy stack
    this.prev = null;
};

/**
 * Add a diagram to this collection of diagrams
 * @param diagram
 */
Diagrams.prototype.add = function(diagram) {
    this.diagrams.push(diagram);
    diagram.diagrams = this;
    return diagram;
};

/**
 * Get the collection of diagrams.
 * @returns Array of Diagram objects (copy)
 */
Diagrams.prototype.getDiagrams = function() {
    return this.diagrams.slice();
};

/**
 * Get a diagram by name
 * @param name Name of the diagram
 * @returns Diagram object or null
 */
Diagrams.prototype.getDiagram = function(name) {
    for(let i=0; i<this.diagrams.length; i++) {
        const diagram = this.diagrams[i];
        if(diagram.name === name) {
            return diagram;
        }
    }

    return null;
};

Diagrams.prototype.advance = function(delta) {
    let ret = false;
    for(let i=0; i<this.diagrams.length; i++) {
        const diagram = this.diagrams[i];
        if(diagram.advance(delta)) {
            ret = true;
        }
    }

    return ret;
}

Diagrams.prototype.newTab = function() {
    // for(let i=0; i<this.diagrams.length; i++) {
    //     this.diagrams[i].newTab();
    // }

    for(let i=this.diagrams.length-1;  i>=0;  i--) {
        this.diagrams[i].newTab();
    }
}

Diagrams.prototype.recompute = function() {
    //for(let i=0; i<this.diagrams.length; i++) {
    for(let i=this.diagrams.length-1;  i>=0;  i--) {
        this.diagrams[i].recompute();
    }
}

Diagrams.prototype.addDiagram = function(name) {
    var diagram = new Diagram(name);
    this.add(diagram);
}