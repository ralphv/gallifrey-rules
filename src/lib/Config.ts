import BaseConfig from './BaseConfig';
import { Cache } from './CoreDecorators';

export default class Config extends BaseConfig {
    constructor(overrideData: { [name: string]: string | number | boolean } = {}) {
        super('', overrideData);
    }
    getLogLevel() {
        return this.getEnvVariable(`GR_LOG_LEVEL`, 'info', false);
    }

    throwOnNotModule() {
        return this.getBoolEnvVariable('GR_THROW_ON_NOT_MODULE', false, false);
    }

    getExtensionsOfModules() {
        return this.getArrayEnvVariable('GR_EXTENSIONS_OF_MODULES', ['.ts', '.js'], false);
    }

    skipExtensionsOfModules() {
        return this.getArrayEnvVariable('GR_SKIP_EXTENSIONS_OF_MODULES', ['.d.ts'], false);
    }

    getModulesPaths() {
        return this.getArrayEnvVariable('GR_MODULES_PATHS', [], false);
    }

    @Cache
    getModuleNamePattern() {
        return this.getEnvVariable('GR_MODULE_NAME_PATTERN', '^[a-z]+(-[a-z0-9]+)*$|^[A-Z][a-zA-Z0-9]*$', false);
    }

    getInfluxDBToken() {
        return this.getSecretEnvVariable('GR_INFLUXDB_TOKEN', '', false);
    }

    getInfluxDBOrg() {
        return this.getEnvVariable('GR_INFLUXDB_ORG', 'gallifrey-rules', false);
    }

    getInfluxDBBucket() {
        return this.getEnvVariable('GR_INFLUXDB_BUCKET', 'gallifrey-rules-bucket', false);
    }

    getInfluxURL() {
        return this.getEnvVariable('GR_INFLUXDB_URL', '', false);
    }

    throwOnEventUnhandledException() {
        return this.getBoolEnvVariable('GR_THROW_ON_EVENT_UNHANDLED_EXCEPTION', true, false);
    }

    throwOnCriticalError() {
        return this.getBoolEnvVariable('GR_THROW_ON_CRITICAL_ERROR', true, false);
    }

    getConsumerPushMetrics() {
        return this.getBoolEnvVariable('GR_ENABLE_CONSUMER_METRICS', true, false);
    }

    getAutoCommitThreshold() {
        return this.getNumberEnvVariable(`GR_AUTO_COMMIT_THRESHOLD`, 1, false);
    }

    getAutoCommitInterval() {
        return this.getNumberEnvVariable(`GR_AUTO_COMMIT_INTERVAL`, 5000, false);
    }

    getAddExtraToJournalLogs() {
        return this.getBoolEnvVariable(`GR_ADD_EXTRA_TO_CONSOLE_JOURNAL_LOGS`, false, false);
    }

    getFailEventOnSingleRuleFail() {
        return this.getBoolEnvVariable(`GR_FAIL_EVENT_ON_SINGLE_RULE_FAIL`, true, false);
    }

    getPluginClassNamesForcePostfix() {
        return this.getBoolEnvVariable(`GR_PLUGIN_CLASS_NAMES_FORCE_POSTFIX`, true, false);
    }

    getPluginModuleNamesForcePostfix() {
        return this.getBoolEnvVariable(`GR_PLUGIN_MODULE_NAMES_FORCE_POSTFIX`, true, false);
    }

    getKafkaClientID() {
        return this.getEnvVariable('GR_KAFKA_CLIENT_ID', 'gallifrey-rules', false);
    }

    getKafkaBrokers() {
        return this.getArrayEnvVariable('GR_KAFKA_BROKERS', [], false);
    }

    getDBUser(throwOnEmpty: boolean = false) {
        return this.getEnvVariable([`GR_DB_USERNAME`, 'POSTGRES_USERNAME'], '', throwOnEmpty);
    }

    getDBHost(throwOnEmpty: boolean = false) {
        return this.getEnvVariable([`GR_DB_HOSTNAME`, 'POSTGRES_HOST'], '', throwOnEmpty);
    }

    getDBName(throwOnEmpty: boolean = false) {
        return this.getEnvVariable([`GR_DB_NAME`, 'POSTGRES_DB'], '', throwOnEmpty);
    }

    getDBPasswordSecret(throwOnEmpty: boolean = false) {
        return this.getSecretEnvVariable([`GR_DB_PASSWORD`, 'POSTGRES_PASSWORD'], '', throwOnEmpty);
    }

    getDBPort() {
        return this.getNumberEnvVariable([`GR_DB_PORT`, 'POSTGRES_PORT'], 5432, false);
    }

    isDistributedLocksEnabled() {
        return this.getBoolEnvVariable(`GR_IS_DISTRIBUTED_LOCKS_ENABLED`, false, false);
    }

    getDistributedLocksMaxWaitTimeInSeconds() {
        // for kafka: 1 minutes, should be > max.poll.interval.ms which is typically 5 minutes
        return this.getNumberEnvVariable(`GR_DISTRIBUTED_LOCKS_MAX_WAIT_TIME_SECONDS`, 60, false);
    }

    isContinueOnFailedAcquireLock() {
        return this.getBoolEnvVariable(`GR_IS_CONTINUE_ON_FAILED_ACQUIRE_LOCK`, false, false);
    }

    isSchemaFileMandatory() {
        // mandatory only when production
        return this.getBoolEnvVariable(`GR_IS_SCHEMA_FILE_MANDATORY`, this.isProduction(), false);
    }

    useExitTimeout() {
        // for production use exit timeout by default to make sure container exits when consumers have to stop
        return this.getBoolEnvVariable(`USE_EXIT_TIMEOUT`, this.isProduction(), false);
    }

    @Cache
    addStackTracesToLogs() {
        return this.getBoolEnvVariable(`ADD_STACK_TRACES`, true, false);
    }
}
