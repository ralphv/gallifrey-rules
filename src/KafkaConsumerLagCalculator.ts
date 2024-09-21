import { Kafka } from 'kafkajs';
import { logger } from './lib/logger';
import KafkaLog from './KafkaLog';
import { fe } from './lib/Utils';
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
            logger.error(`Exception from calculateLags: ${fe(e)}`);
            return null;
        } finally {
            await admin.disconnect();
        }
    }
}
