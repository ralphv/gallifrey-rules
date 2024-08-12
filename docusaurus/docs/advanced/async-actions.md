---
sidebar_position: 3
---
# Async Actions

A powerful feature that Gallifrey Rules engine providers is to transform Actions into Async Actions.


When you get an event and run a rule and that rule triggers an action, that action is called synchronously within the event processing itself. 

Many times some actions can benefit of transforming them into async actions. When an action is tagged as Async, instead of the engine directly calling the plugin, it will bundle the payload of the action and offload that to another Kafka topic. Another consumer will pick this up and run the action(s). In future release of Gallifrey Rules, support will be added to Batch Async Actions.

Offloading the action into async action will decouple the action from the event processing. It will also allow you to scale the async processing independently.

Depending on their nature, not all actions can be done asynchronously.

### Steps to support Async Actions.

1. You need to decorate your Action with an additional decorator [@AsyncAction](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/InterfaceDecorators.ts#L89)
2. You need to explicitly define the [ActionQueuerProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/lib/NamespaceSchema.ts#L13) in your schema. 
3. You need to explicitly activate the action from the schema using [$asyncActions](https://github.com/ralphv/gallifrey-rules/blob/main/src/lib/NamespaceSchema.ts#L25)
4. You need to have at least one new consumer of type `'kafka:async-actions'` [See sample code](https://github.com/ralphv/gallifrey-rules/blob/eba421d60ac17b72003fe152fea4a73afe76f51a/tests/integration/async-actions/namespace.ts#L29).