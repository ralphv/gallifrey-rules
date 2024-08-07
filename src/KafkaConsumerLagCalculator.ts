import { Kafka } from 'kafkajs';
import { logger } from './lib/logger';
import KafkaLog from './KafkaLog';
export class KafkaConsumerLagCalculator {
    public static async fetchTopicOffsets(clientId: string, brokers: string[], topic: string) {
        const kafka = new Kafka({
            clientId,
            brokers,
            logCreator: KafkaLog.getLogCreator(),
        });
        const admin = kafka.admin();
        try {
            await admin.connect();
            return await admin.fetchTopicOffsets(topic);
        } catch (e) {
            logger.error(`Exception from calculateLags: ${String(e)} @${String((e as Error).stack ?? '')}`);
            return null;
        } finally {
            await admin.disconnect();
        }
    }
}
