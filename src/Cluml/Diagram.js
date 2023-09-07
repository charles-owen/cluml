/**
 * Construct a diagram
 * @param name Name of the diagram
 * @constructor
 */
export const Diagram = function(name) {

    this.diagrams = null;
    this.components = [];
    this.name = name;

    this.width = this.defWidth;
    this.height = this.defHeight;

    // Previous copy in the copy stack
    this.prev = null;

    /**
     * See if some object has been touched by the mouse.
     * @param x Mouse X
     * @param y Mouse Y
     * @return Touched element or null if none
     */
    this.touch = function(x, y) {
        //
        // First we try to grab a component.
        // We do this in reverse order so we are selecting
        // from top down.
        //
        for(let i=this.components.length-1; i>= 0; i--) {
	        let component = this.components[i];
	        let grabbed = component.touch(x, y);
            if(grabbed !== null) {
                return grabbed;
            }
        }

        return null;
    };

    /**
     * Advance the animation by delta time...
     * @param delta
     */
    this.advance = function(delta) {
        var any = false;
        for(var i=0; i<this.components.length; i++) {
            var component = this.components[i];
            if(component.advance(delta)) {
                any = true;
            }
        }
        return any;
    }

};

Diagram.prototype.defWidth = 1920;   ///< Default width
Diagram.prototype.defHeight = 1080;  ///< Default height

Diagram.prototype.draw = function(context, view) {
    this.components.forEach(function(component, index, array) {
        component.draw(context, view);
    });
};

Diagram.prototype.newTab = function() {
    // There was code here to iterate over the components
    // in reverse order. I don't recall why that was. I think
    // it may be a holdover from the diagrams being in reverse
    // order. I'm removed it and will see if it breaks anything.
    // for(let i=this.components.length-1; i>= 0; i--) {


    for(let i=0;  i<this.components.length; i++) {
        const component = this.components[i];

        // Tell any components that need to know that
        // we have selected a new tab. This is
        // important for the reference component.
        component.newTab();
    }
}

Diagram.prototype.recompute = function() {
    for(let i=0;  i<this.components.length; i++) {
        // Ensure everything get recomputed
        this.components[i].pending();
    }
}

Diagram.prototype.getName = function() {
    return this.name;
};

Diagram.prototype.setName = function(name) {
    this.name = name;
}