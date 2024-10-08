---
sidebar_position: 1
---

# What is Gallifrey Rules?

# Gallifrey Rules: A Comprehensive Event Handling Framework for Node.js

Gallifrey Rules is a sophisticated [Node.js](https://nodejs.org/en) library written in [TypeScript](https://www.typescriptlang.org/), designed to streamline and enhance the management of real-time event-driven architectures.

In the realm of real-time event consumption, systems often operate as black boxes. Typically, an entry point function pulls events from streaming platforms like [Apache Kafka®](https://kafka.apache.org/) These consumers execute business logic, retrieve necessary data, and perform state mutations within the system.

### Example Scenario: E-commerce Order Processing

Consider an e-commerce platform where a user adds items to their cart and completes the checkout process. The backend saves the order information to a database and then triggers a series of asynchronous operations through events to process the new order. These operations might include:

1. Sending an email to the user confirming order creation.
2. Preparing items for packaging and shipment.
3. Initiating payment processing and notifying the user upon success.
4. Sending shipping notifications.
5. Confirming delivery and conducting customer surveys and analytics.

As systems grow in complexity, maintaining these consumers becomes increasingly challenging. Visibility equally suffers. 

## Introducing Gallifrey Rules

Gallifrey Rules enforces disciplined and structured event handling practices in two primary ways:

1. **Event Definition**: Mandates the definition of all events with basic properties such as event name, associated entity, event ID and the event payload.
2. **Modular Architecture**: Utilizes plugins or modules to encapsulate functionalities of different roles. Business Logic, Data Hydration and State Mutations.

**When Gallifrey Rules orchestrates your consumers, it intelligently infers critical insights and exerts 
precise control over their behavior, providing the developer with a wealth of advantages and enhanced functionality.**

### Key Benefits for Developers

* **Structured Event-Driven Architecture (EDA)**: Enforces a disciplined approach to event-driven development, ensuring consistency and best practices across your projects.
* Transform **Consumer Blackbox** => Modular design with Filters, Rules, DataObjects, and Actions as customizable plugins, enabling seamless extension and flexibility.
* **Dynamic Plugin Management**: All modules, including plugins and providers, are dynamically loaded and referenced by name,
* **Namespace-Oriented Projects**: Projects are organized into **Namespaces**, each consisting of a **Namespace Schema** and a list of modules, promoting modularity and reusability.
* **Abstracted Configuration Management**: Configurations are managed through an abstracted provider, allowing them to be sourced from any backend, ensuring flexibility in various environments.
* **Logging and Metrics**: Logging and metrics are abstracted behind providers, offering a consistent and extensible approach to monitoring and diagnostics. Out of the box support for [InfluxDB](https://www.influxdata.com/)/[Grafana](https://grafana.com/).
* **Journal Logging**: Capturing/grouping high level logs that happen during a single event.
* **Scheduled Events Support**: Native support for scheduling events in the future, with rules that can seamlessly trigger new events based on business logic.
* **Distributed Locks**: Out-of-the-box support for distributed locks, enabling atomic event processing and ensuring data integrity across distributed systems.
* **Asynchronous Actions**: Actions can be easily converted into Async Actions with dedicated consumer topics, allowing for efficient time management and workload distribution.
* **Comprehensive Metrics Tracking**: Tracks counts and durations for each plugin type, enabling quick identification of performance bottlenecks, such as slow data pullers or actions.
* **Enforced Naming Conventions**: Consistent naming conventions across the library, enhancing the developer experience and reducing the likelihood of errors.
* **Resilient Error Handling**: The ReactToFailure mechanism is abstracted behind a provider, giving developers control over how to handle unexpected errors in a customizable and consistent manner.
* Fully supports [TypeScript](https://www.typescriptlang.org/).

Gallifrey Rules redefines event handling in Node.js, providing a robust framework that enhances reusability, maintainability, and visibility, making it an essential tool for developers dealing with complex real-time systems.

## Getting Started

Head on to the [Getting started documentation.](getting-started/getting-started.md), "No time for dilly-dallying!"
