import { PostgreSqlContainer } from '@testcontainers/postgresql';
import Config from '../../src/lib/Config';
import Database from '../../src/database/Database';
import { DockerComposeEnvironment, GenericContainer, Network, StartedNetwork, Wait } from 'testcontainers';
import { StartedTestContainer } from 'testcontainers/build/test-container';
import path from 'node:path';
import { exec } from 'child_process';
import util from 'util';
import { AssertNotNull } from '../../src/lib/Utils';
import { produceIntoKafka } from './IntegrationUtils';
import { deleteKafkaConnectConnector, deployKafkaConnectConnector } from '../../src/lib/Utils';

const execPromise = util.promisify(exec);

export default class Containers {
    private startedContainers: StartedTestContainer[] = [];
    private kafkaConnectUrl: string | undefined;
    private network: StartedNetwork | undefined;

    async cleanup() {
        console.log(`cleaning up containers`);
        delete process.env.GF_DB_USERNAME;
        delete process.env.GF_DB_HOSTNAME;
        delete process.env.GF_DB_NAME;
        delete process.env.GF_DB_PASSWORD;
        delete process.env.GF_DB_PORT;
        delete process.env.CONFIG_KAFKA_CLIENT_BROKER;
        delete process.env.GF_KAFKA_BROKERS;
        await Promise.allSettled(this.startedContainers.map((container: StartedTestContainer) => container.stop()));
        this.startedContainers = [];
        if (this.network) {
            await this.network.stop();
            this.network = undefined;
        }
    }

    async startDockerCompose(services?: string[]) {
        return await new DockerComposeEnvironment(
            path.resolve(__dirname, '../docker/tests/'),
            'scheduled-events.compose.yaml',
        )
            .withNoRecreate()
            .withStartupTimeout(30000)
            .up(services);
    }

    private async getNetwork() {
        if (this.network) {
            return this.network;
        }
        // Create a shared network
        this.network = await new Network().start();
        return this.network;
    }

    async startAllContainers() {
        await Promise.all([this.startKafkaContainer(), this.startDbContainer()]);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.startKafkaConnectContainer();
    }

    async runDockerComposeCommand(command: string): Promise<void> {
        try {
            const { stdout, stderr } = await execPromise(`docker compose ${command}`);
            if (stderr) {
                console.error(`Error: ${stderr}`);
            }
            console.log(`Output: ${stdout}`);
        } catch (error) {
            console.error(`Exec error: ${String(error)}`);
            throw error;
        }
    }

    async startDbContainer(useFixedName = false) {
        // db container
        console.log(`Starting postgres container`);
        const container = new PostgreSqlContainer().withStartupTimeout(300000);

        if (useFixedName) {
            container.withName('postgres');
        }

        const postgresContainer = await container.start();
        console.log(`Started postgres container`);

        process.env.GF_DB_USERNAME = postgresContainer.getUsername();
        process.env.GF_DB_HOSTNAME = postgresContainer.getHost();
        process.env.GF_DB_NAME = postgresContainer.getDatabase();
        process.env.GF_DB_PASSWORD = postgresContainer.getPassword();
        process.env.GF_DB_PORT = String(postgresContainer.getPort());

        // initialize database
        const database = new Database();
        await database.initialize();
        await Database.closePool();

        this.startedContainers.push(postgresContainer);
        return postgresContainer;
    }

