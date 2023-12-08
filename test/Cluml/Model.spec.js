import {Model} from "../../src/Cluml/Model";
import {Cluml} from "../../src/Cluml/Cluml";

describe('Model', function() {
    it('Construct', function() {
        var cluml = new Cluml('#cluml');
        var main = cluml.startNow();
        var model = new Model(main);

        expect(model.main).toBe(main);
    });
});