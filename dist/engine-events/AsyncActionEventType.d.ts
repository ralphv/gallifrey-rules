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
export declare function IsTypeAsyncActionEventType(value: any): value is AsyncActionEventType<any>;
