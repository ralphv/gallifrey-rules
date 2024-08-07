---
sidebar_position: 1
---

# What is Gallifrey Rules?

# Gallifrey-Rules: A Comprehensive Event Handling Framework for Node.js

Gallifrey-Rules is a sophisticated Node.js library written in TypeScript, designed to streamline and enhance the management of real-time event-driven architectures.

In the realm of real-time event consumption, systems often operate as black boxes. Typically, an entry point function pulls events from streaming platforms like [Apache Kafka.](https://kafka.apache.org/) These consumers execute business logic, retrieve necessary data, and perform state mutations within the system.

### Example Scenario: E-commerce Order Processing

Consider an e-commerce platform where a user adds items to their cart and completes the checkout process. The backend saves the order information to a database and then triggers a series of asynchronous operations through events to process the new order. These operations might include:

1. Sending an email to the user confirming order creation.
2. Preparing items for packaging and shipment.
3. Initiating payment processing and notifying the user upon success.
4. Sending shipping notifications.
5. Confirming delivery and conducting customer surveys and analytics.

As systems grow in complexity, maintaining these consumers becomes increasingly challenging. Visibility equally suffers. 

## Introducing Gallifrey-Rules

Gallifrey-Rules enforces disciplined event handling practices in two primary ways:

1. **Event Definition**: Mandates the definition of all events with basic properties such as event name, associated entity, event ID and the event payload.
2. **Modular Architecture**: Utilizes plugins or modules to encapsulate functionalities of different roles.

### Key Benefits for Developers

1. **Reusability**: Plugins naturally promote reusability. They are passed an engine interface, providing essential methods to leverage the engine's services.
2. **High Visibility**: Offers comprehensive logging and metrics for event handling out-of-the-box.
3. **Maintainability**: Enhances code maintainability through modular design.
4. **Configuration Management**: Simplifies configuration management.
5. **Error Management**: Facilitates straightforward error handling.

### Core Gallifrey-Rules Plugins

1. **Rules**: Encapsulate business logic. Rules interact with external data via DataObject plugins and perform state mutations through Action plugins.
2. **Actions**: Handle state mutations.
3. **DataObjects**: Manage external data retrieval.
4. **Filters**: Preprocess events to determine rule execution eligibility.

### Advantages of the Gallifrey-Rules Engine

By modularizing consumer code into plugins, Gallifrey-Rules provides several out-of-the-box benefits:

1. **Journal Logs**: Tracks event processing, including rule execution, data retrieval, and state mutations all in a single logical logging unit called a journal log.
2. **Metrics**: Aggregates execution times and frequencies of plugins, identifying performance bottlenecks.
3. **Event Scheduling**: Supports scheduling and rescheduling events for future execution.
4. **Asynchronous Actions**: Easily transforms synchronous actions into asynchronous ones, enhancing efficiency, with minimal code changes.
5. **Distributed Locks**: Manages atomic operations on events, ensuring consistency.
6. **Advanced Error Management**: Offers various error-handling strategies, including stopping, continuing, rescheduling, or ignoring errors.
7. **Plugin-Based Architecture**: Provides flexibility and extensibility in engine behavior.
8. **Configuration Abstraction**: Centralizes configuration management using the engine's setup.
9. **Namespace Schema**: Governs the behavior of the real-time platform with a JSON schema.

Gallifrey-Rules redefines event handling in Node.js, providing a robust framework that enhances reusability, maintainability, and visibility, making it an essential tool for developers dealing with complex real-time systems.

## Getting Started

Head on to the [Getting started documentation.](tutorial-basics/getting-started.md), "No time for dilly-dallying!"
