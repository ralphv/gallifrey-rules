import { GallifreyRulesEngine } from './GallifreyRulesEngine';
import { AssertNotNull, TypeAssertNotNull } from './lib/Utils';
import { GallifreyEventType } from './GallifreyEventType';
import {
    BaseActionPayload,
    BaseActionResponse,
    BaseDataObjectRequest,
    BaseDataObjectResponse,
} from './base-interfaces/BaseTypes';
import { EngineEventContext } from './lib/EngineEventContext';
import EngineCriticalError from './errors/EngineCriticalError';

/**
 * Allows for easier testing
 *  1. Disable actions
 *  2. Use pullDataObject hook to provide fake data
 */
export class GallifreyRulesEngineForTesting extends GallifreyRulesEngine {
    private disabledActions: { [key: string]: boolean } = {};
    private pullDataObjectHook: ((dataObjectName: string, request: any) => Promise<any>) | undefined;
    private dataObjectResponses: { [name: string]: { response: any }[] } = {};
    private lastEngineCreateContext: EngineEventContext | undefined;

    protected async createEngineEventContext(
        entityName: string,
        eventName: string,
        eventId: string,
        source: string,
        payload: any,
    ): Promise<EngineEventContext> {
        this.lastEngineCreateContext = await super.createEngineEventContext(
            entityName,
            eventName,
            eventId,
            source,
            payload,
        );
        return this.lastEngineCreateContext;
    }

    public getLastCreatedJournalLogger<T>() {
        return AssertNotNull(this.lastEngineCreateContext).getJournalLogger().getInternalJournalLogger() as T;
    }

    public disableAction(actionName: string) {
        this.disabledActions[actionName] = true;
    }

    public attachPullDataObjectHook(hook: (dataObjectName: string, request: any) => Promise<any>) {
        this.pullDataObjectHook = hook;
    }

    protected isActionDisabled(actionName: string) {
        return actionName in this.disabledActions;
    }

    protected isPullDataObjectHookAttached(name: string) {
        return (
            this.pullDataObjectHook !== undefined ||
            (name in this.dataObjectResponses && this.dataObjectResponses[name].length > 0)
        );
    }

    public addDataObjectResponse<DataObjectResponseType extends BaseDataObjectResponse>(
        name: string,
        response: DataObjectResponseType,
    ) {
        if (!this.dataObjectResponses[name]) {
            this.dataObjectResponses[name] = [];
        }
        this.dataObjectResponses[name].push({
            response,
        });
    }

    protected async callPullDataObject(dataObjectName: string, request: any) {
        if (dataObjectName in this.dataObjectResponses && this.dataObjectResponses[dataObjectName].length > 0) {
            const { response } = TypeAssertNotNull(this.dataObjectResponses[dataObjectName].shift());
            return response;
        }
        return await AssertNotNull(this.pullDataObjectHook)(dataObjectName, request);
    }

    public async testDoAction<
        ActionPayloadType extends BaseActionPayload,
        ActionResponseType extends BaseActionResponse,
    >(
        actionName: string,
        request: ActionPayloadType,
        event: GallifreyEventType<any> | undefined = undefined,
    ): Promise<ActionResponseType> {
        if (event === undefined) {
            event = {
                entityName: 'entity',
                eventName: 'event',
                source: 'source',
                eventId: '1',
                payload: {},
                eventLag: 0,
            };
        }
        const namespace = AssertNotNull(this.getNamespace());
        const internalEvent = {
            ...event,
            namespace,
        };
        const engineEventContext = await this.createEngineEventContext(
            internalEvent.entityName,
            internalEvent.eventName,
            event.eventId,
            event.source,
            event.payload,
        );
        return await this.doAction<ActionPayloadType, ActionResponseType>(
            internalEvent,
            engineEventContext,
            actionName,
            request,
        );
    }

    public async testPullDataObject<
        DataObjectRequestType extends BaseDataObjectRequest,
        DataObjectResponseType extends BaseDataObjectResponse,
    >(dataObjectName: string, request: any, event: GallifreyEventType<any> | undefined = undefined) {
        if (event === undefined) {
            event = {
                entityName: 'entity',
                eventName: 'event',
                source: 'source',
                eventId: '1',
                payload: {},
                eventLag: 0,
            };
        }
        const namespace = AssertNotNull(this.getNamespace());
        const internalEvent = {
            ...event,
            namespace,
        };
        const engineEventContext = await this.createEngineEventContext(
            internalEvent.entityName,
            internalEvent.eventName,
            event.eventId,
            event.source,
            event.payload,
        );
        return await this.pullDataObject<DataObjectRequestType, DataObjectResponseType>(
            internalEvent,
            engineEventContext,
            dataObjectName,
            request,
        );
    }

    public async testEventOnTopic(topic: string, topicMessage: any) {
        const consumerFound = this.getSchemaLoader()
            .getConsumers()
            .find((a) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const topics = a.config?.topics;
                if (!topics) return false;
                if (Array.isArray(topics)) {
                    return topics.includes(topic);
                }
                return topics === topic;
            });

        if (!consumerFound) {
            throw new EngineCriticalError(`Consumer could not be found for this topic: ${topic}`);
        }

        const instance = this.getInstancesFactory().getEventDispatcherProvider(
            AssertNotNull(consumerFound.eventDispatcher),
        );

        const event = instance.getEvent(topicMessage);
        await this.handleEvent<any>(event);
    }
}
