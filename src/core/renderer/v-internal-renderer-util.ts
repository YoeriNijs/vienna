/**
 * This actually cast a string to an assumed type and value according
 * to some default parsing conventions. This is needed, because currently all values
 * that are retrieved from the template engine are sanitized strings.
 */
export const toAssumedTypeAndValue = (value: string): number | boolean | string => {
    if (value.startsWith('\'') && value.endsWith('\'')) {
        return value.substring(1, value.length - 1); // Cast as string without single quotes
    } else if (!isNaN(+value)) {
        return +value; // Cast as number
    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        return !!value; // Cast as boolean
    } else {
        return value; // It remains a string
    }
}