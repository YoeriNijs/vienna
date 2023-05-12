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

    if (typeof obj !== 'object') {
        return obj;
    }

    if (!path || path.length < 0) {
        return undefined;
    }

    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    path = path.split('|')[0].trim(); // remove pipes

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

export const getDefinedOrElseDefault = <T>(obj: T, defaultValue: T): T => {
    if (obj !== undefined && obj !== null) {
        return obj;
    } else {
        return defaultValue;
    }
}

export const doWhenDefined = <T>(obj: T, fn: (v?: T) => void): void => {
    if (obj !== undefined && obj !== null) {
        fn(obj);
    }
}

export const getAllMethods = (obj: any): string[] => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter((item: any) => typeof obj[item] === 'function') as unknown[] as string[];
}
