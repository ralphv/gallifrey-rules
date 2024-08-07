import { EOL } from 'node:os';

const imageName = 'gallifrey-rules-tools';

export const commands: { [key: string]: CommandEnvVariableType[] } = {
    'create-postgres-scheduled-events': [
        {
            environmentVariables: ['GF_DB_USERNAME', 'POSTGRES_USERNAME'],
            description: 'postgres username',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_HOSTNAME', 'POSTGRES_HOST'],
            description: 'postgres hostname',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_PASSWORD', 'POSTGRES_PASSWORD'],
            description: 'postgres password',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_NAME', 'POSTGRES_DB'],
            description: 'postgres db name',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_PORT', 'POSTGRES_PORT'],
            description: 'postgres port',
            optional: true,
        },
    ],
    'create-kafka-connector-scheduled-events': [
        {
            environmentVariables: ['GF_DB_USERNAME', 'POSTGRES_USERNAME'],
            description: 'postgres username',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_HOSTNAME', 'POSTGRES_HOST'],
            description: 'postgres hostname',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_PASSWORD', 'POSTGRES_PASSWORD'],
            description: 'postgres password',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_NAME', 'POSTGRES_DB'],
            description: 'postgres db name',
            optional: false,
        },
        {
            environmentVariables: ['GF_DB_PORT', 'POSTGRES_PORT'],
            description: 'postgres port',
            optional: true,
        },
        {
            environmentVariables: ['KAFKA_CONNECT_URL'],
            description: 'kafka connect url',
            optional: false,
        },
    ],
};

type CommandEnvVariableType = {
    environmentVariables: string[];
    description: string;
    optional: boolean;
};

export function validateCommand(name: string) {
    if (!(name in commands)) {
        throw new Error(`Command ${name} is not a valid command.`);
    }

    const variablesExist = commands[name]
        .filter((a) => !a.optional)
        .every(({ environmentVariables }) => environmentVariables.some((a) => a in process.env));

    if (variablesExist) {
        return true;
    }

    const missing = commands[name]
        .filter((a) => !a.optional)
        .find(({ environmentVariables }) =>
            environmentVariables.every((a) => !(a in process.env)),
        ) as CommandEnvVariableType;

    console.warn(`One or more environment variables are missing: ${JSON.stringify(missing.environmentVariables)}`);

    const eVariables = commands[name]
        .map(
            (envVar) =>
                `-e ${envVar.environmentVariables.length === 1 ? String(envVar.environmentVariables[0]) : "'" + envVar.environmentVariables.join(' OR ') + "'"}='< ${envVar.description}${envVar.optional ? ' [OPTIONAL]' : ''} >'`,
        )
        .join(` \\${EOL}    `);

    const command = `
docker run -it --rm \\
    --network < network name > \\
    ${eVariables} \\
    ${imageName} \\
    ${name}
`;

    console.log(`The correct syntax to run this command including environment variables looks like this`);
    console.log(command);
    console.log(`Use 'host.docker.internal' for host machine`);
    console.log(``);
    return false;
}
