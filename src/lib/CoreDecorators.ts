/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
/**
 * author: Ralph Varjabedian
 */
import hash from 'object-hash';
import EngineCriticalError from '../errors/EngineCriticalError';

//const AsyncFunction = (async () => {}).constructor;

let cache: { [key: string]: any } = {};
export function Cache(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    if (context.kind !== 'method') {
        throw new EngineCriticalError(`Decorator Cache is being used wrong on the method: ${methodName}`);
    }

    function replacement(this: any, ...args: any[]) {
        const key = hash({
            className: this?.constructor?.name || '',
            methodName,
            args,
        }).toString();

        if (key in cache) {
            return cache[key];
        }

        const result = originalMethod.apply(this, args);
        cache[key] = result;
        return result;
    }

    async function asyncReplacement(this: any, ...args: any[]) {
        const key = hash({
            className: this?.constructor?.name || '',
            methodName,
            args,
        }).toString();

        if (key in cache) {
            return cache[key];
        }

        const result = await originalMethod.apply(this, args);
        cache[key] = result;
        return result;
    }

    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
}

export function ClearCache() {
    cache = {};
}
