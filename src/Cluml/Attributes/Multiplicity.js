/**
 * Regex for the multiplicities with
 * @type {RegExp}
 */
const numberToNumber = /\d+\.\.\d+/
const numberToAny = /\d+\.\.\*/
const numberOnlyRX = /\d+/;
const anyOnlyRX = /\*/;

export class Multiplicity {

    //region Enums
    static MultiplicityType = {
        Invalid: 'Invalid',
        NumberOnly: 'NumberOnly',           // Like 1
        AnyOnly: 'AnyOnly',                 // *
        NumberToNumber: 'NumberToNumber',   // Like 1..9
        NumberToAny: 'NumberToAny',         // Like 1..*
    };
    //endregion

    //region Fields
    /**
     * The multiplicity value.
     * @type {string}
     */
    stringValue = '';

    /**
     * The type of multiplicity.
     * @type {string}
     */
    multType = Multiplicity.MultiplicityType.Invalid;
    //endregion

    //region Constructors
    /**
     * Creates a new multiplicity from the provided string.
     * @param stringValue {string} The string value.
     */
    constructor(stringValue) {
        this.stringValue = stringValue;
        if (numberToNumber.test(stringValue)) {
            this.multType = Multiplicity.MultiplicityType.NumberToNumber;
        }
        else if (numberToAny.test(stringValue)) {
            this.multType = Multiplicity.MultiplicityType.NumberToAny;
        }
        else if (numberOnlyRX.test(stringValue)) {
            this.multType = Multiplicity.MultiplicityType.NumberOnly;
        }
        else if (numberOnlyRX.test(stringValue)) {
            this.multType = Multiplicity.MultiplicityType.AnyOnly;
        }
        else {
            this.multType = Multiplicity.MultiplicityType.Invalid;
        }
    }
    //endregion
}