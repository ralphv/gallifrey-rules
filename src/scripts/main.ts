import { GallifreyRulesEngine } from '../GallifreyRulesEngine';
import { commands } from './commands';
import { EOL } from 'node:os';

void (async () => {
    new GallifreyRulesEngine();
    console.log(`Hello Doctor, Gallifrey awaits you.`);
    console.log();
    console.log(`Available commands: 
    
${Object.keys(commands)
    .map((a) => ` => ${a}`)
    .join(`${EOL}`)}
`);
})();
