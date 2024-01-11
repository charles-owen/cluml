/**
 * The components collection for Cluml.
 * @constructor
 */
export const Components = function () {

    /**
     * Component templates.
     * @type {function[]}
     */
    this.componentList = [];

    /**
     *
     * @type {{}}
     */
    this.palettes = {};

    /**
     * Add a component to the collection of available component objects
     * @param component {function} Component template.
     */
    this.add = function (component) {
        this.componentList.push(component);
        this.componentList.sort(function (a, b) {
            return a.prototype.paletteOrder - b.prototype.paletteOrder;
        });
    };

    /**
     * Get a component prototype by type
     * @param type {string} Type name to find (aka fileLbl).
     * @returns any constructor of the component.
     */
    this.get = function (type) {
        for (let i = 0; i < this.componentList.length; i++) {
            if (this.componentList[i].prototype.fileLbl === type) {
                return this.componentList[i];
            }
        }

        return null;
    };

    /**
     * Add a palette of diagrams by name.
     * @param name {string} Name to refer to the palette
     * @param components {function[]} Array of component templates.
     */
    this.addPalette = function (name, components) {
        const names = [];
        for (let i = 0; i < components.length; i++) {
            names.push(components[i].prototype.fileLbl);
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

