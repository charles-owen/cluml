import {Cluml} from "../../src/Cluml/Cluml";
import {Diagram} from "../../src/Cluml/Diagram";

describe('Diagram', function(){
    it('Construct', function(){
        let cluml = new Cluml('#cluml');
        let diagram = new Diagram('diagram1');

        expect(diagram.name).toBe('diagram1');
    })
})