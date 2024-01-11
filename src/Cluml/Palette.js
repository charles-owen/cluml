import {Tools} from './DOM/Tools';
import {Util} from './Utility/Util';
import {PaletteItem} from "./PaletteItem";

/**
 * The pallet div where we select parts to add to the UML diagram
 * @param main Main object
 * @param work div.work
 * @constructor
 */
export const Palette = function (main, work) {
    this.main = main;
    this.cluml = main.cluml;
    this.palette = [];

    /**
     * The DIV element associated with this palette.
     * @type {Element}
     */
    this.div = Tools.createClassedDiv('cs-palette');
    work.appendChild(this.div);

    let components = [];

    const initialize = () => {
        // We allow either an array of strings in diagrams
        // or a string naming a specific named palette
        if (typeof main.options.components === "string") {
            components = main.components.getPalette(main.options.components);
            if (components === null) {
                throw new Error('options.components invalid name ' + main.options.components);
            }
        } else {
            main.options.components.forEach((component) => {
                // This can be a component name or a palette name
                let palette = main.components.getPalette(component);
                if (palette !== null) {
                    components = components.concat(palette);
                } else {
                    components.push(component);
                }
            });
        }

        // Load the diagram components into the palette
        main.components.componentList.forEach(function (template) {
            addToPalette(template);
        });
    }

    /**
     * Adds a component type to the palette.
     * @param template {function}
     */
    const addToPalette = (template) => {
        // // Only some diagrams get added to the pallet...
        // // A component is added if it is in the current
        // // list of diagrams or main.options.always

        //let name = 'Class';
        let name = template.prototype.fileLbl;
        if (!Util.inArray(name, components) &&
            !Util.inArray(name, main.options.always)) {
            return;
        }

        this.palette.push(template);
        const pi = new PaletteItem(this, template, undefined);
        this.div.appendChild(pi.element);
    }

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