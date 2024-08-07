export default interface DoActionDelegate {
    (actionName: string, payload: any): Promise<any>;
}
