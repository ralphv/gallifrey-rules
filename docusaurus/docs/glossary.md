---
title: "Glossary"
sidebar_position: 4
---

### `Event Definition:`

[Back to Glossary](#event-definition)

---

### `Modules:`

[Back to Glossary](#event-definition)

---

### `Entity or Entity Name:`

The entity identifies the type or category of data represented by the event.
Think of the entityName as analogous to the name of a table in a relational database.
Just as a table groups similar records (like orders, customers, or suppliers),
the entityName field tells us what kind of data this event pertains to.

__For example:__

An event with entityName: "orders" would be related to order data.

An event with entityName: "customers" would be related to customer data.

An event with entityName: "suppliers" would be related to supplier data.

[Back to Glossary](#event-definition)

---

### `Namespace:`

The namespace is basically the name of your project.

[Back to Glossary](#event-definition)

---

### `Namespace Schema:`

The namespace schema is the JSON object (or YAML) that tells the gallifrey-rules engine 
what to do when it starts. It's like the blueprint of your setup.

You can download or use the JSON Schema of the Namespace Schema so that you can use it in your favorite IDE.

[Namespace-JSON-Schema](https://raw.githubusercontent.com/ralphv/gallifrey-rules/main/src/schemas/namespace-schema.json)

[Online Editor](https://www.jsonschemavalidator.net/s/2mfqpMMf)

[Back to Glossary](#event-definition)

---

