---
sidebar_position: 1
---
# Getting Started

`Gallifrey rules` can run using any event streaming platform. Out of the box it supports [Apache Kafka®](https://kafka.apache.org/)

### Basic terms and definitions

  <strong>An</strong> `event` in Gallifrey Rules is defined by the following terms:

  1. `Entity name`: This is the entity that the event is based upon. [Learn more](../glossary.md#entity-or-entity-name).
  2. `Event name`: The name of the event that was fired.
  3. `Event ID`: The ID of the event that was fired.
  4. `Event payload`: The payload data that is associated with the event.

[type GallifreyEventType](https://github.com/ralphv/gallifrey-rules/blob/main/src/GallifreyEventType.ts#L4)

<strong>An</strong> `event dispatcher` is required to take in a kafka message and translate it to the event structure
that gallifrey understands. It's a simple function that takes in the message and returns a `GallifreyEventType<EventPayloadType>`

[type EventDispatcherInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/Providers/EventDispatcherInterface.ts#L9)

<strong>A</strong> namespace is the name of the application that Gallifrey Rules is running. A namespace is defined
by a governing JSON/YAML object that follows the following schema [NamespaceSchema](https://github.com/ralphv/gallifrey-rules/blob/main/src/lib/NamespaceSchema.ts#L4)

The schema, at the very least, will need to define your entities, events and the rules that will run for each event. 
It will also define at least one consumer with one event dispatcher to feed events into the engine.

Rules, Actions, DataObjects, Filters and every other kind of modules in Gallifrey Rules is referenced by their defined name which is provided through `getModuleName()`.     

### Let's get started

Easiest way to start is by [cloning the sample app](https://github.com/ralphv/gallifrey-rules-sample)

```shell
git clone git@github.com:ralphv/gallifrey-rules-sample.git
```

Let's breakdown the sample app:

* Namespace Schema.
* Entities/Events/Rules defined in the schema.
* Consumers defined in the schema.
* The Modules.