/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { IsObject, IsString } from '../BasicTypeGuards';

/**
 * This is the payload that we use to represent internally
 */
export interface AsyncActionEventType<PayloadType> {
    namespace: string;
    actionName: string;
    payload: PayloadType;
    entityName: string;
    eventName: string;
    eventId: string;
}

export function IsTypeAsyncActionEventType(value: any): value is AsyncActionEventType<any> {
    return (
        value !== null &&
        value !== undefined &&
        IsString(value.namespace) &&
        IsString(value.actionName) &&
        IsString(value.entityName) &&
        IsString(value.eventName) &&
        IsString(value.eventId) &&
        IsObject(value.payload)
    );
}
