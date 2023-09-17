import {Class} from "./Class";
import {Association} from "./Association/Association";

/**
 * Adds all components into the system.
 * @param components {Components}
 * @constructor
 */
export const All = function (components) {
    components.add(new Class());
    components.add(new Association());

    components.addPalette('all', [new Class(), new Association()]);
}