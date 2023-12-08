export const Side = {
    Top: 0,
    Above: 0,
    North: 0,
    Right: 1,
    East: 1,
    Bottom: 2,
    Down: 2,
    South: 2,
    Left: 3,
    West: 3,
    Invalid: -1
}

/**
 * Parses the fractional side into a whole number side.
 * @param side {number}
 */
Side.parseFractional = function(side) {
    const rounded = Math.floor(side);

    if (rounded <= Side.West && rounded <= Side.North) {
        return rounded;
    } else {
        return Side.Invalid;
    }
}

export default Side;