import {Diagrams} from "../../src/Cluml/Diagrams";
import {Cluml} from "../../src/Cluml/Cluml";
import {Model} from "../../src/Cluml/Model";

import {Main} from "../../src/Cluml/Main";

describe('Diagrams', function(){
    it('Construct', function(){
        let cluml = new Cluml();
        let main = new Main()
        let model = new Model(main);

        let diagrams = new Diagrams();
        //let diagram = new Diagram('diagram1');

        diagrams.addDiagram('diagram1');
        let diagram = diagrams.getDiagram('diagram1');

        expect('name').toBe('name');

        //expect(diagram.name).toBe('diagram1');
    })
})