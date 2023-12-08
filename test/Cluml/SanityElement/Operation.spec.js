import {Operation} from '../../../src/Cluml/SanityElement/Operation';
import {Class} from "../../../src/Cluml/Components/Class";

describe('Operation', function() {
    it('Should construct', function() {
        let operation = new Operation("+Operation(param1: Int): String");

        expect(operation.elementValue).toEqual("+Operation(param1: Int): String");
        expect(operation.visibility).toEqual("+");
        expect(operation.name).toEqual("Operation");
        expect(operation.parameters.length).toEqual(1);
        expect(operation.parameters[0]).toEqual(["param1", "Int"]);
        expect(operation.type).toEqual("String");
    });
    it ('Should set', function() {
        let operation = new Operation("+Operation(param1: Int): String");
        expect(operation.visibility).toEqual("+");
        operation.setVisibility("#");
        expect(operation.visibility).toEqual("#");
        operation.setVisibility("-");
        expect(operation.visibility).toEqual("-");
        operation.setVisibility("+");
        expect(operation.visibility).toEqual("+");
        operation.setVisibility("@");
        expect(operation.visibility).toEqual("+");
    });
    it('Should remove excess whitespace/commas', function() {
       let operation = new Operation('  + Operation( param1 :  Int,,,,,,)  :     String     ');
        expect(operation.elementValue).toEqual("+Operation(param1: Int): String");
        expect(operation.parameters[0]).toEqual(["param1", "Int"]);
    });
    it ('Should detect missing properties', function() {
        const missingVisibility = "Operation(): String";
        const missingName = "+(): String";
        const missingParamName = "+Operation(: String): String";
        const missingParamType = "+Operation(param:): String";
        const missingClosedParen = "+Operation(";


        let operation = new Operation(missingVisibility);

        Class.prototype.showVisibility = true;
        let messages = operation.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Visibility missing");

        Class.prototype.showVisibility = false;
        messages = operation.processSanityCheck();
        expect(messages.length).toEqual(0);

        operation = new Operation(missingName);
        messages = operation.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Name missing");

        operation = new Operation(missingParamName);
        messages = operation.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Parameter name missing");

        operation = new Operation(missingParamType);
        messages = operation.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Parameter type missing");

        operation = new Operation(missingClosedParen);
        messages = operation.processSanityCheck();
        expect(messages.length).toEqual(1);
        expect(messages[0].description).toEqual("Closed parenthesis missing");
    });
    it ('Should support parameter default values', function() {
        const defaultValue = "defaultValue";
        let operation = new Operation(`+Op(param: String = ${defaultValue})`);
        expect(operation.parameters[0].length).toEqual(3)
        expect(operation.parameters[0][2]).toEqual(defaultValue);
        expect(operation.processSanityCheck().length).toEqual(0);
    });
});
