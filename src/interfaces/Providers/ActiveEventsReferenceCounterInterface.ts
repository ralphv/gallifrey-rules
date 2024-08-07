/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface ActiveEventsReferenceCounterInterface extends ModuleInterface {}

export class __ActiveEventsReferenceCounterInterface implements ActiveEventsReferenceCounterInterface {
    getModuleName(): string {
        return '';
    }
}
