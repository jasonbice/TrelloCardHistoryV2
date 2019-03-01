export function IsNullOrWhiteSpace(val: string): boolean {
    return val === null || val.trim() === '';
}

export function getDistinctObjectArray(array: any, distinctOnProperty: string) {
    return array.filter((obj, pos, arr) => {
        return arr.map(obj => obj[distinctOnProperty]).indexOf(obj[distinctOnProperty]) === pos;
    });
}