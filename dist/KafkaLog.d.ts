import { LogEntry } from 'kafkajs';
export default class KafkaLog {
    static getLogCreator(): () => ({ level, log }: LogEntry) => void;
}
