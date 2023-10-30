import {Operation} from '../../../src/Cluml/SanityElement/Operation';

describe('Operation', function() {
    it('Should construct', function() {
        let operation = new Operation("+operation(param1: Int): String");

        expect(operation.elementValue).toEqual("+operation(param1: Int): String");
        expect(operation.visibility).toEqual("+");
        expect(operation.name).toEqual("operation");
        expect(operation.parameters.length).toEqual(1);
        expect(operation.parameters[0]).toEqual(["param1", "Int"]);
        expect(operation.type).toEqual("String");
    });
    it ('Should set', function() {
        let operation = new Operation("+operation(param1: Int): String");
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
       let operation = new Operation('  + operation( param1 :  Int,,,,,,)  :     String     ');
        expect(operation.elementValue).toEqual("+operation(param1: Int): String");
        expect(operation.parameters[0]).toEqual(["param1", "Int"]);
    });
});
