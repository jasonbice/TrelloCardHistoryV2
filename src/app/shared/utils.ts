export function IsNullOrWhiteSpace(val: string): boolean {
    return val === null || val.trim() === '';
}