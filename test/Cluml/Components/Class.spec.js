import {Cluml} from "../../../src/Cluml/Cluml";
import {Main} from "../../../src/Cluml/Main";
import {Class} from "../../../src/Cluml/Components/Class";
import {Attribute} from "../../../src/Cluml/SanityElement/Attribute";
import {Operation} from "../../../src/Cluml/SanityElement/Operation";
import {Diagram} from "../../../src/Cluml/Diagram";
import {Diagrams} from "../../../src/Cluml/Diagrams";

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
});