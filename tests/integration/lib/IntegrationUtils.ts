import sinon from 'sinon';
import { Kafka } from 'kafkajs';
import EngineCriticalError from '../../../src/errors/EngineCriticalError';

export function findCallWithText(spy: sinon.SinonSpy, searchText: string) {
    const found = spy
        .getCalls()
        .find((call) => call.args.some((arg) => typeof arg === 'string' && arg.includes(searchText)));
    if (!found) {
        return null;
    }
    return found.args[0];
}

export async function produceIntoKafka<PayloadType>(
    brokers: string[],
    topic: string,
    key: string | undefined,
    payload: PayloadType,
) {
    const kafka = new Kafka({
        clientId: 'e2e-test',
        brokers,
    });

    const producer = kafka.producer();
    await producer.connect();

    await producer.send({
        topic: topic,
        messages: [{ key: key, value: JSON.stringify(payload) }],
    });

    await producer.disconnect();
}

export async function createTopics(brokers: string[], topics: string[], deleteFirst: boolean) {
    const kafka = new Kafka({
        clientId: 'e2e-test',
        brokers,
    });

    const admin = kafka.admin();

    try {
        await admin.connect();
        try {
            if (deleteFirst) {
                await admin.deleteTopics({ topics });
            }
        } catch {
            // ignore if it doesn't exist
        }
        await admin.createTopics({
            topics: topics.map((topic) => ({ topic })),
        });
    } finally {
        void admin.disconnect();
    }
}

export async function WaitForCondition(
    fn: () => boolean,
    maxWaitTimeInMilliseconds: number,
    intervalInMilliseconds: number = 100,
): Promise<void> {
    const startTime = Date.now();
    return new Promise<void>((resolve, reject) => {
        const checkCondition = () => {
            if (fn()) {
                resolve();
            } else if (Date.now() - startTime >= maxWaitTimeInMilliseconds) {
                reject(new Error('Timeout waiting for condition to be met'));
            } else {
                setTimeout(checkCondition, intervalInMilliseconds);
            }
        };
        checkCondition();
    });
}

const spiedCalls: { classRef: any; methodName: string; args: any[] }[] = [];

export function SpyCalls(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError(`Decorator SpyCalls is being used wrong on the method: ${methodName}`);
    }

    function replacement(this: any, ...args: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        spiedCalls.push({ classRef: this.constructor.name, methodName, args });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        return originalMethod.apply(this, args);
    }

    async function asyncReplacement(this: any, ...args: any[]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        spiedCalls.push({ classRef: this.constructor.name, methodName, args });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        return await originalMethod.apply(this, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
}

export function getSpiedCalls(classRef: any, methodName: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return spiedCalls.filter((spiedCall) => spiedCall.classRef === classRef && spiedCall.methodName === methodName);
}
