export const escapeBracketsInRegex = (str: string): string => {
    return str.replace(/[\-\[]/g, "\\$&"); // eslint-disable-line
};