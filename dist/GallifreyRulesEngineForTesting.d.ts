import { GallifreyRulesEngine } from './GallifreyRulesEngine';
/**
 * Allows for easier testing
 *  1. Disable actions
 *  2. Use pullDataObject hook to provide fake data
 */
export declare class GallifreyRulesEngineForTesting extends GallifreyRulesEngine {
    private disabledActions;
    private pullDataObjectHook;
    disableAction(actionName: string): void;
    attachPullDataObjectHook(hook: (dataObjectName: string, request: any) => Promise<any>): void;
    protected isActionDisabled(actionName: string): boolean;
    protected isPullDataObjectHookAttached(): boolean;
    protected callPullDataObject(dataObjectName: string, request: any): Promise<any>;
}
