/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import EngineDataObjectInterface from '../../engine-interfaces/EngineDataObjectInterface';
import { BaseDataObjectRequest, BaseDataObjectResponse } from '../../base-interfaces/BaseTypes';
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EnabledInterface from '../../base-interfaces/EnabledInterface';

/**
 * This is the plugin that is responsible for pulling a piece of data required for the logic of rules.
 * It should only be influenced by the request
 */
export default interface DataObjectInterface<
    DataObjectRequestType extends BaseDataObjectRequest,
    DataObjectResponseType extends BaseDataObjectResponse,
> extends ModuleInterface,
        EnabledInterface {
    get(engine: EngineDataObjectInterface<DataObjectRequestType>): Promise<DataObjectResponseType>;
}

export class __DataObjectInterface implements DataObjectInterface<any, any> {
    get(engine: EngineDataObjectInterface<any>): Promise<any> {
        return Promise.reject('un-callable code');
    }

    getModuleName(): string {
        return '';
    }
}
