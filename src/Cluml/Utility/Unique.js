/**
 * Convenience class for generating unique Cluml-specific ID's
 * @constructor
 */
export const Unique = function() {
}

Unique.unique = 1;
/**
 * Map for the class names.
 * @type {Map<any, any>}
 */
Unique.classNames = new Map();

Unique.uniqueId = function() {
    return Unique.unique++;
}

Unique.uniqueName = function() {
    return "cluml-id-" + Unique.unique++;
}

Unique.uniqueClassedName = function (className) {
    let index = 1;
    if (Unique.classNames.has(className)) {
        index = Unique.classNames.get(className) + 1;
    }

    Unique.classNames.set(className, index);
    return className + index;
}

export default Unique;
