import AfterHandleEventDelegate from '../delegates-interfaces/AfterHandleEventDelegate';

export interface GallifreyRulesEngineConsumerInterface {
    setAfterHandleEventDelegate(ref: AfterHandleEventDelegate<any> | undefined): void;
}
