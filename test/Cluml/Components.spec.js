import {Components} from "../../src/Cluml/Components";
import {Class} from "../../src/Cluml/Components/Class";
import {Association} from "../../src/Cluml/Components/Association/Association";

describe('Component', function() {
    it('Constructor', function() {
        let con = new Components();

        expect(con.get('Association')).toBe(null);

        con.add(Class);

        expect(con.get('Class')).toBe(Class);
        expect(con.get('Association')).toBe(null);

        //importing from class causes a weird error and everything to crash.
        //same thing with associations.
        //The thing thats causing it to crash relates back to the dialog box for some reason
        //will examine later
    });
});