# design requirements

#### planned for 0.2.x release:
* publish docusaurus and polish it
* Add comments to all EngineInterfaces methods

#### planned for 0.3.x release:
* allow Config() to take in the event level config

#### planned for future releases:

* add actions such as SlackAction
* support avro topics
* provide an easy way to test an action, dataObject, filter?
* Check todo
* init tool for a new project? (check proper tools)
* enforce to have list of plugins loaded by file directly
* provide a way to override plugins by other plugins
* Async Batch actions,   
* Jobs control?
* easily reschedule a failed range?
* provide rate limiting threshold on unhandled errors before stopping
* provide an interface that reacts to stopping/starting consumers
* provide idempotent within engine? (currently a rule/filter cover this easily)
* Provide up/down reports?
* Provide simulation or mocks mode for easy testing of plugins
* Provide stress testing mechanism
* guardrails:
  * warning/max rule processing time.
  * warning/max action processing time.
  * warning/max filter processing time.
  * warning/max dataObject processing time.
  * max event size

#### Early research
* support tagging `processed`, support adding extra services like tagging not part of core engine. But how? with some signature?
* shall we allow a rule to tag itself that it has to be first to run or last to run to enforce extra logic?
