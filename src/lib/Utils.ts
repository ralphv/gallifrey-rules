import EngineCriticalError from '../errors/EngineCriticalError';
import { Kafka } from 'kafkajs';
import axios from 'axios';
import { SecretString } from './BaseConfig';

export function Expect<T>(input: T): T {
    return input;
}

export function AssertNotNull<T>(input: T | undefined | null): T {
    if (input === null || input === undefined) {
        console.trace(`AssertNotNull failed`);
        throw new EngineCriticalError(`AssertNotNull failed`);
    }
    return input;
}

export function TypeAssertNotNull<T>(input: T | undefined | null): T {
    return input as T;
}

export async function produce(
    clientId: string,
    brokers: string[],
    topic: string,
    key: string | undefined,
    payload: any,
) {
    const kafka = new Kafka({
        clientId,
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

export async function deployKafkaConnectConnector(url: string, connectorConfig: any) {
    try {
        const response = await axios.post(`${url}/connectors`, connectorConfig, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Connector deployed successfully.');
        console.debug(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deploying connector:', error.message);
            console.error('Response data:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

export async function deleteKafkaConnectConnector(url: string, connectorName: string) {
    const connectRestUrl = `${url}/connectors/${connectorName}`;

    try {
        const response = await axios.delete(connectRestUrl);
        console.log(`Connector ${connectorName} deleted successfully`, response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Failed to delete connector ${connectorName}:`, error.response?.data || error.message);
        } else {
            console.error(`Unexpected error:`, error);
        }
    }
}

export function ObjectWithSecret<KeyType extends string, ValueType, ObjectType extends object>(
    key: KeyType,
    secret: ValueType,
    obj?: ObjectType,
): ObjectType & { [K in KeyType]: SecretString } {
    if (!obj) {
        obj = {} as ObjectType;
    }
    // @ts-expect-error ignore
    obj[key] = new SecretString(secret);
    return obj as ObjectType & { [K in KeyType]: SecretString };
}

type Secrets<T extends string> = { [K in T]: any };
export function ObjectWithSecrets<KeyType extends string, ObjectType extends object>(
    secrets: Secrets<KeyType>,
    obj?: ObjectType,
): ObjectType & { [K in KeyType]: SecretString } {
    if (!obj) {
        obj = {} as ObjectType;
    }
    for (const [key, secret] of Object.entries(secrets)) {
        // @ts-expect-error ignore
        obj[key] = new SecretString(secret);
    }
    return obj as ObjectType & { [K in KeyType]: SecretString };
}

export function ObjectWithoutSecrets<T extends { [key: string]: any }>(obj: T): T {
    const copy: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(obj)) {
        copy[key] = value instanceof SecretString ? value.getSecretValue() : value;
    }

    return copy as T;
}
