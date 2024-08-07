## Best Practices

### Actions:
* It's best not to rely on action responses if possible, let the action raise errors if the responses are not correct rather than give the response back to the rules and let them deal with that.
  * Not relying on action responses also helps with testing where you can simply disable an action and not worry about its response and how it can break the logic.
* Make sure the action's outcome only depends on the request that you get and no other external sources influence it. If a config element is crucial to the action's logic, consider passing that in.
  * Ideally speaking an Action's design is correct if it can transform to running async without ill effects (i.e. scheduled to run in the future). Of course some actions are needed to be synchronise and can't be deferred.

### Rules:
* It is imperative that your rules only have "BUSINESS LOGIC" 
  * Do not pull external data sources outside of Data Objects.
  * Do not mutate data outside actions.
  * When rules do more than they should do, they will undermine all the benefits you get from this engine, especially with metrics and visibility.
  * Try to make your rules concerned with smaller single logic elements, if you have many logic elements, try to keep each atomic logical test in a rule of its own.

### DataObjects:
* Try to use the addResultIntoEventStore always so that if multiple rules within the same event require the same data, they will pull the data once instead of multiple times. Metrics should show you the cache hit rate for DataObjects and it's utilization. 