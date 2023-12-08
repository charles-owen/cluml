import {Name} from '../../../src/Cluml/Utility/Name';

describe('Name', function() {
    it('Should return error messages', function() {
        const spaces = 'n ame';
        const nonAlphanumeric = 'n_ame';
        const nonAlphabetical = '1ame';
        const notCapitalized = 'name';
        const capitalized = 'Name';

        let messages = Name.Check('','','', spaces);
        expect(messages.length === 1);
        expect(messages[0]['description']).toEqual( 'Name contains spaces');

        messages = Name.Check('','','', nonAlphanumeric);
        expect(messages.length === 1);
        expect(messages[0]['description']).toEqual('Name contains non-alphanumeric characters');

        messages = Name.Check('','','', nonAlphabetical);
        expect(messages.length === 1);
        expect(messages[0]['description']).toEqual('Name\'s first character is not alphabetical');

        messages = Name.Check('','','', notCapitalized, 'Name', true);
        expect(messages.length === 1);
        expect(messages[0]['description']).toEqual('Name\'s first character is not capitalized');

        messages = Name.Check('','','', capitalized, 'Name', false);
        expect(messages.length === 1);
        expect(messages[0]['description']).toEqual('Name\'s first character is capitalized');
    });
});
