import EngineScheduledEventContextInterface from '../engine-interfaces/EngineScheduledEventContextInterface';

export default interface GetScheduledEventContextDelegate {
    (): EngineScheduledEventContextInterface | undefined;
}
