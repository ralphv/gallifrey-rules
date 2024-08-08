/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-member-access */
import { EngineFilterInterface, FilterInterface, GallifreyPlugin, PluginType } from '../../../../src';

@GallifreyPlugin(PluginType.Filter)
export default class SampleFilter implements FilterInterface<any> {
    async canContinue(engine: EngineFilterInterface<any>): Promise<boolean> {
        engine.getMetricsPoint(`test`);
        if (engine.getEventPayload()?.throw) {
            throw new Error('throwing');
        }
        return engine.getEventPayload()?.stop !== true;
    }

    getModuleName(): string {
        return 'sample-filter';
    }
}
