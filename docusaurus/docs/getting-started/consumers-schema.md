---
sidebar_position: 4
---
# Consumers in the Schema

In our example schema, we have a single consumer named `new-orders-consumer`, of type `kafka`. 

It's event dispatcher is `new-order-dispatcher`. 

An event dispatcher is responsible for taking in a Kafka message and mapping it into a structure the engine can understand.

The [dispatcher code lives here](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/providers/NewOrdersDispatcher.ts#L16).

If you check the code you can see how the kafka message comes in and how we translate it into a [Gallifrey-Rules event](https://github.com/ralphv/gallifrey-rules/blob/main/src/GallifreyEventType.ts#L4).

Under each consumer you have a `config` which might be different for different types of consumers. In this example, it's of type [interface KafkaConsumerConfig](https://github.com/ralphv/gallifrey-rules/blob/main/src/KafkaConsumer.ts#L309)
