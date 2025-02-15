import BaseConfigBySchema from './BaseConfigBySchema';
import pino from 'pino';
import createWriteStream from 'pino-loki';
import { SecretString } from './BaseConfig';

export function GetPinoLogger() {
    const config = new BaseConfigBySchema({
        PINO_HOST: {
            environmentVariables: 'PINO_HOST',
            longDescription: 'The hostname of the PINO server',
            shortDescription: 'PINO Hostname',
            type: 'string',
            defaultValue: '',
            throwOnEmpty: true,
        },
        PINO_USERNAME: {
            environmentVariables: 'PINO_USERNAME',
            longDescription: 'The username of the PINO server',
            shortDescription: 'PINO Username',
            type: 'string',
            defaultValue: '',
            throwOnEmpty: true,
        },
        PINO_PASSWORD_SECRET: {
            environmentVariables: 'PINO_PASSWORD_SECRET',
            longDescription: 'The password of the PINO server',
            shortDescription: 'PINO password',
            type: 'secret',
            defaultValue: '',
            throwOnEmpty: true,
        },
        PINO_APP_NAME: {
            environmentVariables: 'PINO_APP_NAME',
            longDescription: 'The app name of the PINO server',
            shortDescription: 'PINO Hostname',
            type: 'string',
            defaultValue: 'gallifrey-rules-app-name',
            throwOnEmpty: false,
        },
    });
    const stream = createWriteStream({
        host: config.getEnvVariableByName('PINO_HOST'),
        basicAuth: {
            username: config.getEnvVariableByName('PINO_USERNAME'), // Change to your OpenObserve user
            password: (config.getEnvVariableByName('PINO_PASSWORD_SECRET') as SecretString).getSecretValue(),
        },
        labels: { app: config.getEnvVariableByName('PINO_APP_NAME') },
    });
    return pino({}, stream);
}
