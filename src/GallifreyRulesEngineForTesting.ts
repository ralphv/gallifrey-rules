import { GallifreyRulesEngine } from './GallifreyRulesEngine';
import { AssertNotNull } from './lib/Utils';

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
}
