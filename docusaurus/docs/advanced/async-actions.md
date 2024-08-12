---
sidebar_position: 3
---
# Async Actions

A notable feature of the Gallifrey Rules engine is its ability to convert synchronous Actions into asynchronous (Async) Actions. Typically, when an event is received and a rule is executed, any action triggered by that rule is executed synchronously as part of the event processing. However, in many scenarios, certain actions may benefit from being executed asynchronously.

When an action is designated as Async, the engine will not directly invoke the plugin. Instead, it packages the action’s payload and transfers it to a separate Kafka topic. Another consumer, configured to handle these Async Actions, will then pick up the payload and execute the action(s). In upcoming releases of Gallifrey Rules, there are plans to introduce support for Batch Async Actions, allowing multiple actions to be processed together asynchronously.

This mechanism of offloading actions to Async Actions effectively decouples them from the event processing workflow. Such decoupling facilitates the independent scaling of asynchronous processing, enhancing system flexibility and resilience.

It is important to note that not all actions are suitable for asynchronous execution, as the decision to convert an action to Async depends on the action's specific requirements and characteristics.

### Steps to support Async Actions.

1. You need to decorate your Action with an additional decorator [@AsyncAction](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/InterfaceDecorators.ts#L89)
2. You need to explicitly define the [ActionQueuerProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/lib/NamespaceSchema.ts#L13) in your schema. 
3. You need to explicitly activate the action as Async from the schema using [$asyncActions](https://github.com/ralphv/gallifrey-rules/blob/main/src/lib/NamespaceSchema.ts#L25)
4. You need to have at least one new consumer of type `'kafka:async-actions'` [See sample code](https://github.com/ralphv/gallifrey-rules/blob/eba421d60ac17b72003fe152fea4a73afe76f51a/tests/integration/async-actions/namespace.ts#L29).