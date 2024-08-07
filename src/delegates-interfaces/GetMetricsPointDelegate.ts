import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';

export default interface GetMetricsPointDelegate {
    (measurementName: string): MetricsPointInterface;
}
