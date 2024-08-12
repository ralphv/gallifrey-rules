---
sidebar_position: 4
---
# Distributed locks

Distributed locks are a highly beneficial feature for mitigating race conditions in distributed systems. With the ability of your consumers to scale and operate in parallel, there are scenarios where simultaneous processing of events with the same identifier occurs. For instance, processing multiple instances of Order ID 10452 in parallel can lead to conflicts and race conditions.

To address this challenge, the Distributed Locks provider can be utilized to ensure that only one process at a time consumes events related to the same entity with the same ID.

### Steps to Implement Distributed Locks

1. Enable the [environment variable `GR_IS_DISTRIBUTED_LOCKS_ENABLED`](/docs/advanced/environment-variables#gr_is_distributed_locks_enabled) to activate the distributed locks feature.
2. Specify one of the two switches in the Namespace Schema to activate the locks:
    1. [$atomicEntity](https://github.com/ralphv/gallifrey-rules/blob/6bcd2e5b058219de3430b1455c84d94a2e31f0c2/src/lib/NamespaceSchema.ts#L10): This switch will lock based on `Entity Name and Entity ID`.
    2. [$atomicEvent](https://github.com/ralphv/gallifrey-rules/blob/6bcd2e5b058219de3430b1455c84d94a2e31f0c2/src/lib/NamespaceSchema.ts#L11): This switch will lock based on `Entity Name, Event Name, and Entity ID`.
3. The typical use case involves locking based on `Entity Name and Entity ID`.
4. To activate the `$atomic*` switches across all events, they should be specified at the namespace level.

By implementing distributed locks, you can effectively synchronize access to resources, thereby preventing race conditions and ensuring data consistency in your distributed applications.
