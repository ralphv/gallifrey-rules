export declare class KafkaConsumerLagCalculator {
    static fetchTopicOffsets(clientId: string, brokers: string[], topic: string): Promise<(import("kafkajs").PartitionOffset & {
        high: string;
        low: string;
    })[] | null>;
}
