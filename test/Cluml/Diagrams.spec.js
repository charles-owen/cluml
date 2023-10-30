import {Diagrams} from "../../src/Cluml/Diagrams";
import {Cluml} from "../../src/Cluml/Cluml";
import {Model} from "../../src/Cluml/Model";
import {Main} from "../../src/Cluml/Main";
import {Diagram} from "../../src/Cluml/Diagram";

//outside of the main classes, I get to do unit tests for;
//Multiplicity.js, TNodeRole.js


describe('Diagrams', function(){
    it('Construct', function(){
        let cluml = new Cluml('#cluml');
        let model = new Model(cluml);
        let diagrams = new Diagrams(model);

        expect(diagrams.model).toBe(model);

        diagrams.addDiagram('diagram1');
        let diagram = diagrams.getDiagram('diagram1');

        expect('name').toBe('name');
    })
})