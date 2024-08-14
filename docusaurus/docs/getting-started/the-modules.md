---
sidebar_position: 5
---
# The Modules

Gallifrey Rules has a dynamic plugins loading system. The `$modulesPath` in the namespace schema takes a list of directories to load modules from dynamically. The loading is done recursively. The `'$'` is a special path that tells the engine to load the internal built in modules.

Modules in Gallifrey Rules are conceptually divided into two types. Plugins and Providers.

### To create a module:

1. Create a new TypeScript file with a TypeScript class in it.
2. The Typescript class has to be the `default export`.
3. You have to decorate the class with one of two decorators:
    
    a. [@GallifreyPlugin](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/InterfaceDecorators.ts#L27): It takes a single parameter, `PluginType`, which indicates the plugin type. 
   
    b. [@GallifreyProvider](https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/InterfaceDecorators.ts#L49): It takes two parameters. The first one is the `ProviderType` and the second one is whether or not to mark this provider as the `default` one for it's class.

4. You have to implement the Interface for your particular module.

All interface will require at least providing the module name via `getModuleName()` method. Note that if you don't provide it, it will **automatically be provided by the engine and will default to the class name**.
The default naming pattern validation will force this to be either [kebab-case](https://www.pluralsight.com/blog/software-development/programming-naming-conventions-explained#kebab-.case) OR [PascalCase](https://www.pluralsight.com/blog/software-development/programming-naming-conventions-explained#pascal-case). You can also modify the naming convention patters. [Learn more](/docs/advanced/environment-variables#gr_module_name_pattern). 

---

### Engine Interfaces

When Gallifrey Rules call methods on your modules, it will pass in an `Engine Interface`. For example for Rules, it will pass in [EngineRuleInterface](https://github.com/ralphv/gallifrey-rules/blob/main/src/engine-interfaces/EngineRuleInterface.ts#L17). These engine interfaces are provided to your modules to access the engine services. Through them, you can, for example, schedule future event, get configurations, do actions, pull data objects, add metrics and much more. It's easy to discover what the interfaces do through the IDE's code completion features. 

Some plugins will not get all the services, for example `Rules` can `schedule future events` because they are concerned with the business logic, however it doesn't make sense for an action to schedule a future event, so you won't find that in `EngineActionInterface`. Similarly an action should not be able to pull data because that's something a rule should do. Actions should only take a payload and do something based on that, think of them like [pure functions](https://en.wikipedia.org/wiki/Pure_function). The outcome of the action should never be influnced by external states. This is especially important when you want to modify your Action to run asynchronously.

---

### Plugins

Plugins are usually created on the start of a new event and are destroyed when the event is done. 

There are currently 4 Plugin types:

#### Filter:

A filter is a plugin that runs on the start of an event and has a simple job, can we continue processing and run the rules? or skip this event.

#### Rule:

A rule is the core element in the engine. It is the business logic that runs for each event. It is better practicse to have a single concern per rule, this will make it easier to reuse. Your schema will dictate which rules to run per event. **It is very important to avoid the mistake of writing all your code inside a rule, transforming it into a blackbox again and loosing a lot of the key benefits that this engine delivers**. Mutations should go into Actions, Hydrating Data should go into DataObjects. **Proper seperation of concerns is extremelly important.**

#### DataObject:

A data object is a plugin that is concerned with pulling or hydrating data. Any data requests should go through data objects. API calls? GraphQL Calls? Loading data from database? All of those should go into data objects, Moreover data objects should not modify any state, just read data.

#### Action:

Actions take parameters and mutate something in your system based solely on those parameters. They should be like [pure functions](https://en.wikipedia.org/wiki/Pure_function) in nature. While actions can return data that you can act upon, usually a success or a failure result, it is **best practise** to avoid basing logic on that, it will be easier to transform your Actions into Async Actions in the future if your rule logic doesn't depend on the return value of Actions.

Actions also have access to pulling configuration values, but you should not use any config values to directly influence the logic of the action, remember they should remain **pure functions**. Suppose you have an Action that sends a Slack message,
you can use config values to figure out what the WebHook URL is, but you should not use config values to modify the contents of your Slack messages for example.

---

### Providers

Providers are modules that provide basic functionalites to the engine state. Most of the provider instances are created and retained throughout the lifetime of the engine. Some examples include your metrics provider or your scheduled events provider. 

When the engine is initializing, there is some logic involved to decide which providers to load, and it goes like this.

1. Explicitly defining your provider name within the `$providers` of your schema.
2. If a provider isn't explicitly defined but there is a single provider loaded for its type, the engine will automatically use that, or
3. If there are multiple providers for its type but only one is marked as `default` then it will use that. 

Otherwise the engine will complain that it can't figure out which provider to use, in this case it is asking you to explicitly provide it via the namespace schema.

---

### Module types and Interfaces:


Check the [list of built-in modules here](/docs/advanced/default-built-in-modules).

