import {Class} from "./Class";
import {Association} from "./Association/Association";

/**
 * Adds all components into the system.
 * @param components {Components}
 * @constructor
 */
export const All = function (components) {
    components.add(Class);
    components.add(Association);

    components.addPalette('all', [Class, Association]);
}