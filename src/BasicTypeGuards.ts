import EngineCriticalError from './errors/EngineCriticalError';

export function IsString(value: any, optional: boolean = false): value is string {
    return typeof value === 'string' || (optional && value === undefined);
}

export function IsNumber(value: any, optional: boolean = false): value is number {
    return typeof value === 'number' || (optional && value === undefined);
}

export function IsBoolean(value: any, optional: boolean = false): value is boolean {
    return typeof value === 'boolean' || (optional && value === undefined);
}

export function IsArray<T>(
    value: any,
    optional: boolean = false,
    elementFn: ((value: any, optional: boolean) => boolean) | undefined = undefined,
): value is Array<T> {
    const isArray = Array.isArray(value) || (optional && value === undefined);
    if (!isArray) {
        return false;
    }
    if (elementFn && value) {
        return !(value as []).some((e: any) => !elementFn(e, optional));
    }
    return true;
}

export function IsNotNull<T>(value: T | null): value is T {
    return value !== null;
}

export function IsObject(value: unknown, optional: boolean = false): value is object {
    return (typeof value === 'object' && value !== null) || (optional && value === undefined);
}

export function AssertTypeGuard(fn: (value: any) => boolean, value: any) {
    if (!fn(value)) {
        throw new EngineCriticalError(`AssertTypeGuard failed for ${fn.name}`);
    }
}
