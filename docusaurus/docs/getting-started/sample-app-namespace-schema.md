---
sidebar_position: 2
---
# Sample App Namespace Schema

Let's start by [checking the namespace schema](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/index.ts#L9) of the sample application.

JSON
```json
{
  "$namespace": "gallifrey-rules-sample",
  "$modulesPaths": [
    "$",
    "/app/modules"
  ],
  "$entities": {
    "orders": {
      "new-order": {
        "$rules": [
          "notify-customer-new-order-rule"
        ]
      }
    }
  },
  "$consumers": [
    {
      "name": "new-orders-consumer",
      "type": "kafka",
      "eventDispatcher": "new-order-dispatcher",
      "config": {
        "groupId": "group-id-1",
        "topics": "new-orders",
        "fromBeginning": true
      }
    }
  ]
}
```
YAML
```yaml
$namespace: gallifrey-rules-sample
$modulesPaths:
  - $
  - /app/modules
$entities:
  orders:
    new-order:
      $rules:
        - notify-customer-new-order-rule
$consumers:
- name: new-orders-consumer
  type: kafka
  eventDispatcher: new-order-dispatcher
  config:
    groupId: group-id-1
    topics: new-orders
    fromBeginning: true
```

Let's break this down:

* `$namespace`: is your namespace, this uniquely identifies the instance of your engine. Usually you have one namespace per project.
* `$modulesPaths`: is a list of directories that the engine loads all modules from. The `'$'` path is a special path that will get the 
engine to load modules that come with the library itself. In the application example you can see that all of it's modules live under `modules` folder.
* `$entities`: is your list of entities. [Learn more](../glossary.md#entity-or-entity-name).
Under each entity, is the list of event names. and under each event name is your rules. 
In this example we have a single entity `orders`. For orders, we have a single event called `new-order`. And
When we get the event `new-order` of entity `orders`, we run the single rule `notify-customer-new-order-rule`
* `$consumers`: is your list of consumers. Usually you should have at least one. In this example, we
have a single consumer named `new-orders-consumer`, of type `kafka`. It's event dispatcher is `new-order-dispatcher`. 
The [dispatcher code lives here](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/providers/NewOrdersDispatcher.ts#L16).
If you check the code you can see how the kafka message comes in and how we translate it into a [Gallifrey Rules event](https://github.com/ralphv/gallifrey-rules/blob/main/src/GallifreyEventType.ts#L4).
* Under each consumer you have a config which might be different for different types of consumers. In this example, it's of type [interface KafkaConsumerConfig](https://github.com/ralphv/gallifrey-rules/blob/main/src/KafkaConsumer.ts#L309)
