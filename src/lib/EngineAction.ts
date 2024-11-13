import { BaseActionPayload } from '../base-interfaces/BaseTypes';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineBase from './EngineBase';
import { EngineActionInterface } from '../engine-interfaces';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import { EngineEventContext } from './EngineEventContext';

export default class EngineAction<ActionPayloadType extends BaseActionPayload>
    extends EngineBase
    implements EngineActionInterface<ActionPayloadType>
{
    constructor(
        configurationAccessor: ConfigurationAccessorInterface,
        engineEventContext: EngineEventContext,
        loggerName: string,
        private payload: ActionPayloadType,
        journalLogger: JournalLoggerInterface,
        getMetricsPointDelegate: GetMetricsPointDelegate,
        private isAsyncQueuedAction: boolean,
    ) {
        super(
            engineEventContext,
            engineEventContext,
            configurationAccessor,
            loggerName,
            journalLogger,
            getMetricsPointDelegate,
            engineEventContext.getLogger(),
        );
    }

    getPayload(): ActionPayloadType {
        return this.payload;
    }

    isAsyncQueued(): boolean {
        return this.isAsyncQueuedAction;
    }
}
