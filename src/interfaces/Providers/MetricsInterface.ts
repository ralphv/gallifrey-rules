/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import MetricsPointInterface from './MetricsPointInterface';

export default interface MetricsInterface extends ModuleInterface {
    getPoint(measurementName: string): MetricsPointInterface;

    flush(): Promise<void>;
}

export class __MetricsInterface implements MetricsInterface {
    flush(): Promise<void> {
        return Promise.reject('un-callable code');
    }

    getModuleName(): string {
        return '';
    }

    getPoint(measurementName: string): MetricsPointInterface {
        throw new Error('un-callable code');
    }
}
