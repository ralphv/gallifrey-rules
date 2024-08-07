/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EnabledInterface from '../../base-interfaces/EnabledInterface';
import { EngineFilterInterface } from '../../engine-interfaces';
import { BaseEventPayload } from '../../base-interfaces/BaseTypes';

export default interface FilterInterface<EventPayloadType extends BaseEventPayload>
    extends ModuleInterface,
        EnabledInterface {
    canContinue(engine: EngineFilterInterface<EventPayloadType>): Promise<boolean>;
}

export class __FilterInterface implements FilterInterface<any> {
    getModuleName(): string {
        return '';
    }

    canContinue(engine: EngineFilterInterface<any>): Promise<boolean> {
        return Promise.resolve(false);
    }
}
