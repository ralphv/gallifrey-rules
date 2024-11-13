import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import EngineReactToFailure from '../lib/EngineReactToFailure';
import { CriticalError, ModuleNames } from '../index';

@GallifreyProvider(ProviderType.ReactToFailure)
export default class RescheduleEventReactToFailureProvider implements ReactToFailureInterface {
    getModuleName(): string {
        return ModuleNames.RescheduleEventReactToFailure;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async reactToEventFailure(engine: EngineReactToFailure, payload: any, error: any): Promise<void> {
        const maxRescheduleCount = await engine.getConfigurationAccessor().getNumericValue('max-reschedule-count', 5);
        const rescheduleDelaySeconds = await engine
            .getConfigurationAccessor()
            .getNumericValue('reschedule-delay', 5 * 60); // 5 minutes into future

        const countSoFar = engine.getScheduledEventContext()?.scheduledCount ?? 0;

        if (countSoFar >= maxRescheduleCount) {
            await engine.warn(
                `Max reschedule count reached, react to failure will not reschedule this event, it will be ignored`,
            );
            return;
        }

        // Get the current date and time
        const now = new Date();
        const future = new Date(now.getTime() + rescheduleDelaySeconds * 1000);

        await engine.insertScheduledEvent(
            {
                namespace: engine.getEventContext().getNamespace(),
                entityName: engine.getEventContext().getEntityName(),
                eventName: engine.getEventContext().getEventName(),
                eventId: `${engine.getEventContext().getEventID()}`,
                payload: { ...payload },
                source: engine.getEventContext().getSource(),
            },
            future,
        );
    }

    async reactToRuleFailure(): Promise<void> {
        throw new CriticalError(
            `RescheduleEventReactToFailureProvider doesn't work with individual react to rule failures. You need to set GR_FAIL_EVENT_ON_SINGLE_RULE_FAIL to false`,
        );
    }
}
