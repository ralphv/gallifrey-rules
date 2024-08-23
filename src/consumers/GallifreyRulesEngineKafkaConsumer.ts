import { GallifreyRulesEngineConsumerInterface } from './GallifreyRulesEngineConsumerInterface';
import AfterHandleEventDelegate from '../delegates-interfaces/AfterHandleEventDelegate';
import { KafkaConsumer } from '../KafkaConsumer';
import { Consumer } from 'kafkajs';

export default class GallifreyRulesEngineKafkaConsumer implements GallifreyRulesEngineConsumerInterface {
    constructor(private kafkaConsumer: KafkaConsumer) {}

    setAfterHandleEventDelegate(ref: AfterHandleEventDelegate<any> | undefined): void {
        this.kafkaConsumer.setAfterHandleEventDelegate(ref);
    }

    getKafkaJSConsumer(): Consumer | undefined {
        return this.kafkaConsumer.getKafkaJSConsumer();
    }
}
