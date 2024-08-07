/**
 * author: Ralph Varjabedian
 */
import EnabledInterface from '../../base-interfaces/EnabledInterface';
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineRuleInterface from '../../engine-interfaces/EngineRuleInterface';
import { BaseEventPayload } from '../../base-interfaces/BaseTypes';
export default interface RuleInterface<EventPayloadType extends BaseEventPayload> extends ModuleInterface, EnabledInterface {
    trigger(engine: EngineRuleInterface<EventPayloadType>): Promise<void>;
}
export declare class __RuleInterface implements RuleInterface<any> {
    getModuleName(): string;
    trigger(engine: EngineRuleInterface<any>): Promise<void>;
}
