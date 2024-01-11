import {TNodeRole} from "../../../src/Cluml/SanityElement/TNodeRole";
import {SanityErrorInfo} from "../../../src/Cluml/SanityElement/SanityErrorInfo";

describe('TNodeRole', function(){
    it('Regex', function(){
        let roleOne = 'roleOne';
        let spaceError = 'role One';
        let spaceError2 = ' role one'
        let nonAlphaCharacters = 'roleOne!';
        let nonCamelCase = 'ROLEONE'

        //check a correct role
        let nodeRole = new TNodeRole(roleOne, undefined);
        let errors = nodeRole.processSanityCheck();
        console.log(errors);
        expect(errors).toEqual([]);

        //check a role with a space error version 1
        nodeRole.elementValue = spaceError;
        errors = nodeRole.processSanityCheck();
        for (let i = 0; i < errors.length; i++) {
            expect(errors[i].errorCode).toBe('CS0001')
        }

        //check a role with non alphanumeric characters
        nodeRole.elementValue = nonAlphaCharacters;
        errors = nodeRole.processSanityCheck();
        for (let i = 0; i < errors.length; i++) {
            expect(errors[i].errorCode).toBe('CS0002')
        }

        //check a role with incorrect camel case
        nodeRole.elementValue = nonCamelCase;
        errors = nodeRole.processSanityCheck();
        for (let i = 0; i < errors.length; i++) {
            expect(errors[i].errorCode).toBe('CS0003')
        }

    });
});