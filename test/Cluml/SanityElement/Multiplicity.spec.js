import {Multiplicity} from "../../../src/Cluml/SanityElement/Multiplicity";

describe('Multiplicity', function(){
    it('Regex', function(){
        let range = '1..3';
        let infRange = '1..*';
        let number = '1';
        let inf = '*';
        let invalidMult = '1a*'

        let mult = new Multiplicity(range, undefined);
        expect(mult.multiplicityType).toBe(Multiplicity.MultiplicityType.NumberToNumber);

        mult.elementValue = infRange;
        mult.processSanityCheck();
        expect(mult.multiplicityType).toBe(Multiplicity.MultiplicityType.NumberToAny);

        mult.elementValue = number;
        mult.processSanityCheck();
        expect(mult.multiplicityType).toBe(Multiplicity.MultiplicityType.NumberOnly);

        mult.elementValue = inf;
        mult.processSanityCheck();
        expect(mult.multiplicityType).toBe(Multiplicity.MultiplicityType.AnyOnly);

        mult.elementValue = invalidMult;
        mult.processSanityCheck();
        expect(mult.multiplicityType).toBe(Multiplicity.MultiplicityType.Invalid);
    });
});