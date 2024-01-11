import {SanityElement} from '../../../src/Cluml/SanityElement/SanityElement';

describe('SanityElement', function() {
    it('Should construct', function() {
        let expectedValue = "element1";

        let element1 = new SanityElement(expectedValue, undefined);
        expect(element1.elementValue).toEqual(expectedValue);
        expect(element1.relativeTo).toBeUndefined();

        expectedValue = "element2";
        let element2 = new SanityElement(expectedValue, element1);
        expect(element2.elementValue).toEqual(expectedValue);
        expect(element2.relativeTo).toBe(element1);
    });
    it('Should save and load', function() {
        let stringValue = "Hello, World!";
        let element = new SanityElement(stringValue, undefined);

        let obj = element.saveSanityElement();
        element = SanityElement.loadSanityElement(SanityElement, obj, undefined);
        expect(element.elementValue).toEqual(stringValue);
    })
});
