/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import EnabledInterface from '../../base-interfaces/EnabledInterface';
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineRuleInterface from '../../engine-interfaces/EngineRuleInterface';
import { BaseEventPayload } from '../../base-interfaces/BaseTypes';

export default interface RuleInterface<EventPayloadType extends BaseEventPayload>
    extends ModuleInterface,
        EnabledInterface {
    trigger(engine: EngineRuleInterface<EventPayloadType>): Promise<void>;
}

export class __RuleInterface implements RuleInterface<any> {
    getModuleName(): string {
        return '';
    }

    trigger(engine: EngineRuleInterface<any>): Promise<void> {
        return Promise.reject('un-callable code');
    }
}
