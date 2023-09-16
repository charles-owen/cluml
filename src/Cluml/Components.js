/**
 * The diagrams collection for Cluml.
 * @constructor
 */
export const Components = function () {

    /**
     * Components.
     * @type {Component[]}
     */
    this.components = [];

    this.palettes = {};

    /**
     * Add a component to the collection of available component objects
     * @param component Component object
     */
    this.add = function (component) {
        this.components.push(component);
        this.components.sort(function (a, b) {
            return a.paletteOrder - b.paletteOrder;
        });
    };

    /**
     * Get a component prototype by type
     * @param type {string} Type name to find (aka fileLbl).
     * @returns any constructor of the component.
     */
    this.get = function (type) {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].fileLbl === type) {
                return this.components[i];
            }
        }

        return null;
    };

    /**
     * Add a palette of diagrams by name.
     * @param name {string} Name to refer to the palette
     * @param components {Component[]} Array of component objects.
     */
    this.addPalette = function (name, components) {
        const names = [];
        for (let i = 0; i < components.length; i++) {
            names.push(components[i].fileLbl);
        }

        this.palettes[name] = names;
    }

    this.getPalette = function (name) {
        if (this.palettes.hasOwnProperty(name)) {
            return this.palettes[name];
        }

        return null;
    }
}

export default Components;

