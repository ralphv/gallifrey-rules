---
sidebar_position: 5
---
# Error Handling

## Throwing special exceptions from your plugins code.

---

### `InfoError`

**Description:**  
Throwing this exception from plugins means that you want to stop processing the event without any errors and just an info log.

---

### `WarningError`

**Description:**  
Throwing this exception from plugins means that you want to stop processing the event with only a warning.

---

### `CriticalError`

**Description:**  
Throwing this exception from plugins means that you want to stop processing the event with a critical error. Being a critical error this will also stop the consumers and the engine. You should only use this when you want to stop the engine due to an unrecoverable error.

Please note that this behavior can be changed from the environment variables [placeholder]

---

### `PauseConsumer`

**Description:**  
This is a special exception. When you throw this exception the event will stop processing and will pause the consumer with the duration specified in the exception. It is highly recommended to use it sparingly. One use case is when you hit some API limit or rate and you want to slow down consumption rate. Needless to say using this will affect your processing throughput.

## ReactToFailure Provider
[placeholder]
