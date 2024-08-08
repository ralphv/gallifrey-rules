/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-member-access */
import ActionInterface from '../../../src/interfaces/Plugins/ActionInterface';
import EngineActionInterface from '../../../src/engine-interfaces/EngineActionInterface';
import EngineEventContextInterface from '../../../src/engine-interfaces/EngineEventContextInterface';
import { BaseActionPayload } from '../../../src';
import { GallifreyPlugin, PluginType } from '../../../src';

interface SampleActionPayload extends BaseActionPayload {
    id: string;
}

@GallifreyPlugin(PluginType.Action)
export default class SampleAction implements ActionInterface<SampleActionPayload, void> {
    async trigger(engine: EngineActionInterface<SampleActionPayload>): Promise<void> {}
    getModuleName(): string {
        return 'sample-action';
    }

    async getModuleNamespaces(): Promise<string[]> {
        return ['sample-namespace'];
    }
    async isEnabled(context: EngineEventContextInterface): Promise<boolean> {
        return true;
    }
}
