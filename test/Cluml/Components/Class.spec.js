import {Class} from "../../../src/Cluml/Components/Class";
import {Attribute} from "../../../src/Cluml/SanityElement/Attribute";
import {Operation} from "../../../src/Cluml/SanityElement/Operation";

describe('Class', function(){
    it('Construct', function(){
        let c = new Class();
        expect(c.fileLbl).toBe('Class');
    });


    it('Attributes/Operations', function(){
        // let cluml = new Cluml('#cluml');
        // let main = cluml.startNow();

        let c = new Class();
        let attrib = new Attribute('age: Int');
        let oper = new Operation('getAge()')

        //push and attribute and operation to the attributes array
        c.attributes.push(attrib);
        expect(c.getAttributes()).toContain(attrib);

        c.attributes.push(oper);
        expect(c.getAttributes()).toContain(oper);

        //sort the attributes; oper shouldn't be in c.attributes, it should be
        //in c.operations
        c.sortAttributions();
        expect(c.getAttributes).not.toContain(oper);
        expect(c.getOperations()).toContain(oper);
    });

    it('Should save and load', function() {
        let c = new Class();
        c.naming = "SavedClass";

        c.attributes.pop();
        let attribute = new Attribute('+attribute: String');
        c.attributes.push(attribute);

        c.operations.pop();
        let operation = new Operation('+Operation()');
        c.operations.push(operation);

        let width = c.width;
        let obj = c.saveComponent();
        c.loadComponent(obj);

        expect(c.naming).toEqual("SavedClass");
        expect(c.width).toEqual(width);
        expect(c.attributes.length).toEqual(1);
        expect(c.attributes[0].elementValue).toEqual(attribute.elementValue);
        expect(c.operations.length).toEqual(1);
        expect(c.operations[0].elementValue).toEqual(operation.elementValue);
    })
});