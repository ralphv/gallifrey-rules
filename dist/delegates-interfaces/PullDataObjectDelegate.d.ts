export default interface PullDataObjectDelegate {
    (dataObjectName: string, request?: any): Promise<any>;
}
