import Database from '../database/Database';
import { validateCommand } from './commands';
import { GallifreyRulesEngine } from '../GallifreyRulesEngine';

void (async () => {
    try {
        new GallifreyRulesEngine();
        if (!validateCommand(`create-postgres-scheduled-events`)) {
            return;
        }
        console.log(`Initializing postgres database tables`);
        const database = new Database();
        await database.initialize();
        console.log(`Done!`);
        await Database.closePool();
    } catch (e) {
        console.trace(`Error: ${String(e)}`);
    }
})();
