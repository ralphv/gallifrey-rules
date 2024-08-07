import EngineCriticalError from '../errors/EngineCriticalError';
import { Kafka } from 'kafkajs';
import axios from 'axios';

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
