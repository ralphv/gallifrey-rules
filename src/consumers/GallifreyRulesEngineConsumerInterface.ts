import AfterHandleEventDelegate from '../delegates-interfaces/AfterHandleEventDelegate';
import { Consumer } from 'kafkajs';

export interface GallifreyRulesEngineConsumerInterface {
    setAfterHandleEventDelegate(ref: AfterHandleEventDelegate<any> | undefined): void;

    /**
     * Get direct access to the underlying KafkaJS object
     */
    getKafkaJSConsumer(): Consumer | undefined;
}
