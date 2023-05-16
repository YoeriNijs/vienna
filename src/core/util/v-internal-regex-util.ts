export const escapeBracketsInRegex = (str: string): string => {
    return str.replace(/[\-\[]/g, "\\$&"); // eslint-disable-line
};

export const replaceAll = (str: string, find: string, replace: string): string => {
    if (!str || !find) {
        return str;
    }
    return str.replace(new RegExp(find, 'g'), replace);
}