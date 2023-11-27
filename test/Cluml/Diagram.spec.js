import {Cluml} from "../../src/Cluml/Cluml";
import {Diagram} from "../../src/Cluml/Diagram";
import {Class} from "../../src/Cluml/Components/Class"
import {Component} from "../../src/Cluml/Component";
import {Diagrams} from "../../src/Cluml/Diagrams";

describe('Diagram', function(){
    it('Construct', function(){
        let cluml = new Cluml('#cluml');
        let diagram = new Diagram('diagram1');

        expect(diagram.name).toBe('diagram1');
    });
    it('Should get components', function() {
       let diagram = new Diagram('diagram');
       let c = new Class();
       c.naming = 'ClassName';

       diagram.add(c);
       let components = diagram.getComponentsByType("Class");
       expect(components.length).toBe(1);
       expect(components[0]).toBe(c);

       let component = diagram.getComponentByNaming(c.naming);
       expect(component).toBe(c);
    });
    it('Should save and load', function() {
        let diagram = new Diagram('diagram');
        let obj = diagram.save();
        diagram.load(obj);
        expect(diagram.name).toBe('diagram');
    });
})