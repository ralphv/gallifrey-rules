import 'mocha';
import { expect } from 'chai';
import Containers from './lib/Containers';
import PostgresLocks from '../../src/database/PostgresLocks';
import Database from '../../src/database/Database';

describe('postgres scheduled events', () => {
    it('add, query, get and delete', async () => {
        const containers = new Containers();
        const dbContainer = await containers.startDbContainer();
        try {
            const database = new Database();

            const queryResult1 = await database.queryScheduledEvents({
                namespace: 'something',
                entityName: '',
                eventID: '',
                eventName: '',
            });
            expect(queryResult1.length).to.equal(0);

            const result1 = await database.getScheduledEvent('1234');
            expect(result1).to.equal(undefined);

            const result2 = await database.deleteScheduledEvent('1234');
            expect(result2).to.equal(false);

            const id = await database.insertScheduledEvent({
                createdAt: new Date(),
                event: {
                    entityName: 'entity',
                    eventID: '1',
                    eventName: 'event',
                    namespace: 'namespace',
                    payload: { payload: true },
                },
                scheduledAt: undefined,
                scheduledCount: 0,
                triggeredBy: { entityName: '', eventID: '', eventName: '', namespace: '', source: '' },
            });

            const new1 = await database.getScheduledEvent(id.toString());
            expect(new1).to.deep.equal({
                entityName: 'entity',
                eventID: '1',
                eventName: 'event',
                namespace: 'namespace',
                scheduledEventID: 1,
                payload: { payload: true },
            });

            const id2 = await database.insertScheduledEvent({
                createdAt: new Date(),
                event: {
                    entityName: 'entity',
                    eventID: '1',
                    eventName: 'event',
                    namespace: 'namespace1',
                    payload: { payload: true },
                },
                scheduledAt: undefined,
                scheduledCount: 0,
                triggeredBy: { entityName: '', eventID: '', eventName: '', namespace: '', source: '' },
            });

            const new2 = await database.getScheduledEvent(id2.toString());
            expect(new2).to.deep.equal({
                entityName: 'entity',
                eventID: '1',
                eventName: 'event',
                namespace: 'namespace1',
                scheduledEventID: 1,
                payload: { payload: true },
            });

            const id3 = await database.insertScheduledEvent({
                createdAt: new Date(),
                event: {
                    entityName: 'entity',
                    eventID: '1',
                    eventName: 'event',
                    namespace: 'namespace',
                    payload: { payload: true },
                },
                scheduledAt: undefined,
                scheduledCount: 0,
                triggeredBy: { entityName: '', eventID: '', eventName: '', namespace: '', source: '' },
            });

            const new3 = await database.getScheduledEvent(id3.toString());
            expect(new3).to.deep.equal({
                entityName: 'entity',
                eventID: '1',
                eventName: 'event',
                namespace: 'namespace',
                scheduledEventID: id3,
                payload: { payload: true },
            });

            const queryValues = await database.queryScheduledEvents({
                namespace: 'namespace',
                entityName: 'entity',
                eventID: '1',
                eventName: 'event',
            });
            expect(queryValues.length).to.equal(2);

            const deleteId = await database.deleteScheduledEvent(id.toString());
            expect(deleteId).to.equal(true);

            const deleteId1 = await database.deleteScheduledEvent(id.toString());
            expect(deleteId1).to.equal(false);

            const queryValues1 = await database.queryScheduledEvents({
                namespace: 'namespace',
                entityName: 'entity',
                eventID: '1',
                eventName: 'event',
            });
            expect(queryValues1.length).to.equal(1);
            expect(queryValues1[0].scheduledEventID).to.equal(id3.toString());

            const queryValues2 = await database.queryScheduledEvents({
                namespace: 'namespace',
                entityName: 'entity',
                eventID: '1',
                eventName: 'event',
            });
            expect(queryValues2.length).to.equal(0);
        } catch (err) {
            console.log(err);
        } finally {
            await Database.closePool();
            await dbContainer.stop();
        }
    }).timeout(300000);
});
