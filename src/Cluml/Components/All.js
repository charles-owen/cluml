import {Class} from "./Class";
import {InterfaceClass} from "./InterfaceClass";
import {Association} from "./Association/Association";
import {Inheritance} from "./Association/Inheritance";
import {Composition} from "./Association/Composition";
import {Aggregation} from "./Association/Aggregation";
import {Containment} from "./Association/Containment";

/**
 * Adds all components into the system.
 * @param components {Components}
 * @constructor
 */
export const All = function (components) {
    components.add(Class);
    components.add(InterfaceClass);
    components.add(Association);
    components.add(Inheritance);
    components.add(Composition);
    components.add(Aggregation);
    components.add(Containment);

    //components.addPalette('all', [Class, Association, Inheritance, Composition]);
    components.addPalette('all', [Class, InterfaceClass, Association, Inheritance, Composition, Aggregation, Containment]);
}