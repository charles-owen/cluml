const spaces = /\s/;
const nonAlphabetical = /[^A-Za-z]/;
const nonAlphanumeric = /[^A-Za-z0-9]/;

/**
 * Functions for checking names/types correctness.
 * @constructor
 */
export const Name = function()
{}


/**
 * Checks if the given name follows the given naming conventions
 * @param string the given name
 * @returns {*[]} list of error messages
 * @constructor
 */
Name.Check = function(string)
{
    let messages = [];
    if (spaces.test(string))
    {
        messages.push(`Name ${string} contains spaces.`);
    }
    if (nonAlphabetical.test(string[0]))
    {
        messages.push(`Name ${string} first character is not alphabetical.`);
    }
    if (nonAlphanumeric.test(string))
    {
        messages.push(`Name ${string} contains non alphanumeric characters.`);
    }
    return messages;
}