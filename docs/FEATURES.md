# Features

* Modules are the components we load dynamically, two types, plugins + providers
  * plugins are instantiated per event like action/rules/filters and so on.
  * providers are instantiated once like Configuration or Metrics.
* Each namespace has a schema + list of modules + config setup.
* All modules are interface based including
  * LoggerInterface
  * JournalLoggerInterface
  * MetricsInterface
  * EventHandlerInterface -> take in raw event and push it into GR format
  * FilterInterface, attaches to events or rules to decide whether or not they can run
  * Rules,RuleInterface
  * Actions,ActionInterface (BatchAsync support)
  * ConfigurationInterface
  * DataObjects,DataObjectInterface
  * LockingInterface
  * ScheduledEventsInterface
  * ReactToFailureInterface
* Passed in Interfaces are named starting with *Engine to indicate what the engine gives you.
* High visibility out of the box metrics
* Naming conventions enforced using a custom schema.
* Built in functionality for creating scheduled events set at a future time.
* Extensive built in functionality to react to failures mechanism.
* Built in functionality to use distributed locks to ensure that at any one time, there is only
  * one event running for the same entity/id, ensuring atomic operations when needed.
* guardrails:
  * warning/max rule processing time.
  * warning/max action processing time.
  * warning/max filter processing time.
  * warning/max dataObject processing time.
