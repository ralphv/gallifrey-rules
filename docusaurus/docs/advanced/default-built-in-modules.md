---
sidebar_position: 6
---
# Default Built in Modules

### `ConsoleJournalLoggerProvider`

**Type:**  
`JournalLoggerInterface`

**Description:**  
The default JournalLogger, sends Journal logs to `log4js`

--- 

### [EnvVariableConfigurationProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/EnvVariableConfigurationProvider.ts#L9)

**Type:**  
[ConfigurationInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/ConfigurationInterface.ts#L11)

**Description:**  
The default Configuration provider, pulls configs from environment variables using the prefix `CONFIG_`. Variable names used in plugins are transformed to upper case snake case to resemble environment variables. Also note that event level `$config` values provided in the schema will take precedence. Read more about this here [placeholder]

**Examples:**
Plugin asks for `orders-rate-limiter`. Value will be pulled from `CONFIG_ORDER_RATE_LIMITER` if present.

---

### [InfluxDBMetricsProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/InfluxDBMetricsProvider.ts#L9)

**Type:**  
[MetricsInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/MetricsInterface.ts#L8)

**Description:**  
The default Metrics provider, uses InfluxDB.

--- 

### [KafkaActionQueuerProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/KafkaActionQueuerProvider.ts#L11)

**Type:**  
[ActionQueuerInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/ActionQueuerInterface.ts#L8)

**Description:**  
The default Action queuer provider that uses Kafka.

--- 

### [PostgresDistributedLocksProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/PostgresDistributedLocksProvider.ts#L7)

**Type:**  
[DistributedLocksInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/DistributedLocksInterface.ts#L12C26-L12C52)

**Description:**  
The default distributed locks provider, it uses Postgres as it's backend for this functionality.

--- 
### [PostgresScheduledEventsProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/PostgresScheduledEventsProvider.ts#L12)

**Type:**  
[ScheduledEventsInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/ScheduledEventsInterface.ts#L8)

**Description:**  
The default scheduled events provider. Pushed scheduled events into Postgres DB so that Kafka connect can pick it up when it's time.

--- 
### [PushToTopicReactToFailureProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/PushToTopicReactToFailureProvider.ts#L8)

**Type:**  
[ReactToFailureInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/ReactToFailureInterface.ts#L5)

**Description:**  
This ReactToFailure provider will push failed events into a different Kafka topic.

--- 
### [RescheduleEventReactToFailureProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/modules/RescheduleEventReactToFailureProvider.ts#L7)

**Type:**  
[ReactToFailureInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/ReactToFailureInterface.ts#L5)

**Description:**  
This ReactToFailure provider will push failed events into a future scheduled events.

The delay period and maximum reschedule count is determined by configuration parameters. [placeholder]. 

--- 
