---
sidebar_position: 1
---
# Getting Started

`Gallifrey rules` can run using any event streaming platform. Out of the box it supports Apache Kafka®

### Basic terms and definitions

  <strong>An</strong> `event` in `gallifrey rules` is defined by the following terms:

  1. `Entity name`: This is the entity that the event is based upon.
  2. `Event name`: The name of the event that was fired.
  3. `Event ID`: The ID of the event that was fired.
  4. `Event payload`: The payload data that is associated with the event.

    [placeholder: fill in link to the type in code]

<strong>An</strong> `event dispatcher` is required to take in a kafka message and translate it to the event structure
that gallifrey understands. It's a simple function that takes in the message and returns a `GallifreyEventType<EventPayloadType>`

    [placeholder: fill in link to the type in code of event dispatcher]

<strong>A</strong> namespace is the name of the application that `gallifrey rules` is running. A namespace is defined
by a governing JSON object that follows the following schema [placeholder]

The schema, at the very least, will need to define your entities, events and the rules that will run for each event. 
It will also define at least one consumer with one event dispatcher to feed events into the engine.

Rules, Actions, DataObjects, Filters and every other kind of modules in gallifrey-rules is referenced by their defined name.     

### Let's get started

Easiest way to start is by [cloning the sample app](https://github.com/ralphv/gallifrey-rules-sample)

```bash
git clone git@github.com:ralphv/gallifrey-rules-sample.git
```

Lets breakdown the sample app:

* Namespace Schema.
* Entities/Events/Rules defined in the schema.
* Consumers defined in the schema.
* The modules. Modules are two types, Plugins and Providers.