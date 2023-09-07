/**
 * Base object for anything that is draggable
 * using the mouse.
 * @constructor
 */
export const Selectable = function() {
    this.diagram = null;        // diagram this selectable is associated with
    this.x = 0;                 // Position of the selectable
    this.y = 0;

    this.moveX = 0;             // Position of the selectable while moving
    this.moveY = 0;

    this.selectedStyle = '#ff0000';
    this.unselectedStyle = '#000000';
};

Selectable.prototype.delete = function() {};
Selectable.prototype.drop = function() {};

export default Selectable;