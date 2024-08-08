import ActionInterface from '../../../../src/interfaces/Plugins/ActionInterface';
import EngineActionInterface from '../../../../src/engine-interfaces/EngineActionInterface';
import EngineEventContextInterface from '../../../../src/engine-interfaces/EngineEventContextInterface';
import { BaseActionPayload } from '../../../../src';
import { GallifreyPlugin, PluginType } from '../../../../src';

interface SampleActionPayload extends BaseActionPayload {
    id: string;
}

@GallifreyPlugin(PluginType.Action)
export default class SampleAction implements ActionInterface<SampleActionPayload, any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async trigger(engine: EngineActionInterface<SampleActionPayload>): Promise<void> {}
    getModuleName(): string {
        return 'sample-action';
    }

    async getModuleNamespaces(): Promise<string[]> {
        return ['sample-namespace'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isEnabled(context: EngineEventContextInterface): Promise<boolean> {
        return true;
    }
}
