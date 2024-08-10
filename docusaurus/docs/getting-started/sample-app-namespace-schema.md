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

