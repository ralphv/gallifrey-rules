"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GallifreyRulesEngineKafkaConsumer {
    constructor(kafkaConsumer) {
        this.kafkaConsumer = kafkaConsumer;
    }
    setAfterHandleEventDelegate(ref) {
        this.kafkaConsumer.setAfterHandleEventDelegate(ref);
    }
}
exports.default = GallifreyRulesEngineKafkaConsumer;
