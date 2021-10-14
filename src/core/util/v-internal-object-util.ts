/**
 * Find a nested field by a provided path.
 *
 * const obj = { person: { name: 'Bert' } };
 * const path = 'person.name';
 * const result = getNestedPropertyByStringPath(obj, path); // 'Bert'
 *
 * See: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
 */
export const getNestedPropertyByStringPath = (obj: any, path: string): any => {
    if (!obj || Object.keys(obj).length < 1) {
        return undefined;
    }

    if (!path || path.length < 0) {
        return undefined;
    }

    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');

    const nested = path.split('.');
    if (!nested) {
        return undefined;
    }

    for (let i = 0; i < nested.length; ++i) {
        let k = nested[i];
        if (k && k in obj) {
            obj = obj[k];
        }
    }

    return obj;
}

export const getDefinedOrElse = <T>(obj: T, fn: () => void): T => {
    if (obj !== undefined && obj !== null) {
        return obj;
    } else {
        fn();
    }
}
