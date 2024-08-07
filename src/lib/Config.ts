import BaseConfig from './BaseConfig';
import { Cache } from './CoreDecorators';

export default class Config extends BaseConfig {
    getLogLevel() {
        return this.getEnvVariable(`GF_LOG_LEVEL`, 'info', false);
    }

    throwOnNotModule() {
        return this.getBoolEnvVariable('GF_THROW_ON_NOT_MODULE', false, false);
    }

    getExtensionsOfModules() {
        return this.getArrayEnvVariable('GF_EXTENSIONS_OF_MODULES', ['.ts', '.js'], false);
    }

    skipExtensionsOfModules() {
        return this.getArrayEnvVariable('GF_SKIP_EXTENSIONS_OF_MODULES', ['.d.ts'], false);
    }

    getModulesPaths() {
        return this.getArrayEnvVariable('GF_MODULES_PATHS', [], false);
    }

    @Cache
    getModuleNamePattern() {
        return this.getEnvVariable('GF_MODULE_NAME_PATTERN', '^[a-z]+(-[a-z0-9]+)*$', false);
    }

    getInfluxDBToken() {
        return this.getSecretEnvVariable('GF_INFLUXDB_TOKEN', '', false);
    }

    getInfluxDBOrg() {
        return this.getEnvVariable('GF_INFLUXDB_ORG', 'sample_organization', false);
    }

    getInfluxDBBucket() {
        return this.getEnvVariable('GF_INFLUXDB_BUCKET', 'sample_bucket', false);
    }

    getInfluxURL() {
        return this.getEnvVariable('GF_INFLUXDB_URL', '', false);
    }

    throwOnEventUnhandledException() {
        return this.getBoolEnvVariable('GF_THROW_ON_EVENT_UNHANDLED_EXCEPTION', true, false);
    }

    dontThrowOnCriticalError() {
        return this.getBoolEnvVariable('GF_THROW_ON_CRITICAL_ERROR', true, false);
    }

    getConsumerPushMetrics() {
        return this.getBoolEnvVariable('GF_ENABLE_CONSUMER_METRICS', true, false);
    }

    getAutoCommitThreshold() {
        return this.getNumberEnvVariable(`GF_AUTO_COMMIT_THRESHOLD`, 1, false);
    }

    getAutoCommitInterval() {
        return this.getNumberEnvVariable(`GF_AUTO_COMMIT_INTERVAL`, 5000, false);
    }

    getAddExtraToJournalLogs() {
        return this.getBoolEnvVariable(`GF_ADD_EXTRA_TO_CONSOLE_JOURNAL_LOGS`, false, false);
    }

    getFailEventOnSingleRuleFail() {
        return this.getBoolEnvVariable(`GF_FAIL_EVENT_ON_SINGLE_RULE_FAIL`, true, false);
    }

    getPluginClassNamesForcePostfix() {
        return this.getBoolEnvVariable(`GF_PLUGIN_CLASS_NAMES_FORCE_POSTFIX`, true, false);
    }

    getPluginModuleNamesForcePostfix() {
        return this.getBoolEnvVariable(`GF_PLUGIN_MODULE_NAMES_FORCE_POSTFIX`, true, false);
    }

    getKafkaClientID() {
        return this.getEnvVariable('GF_KAFKA_CLIENT_ID', 'gallifrey-rules', false);
    }

    getKafkaBrokers() {
        return this.getArrayEnvVariable('GF_KAFKA_BROKERS', [], false);
    }

    getDBUser(throwOnEmpty: boolean = false) {
        return this.getEnvVariable([`GF_DB_USERNAME`, 'POSTGRES_USERNAME'], '', throwOnEmpty);
    }

    getDBHost(throwOnEmpty: boolean = false) {
        return this.getEnvVariable([`GF_DB_HOSTNAME`, 'POSTGRES_HOST'], '', throwOnEmpty);
    }

    getDBName(throwOnEmpty: boolean = false) {
        return this.getEnvVariable([`GF_DB_NAME`, 'POSTGRES_DB'], '', throwOnEmpty);
    }

    getDBPasswordSecret(throwOnEmpty: boolean = false) {
        return this.getSecretEnvVariable([`GF_DB_PASSWORD`, 'POSTGRES_PASSWORD'], '', throwOnEmpty);
    }

    getDBPort() {
        return this.getNumberEnvVariable([`GF_DB_PORT`, 'POSTGRES_PORT'], 5432, false);
    }

    isDistributedLocksEnabled() {
        return this.getBoolEnvVariable(`GF_IS_DISTRIBUTED_LOCKS_ENABLED`, false, false);
    }

    getDistributedLocksMaxWaitTimeInSeconds() {
        // for kafka: 1 minutes, should be > max.poll.interval.ms which is typically 5 minutes
        return this.getNumberEnvVariable(`GF_DISTRIBUTED_LOCKS_MAX_WAIT_TIME_SECONDS`, 60, false);
    }

    isContinueOnFailedAcquireLock() {
        return this.getBoolEnvVariable(`GF_IS_CONTINUE_ON_FAILED_ACQUIRE_LOCK`, false, false);
    }

    isSchemaFileMandatory() {
        // mandatory only when production
        return this.getBoolEnvVariable(`GF_IS_SCHEMA_FILE_MANDATORY`, this.isProduction(), false);
    }
}
