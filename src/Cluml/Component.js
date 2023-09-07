import {Selectable} from './Selectable';

/**
 * Base object for a component in a diagram
 * @constructor
 */
export const Component = function () {
    Selectable.call(this);

    let diagram = null;

    Object.defineProperty(this, 'diagram', {
       get: function() {
           return diagram;
       },
       set: function(value) {
           diagram = value;
       }
    });

    this.height = 10;
    this.width = 10;
    this.prev = null;

    this.id = '';           // Will be set to a unique id for this component
    this.diagram = null;
    this.naming = null;     // Naming, as in U1 or I1
};

Component.prototype = Object.create(Selectable.prototype);
Component.prototype.constructor = Component;
