import {SPACES_RX, NON_ALPHANUMERIC_RX, NON_ALPHABETICAL_RX} from "../SanityElement/SanityRegExpressions";
import {SanityErrorInfo} from "../SanityElement/SanityErrorInfo";

/**
 * Functions for checking names/types correctness.
 * @constructor
 */
export const Name = function()
{}


/**
 * Checks if a given name/type follows the correct format
 * @param errorCode The starting error code for the errors
 * @param elementType The type of SanityElement
 * @param elementName The identifier of the sanity element that's raising the error
 * @param string The string that's being checked
 * @param prefix Prefix for the error message (should be Name, Type, etc.)
 * @param capitalized Checks for capitalization
 * @returns {SanityErrorInfo[]} List of error messages
 * @constructor
 */
Name.Check = function(errorCode, elementType, elementName, string, prefix= "Name", capitalized= null)
{
    let messages = [];
    if (string.length === 0)
        return messages;

    if (SPACES_RX.test(string))
    {
        messages.push(new SanityErrorInfo(`${errorCode}`.padStart(4, '0'),
                                          elementType, elementName, `${prefix} contains spaces`))
    }
    if (NON_ALPHANUMERIC_RX.test(string))
    {
        messages.push(new SanityErrorInfo(`${errorCode + 1}`.padStart(4, '0'),
                                          elementType, elementName, `${prefix} contains non-alphanumeric characters`));
    }
    if (NON_ALPHABETICAL_RX.test(string[0]))
    {
        messages.push(new SanityErrorInfo(`${errorCode + 2}`.padStart(4, '0'),
                                          elementType, elementName, `${prefix}'s first character is not alphabetical`));
    }
    else if (capitalized === true && string[0].toUpperCase() !== string[0])
    {
        messages.push(new SanityErrorInfo(`${errorCode + 3}`.padStart(4, '0'),
                                          elementType, elementName, `${prefix}'s first character is not capitalized`));
    }
    else if (capitalized === false && string[0].toUpperCase() === string[0])
    {
        messages.push(new SanityErrorInfo(`${errorCode + 3}`.padStart(4, '0'),
                                          elementType, elementName, `${prefix}'s first character is capitalized`));
    }

    return messages;
}