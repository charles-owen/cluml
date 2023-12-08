import {Association, NodeData} from "../../../src/Cluml/Components/Association/Association";
import {TerminationNode} from "../../../src/Cluml/Components/Association/TerminationNode";
import {Main} from "../../../src/Cluml/Main";
import {Cluml} from "../../../src/Cluml/Cluml";
import {Class} from "../../../src/Cluml/Components/Class";
import Vector from "../../../src/Cluml/Utility/Vector";


describe('Association', function(){
    it('Construct', function(){
        let cluml = new Cluml('#cluml');
        let main = cluml.startNow();
        let a = new Association();
        expect(a.fileLbl).toBe('Association');
    });
    it("Should save and load", function() {
        let a = new Association();
        a.nodes = new NodeData(a);

        let obj = a.saveComponent();
        a.loadComponent(obj);
        expect(a.nodes).not.toBeUndefined();
    })
});