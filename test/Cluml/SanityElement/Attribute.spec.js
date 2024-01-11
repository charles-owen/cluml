import {Attribute} from '../../../src/Cluml/SanityElement/Attribute';
import {Class} from "../../../src/Cluml/Components/Class";

describe('Attribute', function() {
    it('Should construct', function() {
        let attribute = new Attribute("+attribute: String");

        expect(attribute.elementValue).toEqual("+attribute: String");
        expect(attribute.visibility).toEqual("+");
        expect(attribute.name).toEqual("attribute");
        expect(attribute.type).toEqual("String");
    });
    it ('Should set', function() {
        let attribute = new Attribute("+attribute: String");
        expect(attribute.visibility).toEqual("+");
        attribute.setVisibility("#");
        expect(attribute.visibility).toEqual("#");
        attribute.setVisibility("-");
        expect(attribute.visibility).toEqual("-");
        attribute.setVisibility("+");
        expect(attribute.visibility).toEqual("+");
        attribute.setVisibility("@");
        expect(attribute.visibility).toEqual("+");
    });
    it ('Should remove unnecessary whitespace', function() {
        let attribute = new Attribute('  + attribute     :       String    ');
        expect(attribute.elementValue).toEqual("+attribute: String");
        expect(attribute.visibility).toEqual("+");
        expect(attribute.name).toEqual("attribute");
        expect(attribute.type).toEqual("String");
    });
    it ('Should detect missing properties', function() {
        const missingVisibility = "attribute: String";
        const missingName = "+: String";
        const missingType = "+attribute:";

        let attribute = new Attribute(missingVisibility);

        Class.prototype.showVisibility = true;
        let messages = attribute.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Visibility missing");

        Class.prototype.showVisibility = false;
        messages = attribute.processSanityCheck();
        expect(messages.length).toEqual(0);

        attribute = new Attribute(missingName);
        messages = attribute.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Name missing");

        attribute = new Attribute(missingType);
        messages = attribute.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Type missing");
    });
    it ('Should support default values', function() {
        const defaultValue = "defaultValue";
        let attribute = new Attribute(`+attribute: String = ${defaultValue}`);
        expect(attribute.defaultValue).toEqual(defaultValue);

        const messages = attribute.processSanityCheck();
        expect(messages.length).toEqual(0);
    })
});
