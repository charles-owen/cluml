import {Diagrams} from "./Diagrams";
import {Diagram} from "./Diagram";

/**
 * The diagrams model.
 *
 * One Model objects owns the diagrams, so all references are
 * to the model rather than to the diagrams. This allows the
 * diagrams to be switched out due to an undo or load.
 * @param main {Main} The Cluml object
 * @constructor
 */
export const Model = function (main) {
    /**
     *
     * @type {Main}
     */
    this.main = main;

    this.diagrams = new Diagrams(this);
    this.diagrams.add(new Diagram("main"));
};

Model.prototype.getDiagram = function (name) {
    return this.diagrams.getDiagram(name);
}

Model.prototype.undo = function () {
    if (this.diagrams.prev !== null) {
        this.diagrams = this.diagrams.prev;
    }
};

Model.prototype.backup = function () {
    this.diagrams.clone();
};

Model.prototype.status = function () {
    let i = 0;
    let p = this.diagrams;

    for (let diagram of p.diagrams) {
        let j = 0;
        let d = diagram;
        while (d !== null) {
            j++;

            d = d.prev;
        }

        console.log('diagram depth: ' + j);
    }

    while (p !== null) {
        i++;
        p = p.prev;
    }

    console.log('diagrams depth: ' + i);
}

/**
 * Update diagrams after a diagram change.
 * This is used by DiagramRef diagrams to ensure
 * references are always correct.
 * @param diagram Update up until this diagram
 */
Model.prototype.update = function (diagram) {
    this.diagrams.update(diagram);
}

Model.prototype.toJSON = function () {
    return this.diagrams.toJSON();
};

Model.prototype.fmJSON = function (json) {
    this.diagrams.simulation.setView(null);
    this.diagrams = new Diagrams(this);
    this.diagrams.fmJSON(json);
};

Model.prototype.getSimulation = function () {
    return this.diagrams.simulation;
};

Model.prototype.newTab = function () {
    this.diagrams.newTab();
    this.recompute();
}

Model.prototype.recompute = function () {
    this.diagrams.recompute();
}

Model.prototype.addDiagram = function (name) {
    this.backup();
    this.diagrams.addDiagram(name);
}

/**
 * Delete a diagram by the index to the diagram
 * @param index Index into the diagrams array
 */
Model.prototype.deleteDiagramByIndex = function (index) {
    this.backup();
    this.diagrams.deleteDiagramByIndex(index);
}

/**
 * Get a component by its naming
 * @param naming Naming to search for
 * @returns {*}
 */
Model.prototype.getComponentByNaming = function (naming) {
    return this.diagrams.getComponentByNaming(naming);
}

/**
 * Get all diagrams by type
 * @param type Naming to search for
 * @returns Array with collection of diagrams of that type
 */
Model.prototype.getComponentsByType = function (type) {
    return this.diagrams.getComponentsByType(type);
}

/**
 * Replace a diagram that currently exists with a new version.
 */
Model.prototype.replaceDiagram = function (diagram) {
    this.diagrams.replaceDiagram(diagram);
}

/**
 * Kill any active simulation when the model is destroyed
 */
Model.prototype.kill = function () {
    this.getSimulation().kill();
}

