import {Association} from "../../../src/Cluml/Components/Association/Association";
import {TerminationNode} from "../../../src/Cluml/Components/Association/TerminationNode";
import {Main} from "../../../src/Cluml/Main";
import {Cluml} from "../../../src/Cluml/Cluml";


describe('Association', function(){
    it('Construct', function(){
        let cluml = new Cluml('#cluml');
        let main = cluml.startNow();
        let a = new Association();
        expect(a.fileLbl).toBe('Association');
    });
});