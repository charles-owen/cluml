import {MainSingleton} from "../MainSingleton";

export class SanityElement {
    elementValue = '';

    /**
     *
     * @param stringValue {string}
     */
    constructor(stringValue) {
        this.elementValue = stringValue;
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
     * Yields everything with the processSanityCheck function.
     * @return {Generator<SanityElement, void, SanityElement>}
     */
    static *getAllSanityElements() {

        const components = MainSingleton.singleton.allCurrentComponents;

        for (const component of components) {
            if ('forwardSanityCheck' in component && typeof component.forwardSanityCheck === 'function') {
                console.log("forwardSanityCheck: " + component.forwardSanityCheck);
                for (const sanityElement of component.forwardSanityCheck()) {
                    if (sanityElement != null && typeof sanityElement.processSanityCheck === 'function') {
                        // This can check sanity.
                        yield sanityElement;
                    }
                }

            }

            for (const property in component) {
                const propVal = component[property];

                if (propVal !== null && propVal.processSanityCheck === 'function') {
                    // This can check sanity.
                    yield propVal;
                }
            }
        }
    }
}