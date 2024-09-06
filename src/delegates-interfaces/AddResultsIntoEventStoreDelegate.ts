export default interface AddResultsIntoEventStoreDelegate {
    (value: any): Promise<void>;
}
