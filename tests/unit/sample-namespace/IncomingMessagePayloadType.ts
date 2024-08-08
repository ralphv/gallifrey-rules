export interface IncomingMessagePayloadType {
    throwWarning?: boolean;
    throwInfo?: boolean;
    throwError?: boolean;
    throwCriticalError?: boolean;
    throwEngineCriticalError?: boolean;
    dataObjectThrow?: boolean;
    actionThrow?: boolean;
    dataObjectNotFound?: boolean;
    actionNotFound?: boolean;
    stop?: boolean;
    throw?: boolean;
}
