/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
/**
 * author: Ralph Varjabedian
 */
import { logger } from './logger';
import CriticalError from '../errors/CriticalError';
import EngineCriticalError from '../errors/EngineCriticalError';
import { Metrics } from './Metrics';
import InfluxDBMetricsProvider from '../modules/InfluxDBMetricsProvider';

//const AsyncFunction = (async () => {}).constructor;

export function DontThrowJustLog(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError(`Decorator DontThrowJustLog is being used wrong on the method: ${methodName}`);
    }

    function replacement(this: any, ...args: any[]) {
        try {
            // in static, this is the class reference
            return originalMethod.apply(this, args);
        } catch (e) {
            if (e instanceof CriticalError) {
                throw e;
            }
            logger.error(
                `method "${methodName}" threw an exception but is marked to not throw: ${String(e)} @${String((e as Error).stack ?? '')}`,
            );
        }
    }

    async function asyncReplacement(this: any, ...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (e) {
            if (e instanceof CriticalError) {
                throw e;
            }
            logger.error(
                `async method "${methodName}" threw an exception but is marked to not throw: ${String(e)} @${String((e as Error).stack ?? '')}`,
            );
        }
    }

    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
    //return originalMethod instanceof AsyncFunction ? asyncReplacement : replacement; // this was failing when transpiled to node js!
}

export function TimeAndWarn(thresholdMS = 10) {
    return (originalMethod: any, context: ClassMethodDecoratorContext) => {
        const methodName = String(context.name);
        if (context.kind !== 'method') {
            throw new EngineCriticalError(`Decorator TimeAndWarn is being used wrong on the method: ${methodName}`);
        }

        function replacement(this: any, ...args: any[]) {
            const start = performance.now();
            try {
                return originalMethod.apply(this, args);
            } finally {
                const end = performance.now();
                const duration = end - start;
                if (duration >= thresholdMS) {
                    logger.warn(
                        `Warning: Function "${methodName}" execution time ${duration.toFixed(2)}ms exceeded the threshold of ${thresholdMS}ms. @${new Error().stack}`,
                    );
                }
            }
        }

        async function asyncReplacement(this: any, ...args: any[]) {
            const start = performance.now();
            try {
                return await originalMethod.apply(this, args);
            } finally {
                const end = performance.now();
                const duration = end - start;
                if (duration > thresholdMS) {
                    logger.warn(
                        `Warning: Function "${methodName}" execution time ${duration.toFixed(2)}ms exceeded the threshold of ${thresholdMS}ms. @${new Error().stack}`,
                    );
                }
            }
        }

        return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
    };
}

const cleanupFunctions: (() => Promise<void>)[] = [];

export function BeforeExit(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    if (context.kind !== 'method') {
        throw new EngineCriticalError(`Decorator BeforeExit is being used wrong on the method: ${methodName}`);
    }
    if (context.kind === 'method' && typeof originalMethod === 'function' && originalMethod.length > 0) {
        throw new EngineCriticalError(`Decorator BeforeExit can only be used on methods without parameters.`);
    }

    context.addInitializer(function () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance: any = this;
        cleanupFunctions.push(async () => {
            try {
                return instance[methodName]();
            } catch (e) {
                console.trace(
                    `Cleanup method "${methodName}" from BeforeExit decorator threw an exception: ${String(e)}`,
                );
            }
        });
    });
}

let beforeExitCalled = false;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('beforeExit', async () => {
    /* istanbul ignore if */
    if (beforeExitCalled || cleanupFunctions.length === 0) {
        return;
    }
    beforeExitCalled = true;
    console.log('Process beforeExit, starting cleanup.');
    await Promise.allSettled(cleanupFunctions.map((a) => a()));
    console.log('Cleanup done. Exiting now.');
});

export function TimeIt(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError(`Decorator TimeIt is being used wrong on the method: ${methodName}`);
    }

    function replacement(this: any, ...args: any[]) {
        const start = performance.now();
        try {
            return originalMethod.apply(this, args);
        } finally {
            _timeIt(this.constructor.name, methodName, performance.now() - start);
        }
    }

    async function asyncReplacement(this: any, ...args: any[]) {
        const start = performance.now();
        try {
            return await originalMethod.apply(this, args);
        } finally {
            _timeIt(this.constructor.name, methodName, performance.now() - start);
        }
    }

    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
}

let metrics: Metrics | undefined;
function _timeIt(className: string, methodName: string, timerInMs: number) {
    if (!metrics) {
        metrics = new Metrics(new InfluxDBMetricsProvider()); //todo hardcoded for now as this needs to run outside the engine
    }
    void metrics.timeIt(className, methodName, timerInMs);
}
