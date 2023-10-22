import {Attribute} from '../../../src/Cluml/SanityElement/Attribute';

describe('Attribute', function() {
    it('Should construct', function() {
        let attribute = new Attribute("+attribute: String");

        expect(attribute.elementValue).toEqual("+attribute: String");
        expect(attribute.visibility).toEqual("+");
        expect(attribute.name).toEqual("attribute");
        expect(attribute.type).toEqual("String");
    });
});
