export class AttrLabel {
    //region Enums
    static LabelType = {
        Invalid: 'Invalid',
        Valid: 'Valid'
    }
    //endregion

    //region Fields
    /**
     * The attribute label value.
     * @type {string}
     */
    stringValue = '';
    //endregion

    //region Constructors
    /**
     * Creates a new attribute label.
     * @param stringValue {string}
     */
    constructor(stringValue) {
        this.stringValue = stringValue;
    }
    //endregion
}