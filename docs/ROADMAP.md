# design requirements

before publish:
put integration tests under tests properly
publish to npm
allow Config() to take in the event level config
create sample app
publish dinosaurus and polish it
-- release 0.5.0 beta.




avro topics
distributed locks controlled by event level data
to allow easy modifications of configurations needed per event level. This means
config needs to assess the data on the spot and not pull that and cache that. 
(think of how to do that)

* Provide an easy way to test an action, dataObject, filter...
 
* Next Cleanup
* Check todo
 
* Config from schema itself or env variables.
* Documentation framework to use
* init tool for a new project? (check proper tools)
* Enforce to have list of plugins and not just dynamically load
* Add license
* Actions can be marked as async, in this case a Queue plugin providers functionality to run them async (ActionQueuer)
* Async actions, batch actions,   
* Jobs control?
* Easily reschedule a failed range?

* Provide idempotent within engine? (currently a rule/filter cover this easily)
* Provide time metrics warnings for rescheduler,logger,journal logger,locks and idempotent times (anything the engine is doing) 
  * Should we expose those time warnings through a metric?
* 
* Provide up/down reports
* Provide simulation or mocks mode for easy testing of plugins
* 
* Provide stress testing mechanism
* GROUPID concept?
* guardrails:
  * warning/max rule processing time.
  * warning/max action processing time.
  * warning/max filter processing time.
  * warning/max dataObject processing time.
  * max event size

create async action consumer

When porting other plugins, if you get name conflict, provide an easy way to redefine the name
from schema "X as Y";

// 6. push into AS that this id was processed with a TTL of x days perhaps. (idempotent filter/rule)
// */ support tagging `processed`, support adding extra services like tagging not part of core engine. But how? with some signature?


Shall we allow a rule to tag itself that it has to be first to run or last to run to enforce
extra logic?
