
import {Tools} from './DOM/Tools';
// import {Util} from './Utility/Util';
// import {PaletteItem} from "./PaletteItem";
// import {Diagram} from "./Diagram";
// import {DiagramRef} from "./Components/DiagramRef";

/**
 * The pallet div where we select parts to add to the UML diagram
 * @param main Main object
 * @param work div.work
 * @constructor
 */
export const Palette = function(main, work) {
    this.main = main;
    this.cluml = main.cluml;
    this.palette = [];

    /**
     * The DIV element associated with this palette.
     * @type {Element}
     */
    this.div = null;

    // let components = [];

    const initialize = () => {
        // Create and install the div
        this.div = Tools.createClassedDiv('cs-palette');
        work.appendChild(this.div);

        // We allow either an array of strings in diagrams
        // or a string naming a specific named palette
        if(typeof main.options.components === "string") {
            // diagrams = main.diagrams.getPalette(main.options.diagrams);
            // if(diagrams === null) {
            //     throw new Error('options.diagrams invalid name ' + main.options.diagrams);
            // }
        } else {
            main.options.components.forEach((component) => {
                // This can be a component name or a palette name
                // let palette = main.diagrams.getPalette(component);
                // if(palette !== null) {
                //     diagrams = diagrams.concat(palette);
                // } else {
                //     // // Some component aliases
                //     // if(component.toLowerCase() === 'not') {
                //     //     component = 'Inverter';
                //     // }
                //     //
                //     // if(component.toLowerCase() === 'decoder') {
                //     //     component = 'BusDecoder';
                //     // }
                //
                //     diagrams.push(component);
                // }
            });
        }

        // //
        // // Load the diagram diagrams into the palette
        // //
        // main.diagrams.diagrams.forEach(function(obj) {
        //     addToPalette(obj);
        // });
    }

    // const addToPalette = (obj) => {
    //     // Only some diagrams get added to the pallet...
    //     // A component is added if it is in the current
    //     // list of diagrams or main.options.always
    //     let name = obj.type;
    //     if(!Util.inArray(name, diagrams) &&
    //         !Util.inArray(name, main.options.always)) {
    //         return;
    //     }
    //
    //     this.palette.push(obj);
    //     const pi = new PaletteItem(this, obj);
    //     div.appendChild(pi.element);
    // }

    initialize();
};

/**
 * Refresh the palette after any tab changes. Since Diagram Refs aren't
 * applicable to us, I'll just remove this function for now.
 */
// Palette.prototype.refresh = function() {
    // // Remove any palette items that are of class "diagramref"
    // for(const c of this.div.querySelectorAll('.cs-diagramref')) {
    //     this.div.removeChild(c);
    // }
    //
    // // Add any necessary diagramref palette items
    // for(let i = this.main.currentView().tabnum+1;  i < this.main.model.diagrams.diagrams.length;  i++) {
    //     const diagram = this.main.model.diagrams.diagrams[i];
    //
    //     const pi = new PaletteItem(this, DiagramRef, diagram);
    //     pi.element.classList.add('cs-diagramref');
    //     this.div.appendChild(pi.element);
    // }
// }