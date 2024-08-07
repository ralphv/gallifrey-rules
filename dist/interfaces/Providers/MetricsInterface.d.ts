/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import MetricsPointInterface from './MetricsPointInterface';
export default interface MetricsInterface extends ModuleInterface {
    getPoint(measurementName: string): MetricsPointInterface;
    flush(): Promise<void>;
}
export declare class __MetricsInterface implements MetricsInterface {
    flush(): Promise<void>;
    getModuleName(): string;
    getPoint(measurementName: string): MetricsPointInterface;
}
