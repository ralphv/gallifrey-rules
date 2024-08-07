export declare function AssertNotNull<T>(input: T | undefined | null): T;
export declare function TypeAssertNotNull<T>(input: T | undefined | null): T;
export declare function produce(clientId: string, brokers: string[], topic: string, key: string | undefined, payload: any): Promise<void>;
export declare function deployKafkaConnectConnector(url: string, connectorConfig: any): Promise<void>;
export declare function deleteKafkaConnectConnector(url: string, connectorName: string): Promise<void>;
