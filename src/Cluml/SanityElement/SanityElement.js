import {MainSingleton} from "../MainSingleton";

export class SanityElement {
    elementValue = '';

    /**
     *
     * @param stringValue {string}
     */
    constructor(stringValue) {
        this.elementValue = stringValue;

        // Run the sanity check to update the types.
        //this.processSanityCheck();
    }

    /**
     * Yields everything with the processSanityCheck function.
     * @return {Generator<SanityElement, void, SanityElement>}
     */
    static* getAllSanityElements() {

        const components = MainSingleton.singleton.allCurrentComponents;

        for (const component of components) {
            yield* this.#getForwarders(component);

            for (const property in component) {
                const propVal = component[property];

                if (propVal !== null && typeof propVal.processSanityCheck === 'function') {
                    yield propVal;
                }
            }
        }
    }

    static* #getForwarders(parent) {
        if (typeof parent.forwardSanityCheck === 'function') {
            // console.log("forwardSanityCheck: " + component.forwardSanityCheck);
            for (const element of parent.forwardSanityCheck()) {
                if (element != null) {
                    if (typeof element.processSanityCheck === 'function') {
                        // This can check sanity.
                        yield element;
                    }

                    if (typeof element.forwardSanityCheck === 'function') {
                        // Found another forwarder.
                        yield* this.#getForwarders(element);
                    }
                }
            }
        }
    }

    /**
     * Processes the sanity check for this element.
     * @return {string} The error, if there is one, or
     * an empty string if no errors were detected.
     */
    processSanityCheck() {
        return '';
    }

    /**
     * Saves the element value of the sanity element.
     * @param obj {Any}
     * @param name {string}
     */
    saveSanityElement(obj, name) {
        obj[name] = this.elementValue;
        return obj;
    }

    /**
     * Saves multiple sanity elements into a structure that can be
     * added to a saving structure.
     * @param elements {Array<SanityElement>} Array of sanity elements.
     * @return {*}
     */
    static saveMultiple(elements) {
        return elements.map(
            (elem) => elem.elementValue
        );
    }
}
