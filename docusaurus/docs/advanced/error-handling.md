---
sidebar_position: 5
---
# Error Handling

There is a handful of special `Exception classes` that you can use to change the engine's behavior.

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

Please note that this behavior can be changed from [the environment variables](/docs/advanced/environment-variables#gr_throw_on_critical_error).

---

### `PauseConsumer`

**Description:**  
This is a special exception. When you throw this exception the event will stop processing and will pause the consumer with the duration specified in the exception. It is highly recommended to use it sparingly. One use case is when you hit some API limit or rate and you want to slow down consumption rate. Needless to say using this will affect your processing throughput.

## ReactToFailure Provider

Another feature Gallifrey Rules provides is a provider that decides what to do 
when you get an unrecoverable error, do you push the failed event to another topic to later consume again?
Or do you perhaps log it to Google Big Query for further analysis and re-queueing? 

Ouf of the box you have [two Providers you can choose from](/docs/advanced/default-built-in-modules#pushtotopicreacttofailureprovider).