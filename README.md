<p align="center">
    <a href="https://gallifrey-rules.dev">
      <img src="https://raw.githubusercontent.com/ralphv/gallifrey-rules/main/docs/resources/gallifrey-rules-25.png" alt="Logo" width="150" height="150">
    </a>
    <h3 align="center">Gallifrey Rules</h3>
    <p align="center">
        A modern robust framework for handling real-time events 
        <br />
        <a href="https://gallifrey-rules.dev"><strong>Get Started »</strong></a>
        <br />
        <br />
        <a href="https://gallifrey-rules.dev" target="_blank">Read the Docs</a>
        .
        <a href="https://github.com/ralphv/gallifrey-rules-sample" target="_blank">Sample Application</a>
    </p>
</p>

### Interested in Gallifrey-Rules?

I offer free one to one sessions via Google Meet to kick-start adoption or to answer questions about the library. 
Please reach out at `mail[at]gallifrey-rules.dev`

### Features at a glance

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