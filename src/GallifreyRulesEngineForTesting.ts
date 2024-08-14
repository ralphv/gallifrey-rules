import { GallifreyRulesEngine } from './GallifreyRulesEngine';
import { AssertNotNull } from './lib/Utils';
import { GallifreyEventType } from './GallifreyEventType';
import {
    BaseActionPayload,
    BaseActionResponse,
    BaseDataObjectRequest,
    BaseDataObjectResponse,
} from './base-interfaces/BaseTypes';

/**
 * Allows for easier testing
 *  1. Disable actions
 *  2. Use pullDataObject hook to provide fake data
 */
export class GallifreyRulesEngineForTesting extends GallifreyRulesEngine {
    private disabledActions: { [key: string]: boolean } = {};
    private pullDataObjectHook: ((dataObjectName: string, request: any) => Promise<any>) | undefined;

    public disableAction(actionName: string) {
        this.disabledActions[actionName] = true;
    }

    public attachPullDataObjectHook(hook: (dataObjectName: string, request: any) => Promise<any>) {
        this.pullDataObjectHook = hook;
    }

    protected isActionDisabled(actionName: string) {
        return actionName in this.disabledActions;
    }

    protected isPullDataObjectHookAttached() {
        return this.pullDataObjectHook !== undefined;
    }

    protected async callPullDataObject(dataObjectName: string, request: any) {
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
        );
        return await this.pullDataObject<DataObjectRequestType, DataObjectResponseType>(
            internalEvent,
            engineEventContext,
            dataObjectName,
            request,
        );
    }
}