    async startKafkaContainer() {
        console.log(`Starting kafka container`);
        const kafkaContainer = await new GenericContainer('confluentinc/confluent-local:7.5.5')
            .withStartupTimeout(300000)
            //.withNetwork(await this.getNetwork())
            .withName('kafka-1')
            .withEnvironment({
                KAFKA_LISTENERS: 'INSIDE://:29092,OUTSIDE://:9092,CONTROLLER://:9093',
                KAFKA_ADVERTISED_LISTENERS: 'INSIDE://kafka-1:29092,OUTSIDE://localhost:9092',
                KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'INSIDE:PLAINTEXT,OUTSIDE:PLAINTEXT,CONTROLLER:PLAINTEXT',
                KAFKA_INTER_BROKER_LISTENER_NAME: 'INSIDE',
                KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER',
                KAFKA_PROCESS_ROLES: 'broker,controller',
                KAFKA_NODE_ID: '1',
                KAFKA_CONTROLLER_QUORUM_VOTERS: '1@localhost:9093',
                KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: '1',
                KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: '1',
                KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: '1',
                KAFKA_LOG_DIRS: '/var/lib/kafka/data',
            })
            .withExposedPorts({
                container: 9092,
                host: 9092,
            })
            .withWaitStrategy(
                Wait.forLogMessage(
                    'INFO [KafkaRaftServer nodeId=1] Kafka Server started (kafka.server.KafkaRaftServer)',
                ),
            )
            .withHealthCheck({
                test: ['CMD', 'kafka-topics', '--bootstrap-server', 'kafka-1:29092', '--list'], // Health check command
                interval: 10000,
                timeout: 10000,
                retries: 7,
                startPeriod: 10000,
            })
            .withWaitStrategy(Wait.forListeningPorts())
            .start();
        console.log(`Started kafka container`);
        process.env.CONFIG_KAFKA_CLIENT_BROKER = `localhost:9092`;
        process.env.GF_KAFKA_BROKERS = process.env.CONFIG_KAFKA_CLIENT_BROKER;
        this.startedContainers.push(kafkaContainer);
        console.log(
            `kafka: ${kafkaContainer.getHost()}:${kafkaContainer.getName()}:${kafkaContainer.getFirstMappedPort()}`,
        );
        return kafkaContainer;
    }

    async startKafkaConnectContainer() {
        // Build the Docker image from the Dockerfile
        console.log(`Starting kafka connect container`);
        const container = await new GenericContainer('my-kafka-connect')
            //.withNetwork(await this.getNetwork())
            .withName('kafka-connect')
            .withEnvironment({
                CONNECT_BOOTSTRAP_SERVERS: 'kafka-1:29092',
                CONNECT_REST_PORT: '8083',
                CONNECT_GROUP_ID: 'connect-group-id',
                CONNECT_CONFIG_STORAGE_TOPIC: 'connect-configs',
                CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR: '1',
                CONNECT_OFFSET_STORAGE_TOPIC: 'connect-offsets',
                CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR: '1',
                CONNECT_STATUS_STORAGE_TOPIC: 'connect-status',
                CONNECT_STATUS_STORAGE_REPLICATION_FACTOR: '1',
                CONNECT_KEY_CONVERTER: 'org.apache.kafka.connect.json.JsonConverter',
                CONNECT_VALUE_CONVERTER: 'org.apache.kafka.connect.json.JsonConverter',
                CONNECT_INTERNAL_KEY_CONVERTER: 'org.apache.kafka.connect.json.JsonConverter',
                CONNECT_INTERNAL_VALUE_CONVERTER: 'org.apache.kafka.connect.json.JsonConverter',
                CONNECT_REST_ADVERTISED_HOST_NAME: 'kafka-connect',
                CONNECT_PLUGIN_PATH: '/usr/share/java',
                CONNECT_LOG4J_LOGGERS: 'org.reflections=ERROR',
                CONNECT_CLIENT_DNS_LOOKUP: 'resolve_canonical_bootstrap_servers_only',
            })
            .withStartupTimeout(300000)
            .withExposedPorts({
                container: 8083,
                host: 8083,
            })
            .withHealthCheck({
                test: ['CMD', 'echo "test"'], // Health check command
                interval: 30000, // 10 seconds
                timeout: 10000, // 10 seconds
                retries: 10, // 3 retries
                startPeriod: 10000, // 60 seconds
            })
            .start();
        console.log(`Started kafka connect container`);
        this.kafkaConnectUrl = 'http://localhost:8083';
        this.startedContainers.push(container);
        return container;
    }

    async produceIntoKafka(topic: string, key: string | undefined, payload: any) {
        const config = new Config();
        return produceIntoKafka(config.getKafkaBrokers(), topic, key, payload);
    }

    async deleteKafkaConnectConnector(connectorName: string) {
        return deleteKafkaConnectConnector(AssertNotNull(this.kafkaConnectUrl), connectorName);
    }

    async deployKafkaConnectConnector(connectorConfig: any) {
        return deployKafkaConnectConnector(AssertNotNull(this.kafkaConnectUrl), connectorConfig);
    }
}
