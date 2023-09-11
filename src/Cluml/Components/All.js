import {Class} from "./Class";

/**
 * Adds all components into the system.
 * @param components {Components}
 * @constructor
 */
export const All = function (components) {
    components.add(Class);
}