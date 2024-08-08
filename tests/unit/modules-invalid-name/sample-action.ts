/* eslint-disable @typescript-eslint/no-unused-vars */
import ActionInterface from '../../../src/interfaces/Plugins/ActionInterface';
import EngineActionInterface from '../../../src/engine-interfaces/EngineActionInterface';
import EngineContextInterface from '../../../src/engine-interfaces/EngineContextInterface';
import EngineEventContextInterface from '../../../src/engine-interfaces/EngineEventContextInterface';
import { BaseActionPayload } from '../../../src/base-interfaces/BaseTypes';
import { GallifreyPlugin, PluginType } from '../../../src/interfaces/InterfaceDecorators';
import { EngineInterface } from '../../src';

interface SampleActionPayload extends BaseActionPayload {
    id: string;
}

@GallifreyPlugin(PluginType.Action)
export default class SampleAction implements ActionInterface<SampleActionPayload, void> {
    async trigger(engine: EngineActionInterface<SampleActionPayload>): Promise<void> {}
    getModuleName(): string {
        return 'Sample-action';
    }

    async getModuleNamespaces(): Promise<string[]> {
        return ['sample-namespace'];
    }
    async initialize(context: EngineInterface): Promise<void> {}
    async isEnabled(context: EngineEventContextInterface): Promise<boolean> {
        return true;
    }
}
