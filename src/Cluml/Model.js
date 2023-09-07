import {Diagram} from './Diagram';
import {Diagrams} from './Diagrams'

/**
 * The diagrams model.
 *
 * One Model objects owns the diagrams, so all references are
 * to the model rather than to the diagrams. This allows the
 * diagrams to be switched out due to an undo or load.
 * @param main The Cluml object
 * @constructor
 */
export const Model = function(main) {
    this.main = main;

    this.diagrams = new Diagrams(this);
    this.diagrams.add(new Diagram("Name of Diagram"));
};

Model.prototype.getDiagram = function(name) {
    return this.diagrams.getDiagram(name);
}

Model.prototype.newTab = function() {
    this.diagrams.newTab();
    this.recompute();
}

Model.prototype.recompute = function() {
    this.diagrams.recompute();
}


