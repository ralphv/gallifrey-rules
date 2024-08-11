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

### `EnvVariableConfigurationProvider`

**Type:**  
`ConfigurationInterface`

**Description:**  
The default Configuration provider, pulls configs from environment variables using the prefix `CONFIG_`. Variable names used in plugins are transformed to upper case snake case to resemble environment variables. Also note that event level `$config` values provided in the schema will take precedence. Read more about this here [placeholder]

**Examples:**
Plugin asks for `orders-rate-limiter`. Value will be pulled from `CONFIG_ORDER_RATE_LIMITER` if present.

---

### `InfluxDBMetricsProvider`

**Type:**  
`MetricsInterface`

**Description:**  
The default Metrics provider, uses InfluxDB.

--- 

### `KafkaActionQueuerProvider`

**Type:**  
`ActionQueuerInterface`

**Description:**  
The default Action queuer provider that uses Kafka.

--- 

### `PostgresDistributedLocksProvider`

**Type:**  
`DistributedLocksInterface`

**Description:**  
The default distributed locks provider, it uses Postgres as it's backend for this functionality.

--- 
### `PostgresScheduledEventsProvider`

**Type:**  
`ScheduledEventsInterface`

**Description:**  
The default scheduled events provider. Pushed scheduled events into Postgres DB so that Kafka connect can pick it up when it's time.

--- 
### `PushToTopicReactToFailureProvider`

**Type:**  
`ReactToFailureInterface`

**Description:**  
This ReactToFailure provider will push failed events into a different Kafka topic.

--- 
### `RescheduleEventReactToFailureProvider`

**Type:**  
`ReactToFailureInterface`

**Description:**  
This ReactToFailure provider will push failed events into a future scheduled events.

The delay period and maximum reschedule count is determined by configuration parameters. [placeholder]. 

--- 
