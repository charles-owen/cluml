export const SPACES_RX = /\s/;
export const NON_ALPHABETICAL_RX = /[^A-Za-z]/;
export const NON_ALPHANUMERIC_RX = /[^A-Za-z0-9\s]/;

/**
 * Functions for checking names/types correctness.
 * @constructor
 */
export const Name = function()
{}


/**
 * Checks if the given name follows the given naming conventions
 * @param string the given name
 * @returns {string[]} list of error messages
 * @constructor
 */
Name.Check = function(string)
{
    let messages = [];
    if (SPACES_RX.test(string))
    {
        messages.push(`Name <a>${string}</a> contains spaces.`);
    }
    if (NON_ALPHABETICAL_RX.test(string[0]))
    {
        messages.push(`Name <a>${string}</a> first character is not alphabetical.`);
    }
    if (NON_ALPHANUMERIC_RX.test(string))
    {
        messages.push(`Name <a>${string}</a> contains non-alphanumeric characters.`);
    }
    return messages;
}