---
sidebar_position: 1
---
# Scheduled Events Setup

Out of the box, Gallifrey Rules gives you the ability to create events to be consumed in the future.

--- 

## What you need

The `EngineRulesInterface` has a method called `insertScheduledEvent`.

In order for Scheduled Events functionalty to work correctly some extra setup is needed.

1. You need a Postgres database server. You need to provide the proper environment variables to connect to it. You also need two new tables in this database.

2. You need to have a Kafka connect service. Kafka connect will have a connector that will connect to the Postgres DB and determine the events that needs to be pulled Kafka.

---

## Steps to setup

The container `gallifrey-rules-tools` make this super easy for you.

#### Scheduled events tables:

To setup the scheduled events database tables, run the following command

```bash
docker run -it --rm gallifrey-rules-tools create [placeholder]
```
Follow the instructions given by this tool to provide the environment variables to connect to Postgres

#### Kafka connector setup:

To setup the connector, run the following command

```bash
docker run -it --rm gallifrey-rules-tools create [placeholder]
```
Follow the instructions given by this tool to provide the environment variables to connect to Postgres and Kafka connect.

Finally don't forget to provide the Postgres environment variables to Gallifrey Rules engine. [placeholder]

