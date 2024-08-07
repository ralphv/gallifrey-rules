### What defines an event

An event is defined by the namespace, entity name, event name, event id and event payload.

* The namespace: This is the namespace is currently running, it is like the project name or instance name.
This doesn't change dynamically and is associated with a deployment or project instance.
* The entity name: This is the entity name that was triggered on. Examples:
  * Event `order-created` on entity `retail-order`
  * Event `order-created` on entity `online-order`
* The event name: This is the event name.
* The event id: every event has an id.
* The event payload: every event has a payload with it.

The engine's entry point requires taking in a kafka event and translating it
into the above parameters to be consumed properly by the engine.
