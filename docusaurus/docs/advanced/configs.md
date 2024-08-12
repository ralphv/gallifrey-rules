---
sidebar_position: 2
---
# Configs

Configuration values are a big part of any project and Gallifrey Rules tries to streamline that and give you tremendous flexibility with providing the values.

In short, anytime you need to pull config values from within your plugins you should use [the following methods](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/interfaces/Providers/ConfigurationAccessorInterface.ts#L2).
Even if you have a value that you don't plan to control or supply at runtime it's a good idea to just pass it through these methods
and provide a default value that way in the future you can easily override that in runtime when you need to.

The [default ConfigurationProvider](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/modules/EnvVariableConfigurationProvider.ts#L9) provided by Gallifrey Rules pulls values from environment variables.

As an example, if your [plugin code looks like this](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/plugins/actions/SendEmailAction.ts#L14) that pulls the SMTP server value, then you can provide that
using the environment variable `CONFIG_DEFAULT_SMTP_SERVER`. [Learn more](docs/advanced/default-built-in-modules#envvariableconfigurationprovider).

Furthermore, Gallifrey Rules allows you to provide configuration values `per event`. 
This means you can easily override any value for a specific event by providing the [$config](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/lib/NamespaceSchema.ts#L9) on that particular event.

You may have noticed that you can provide `$config` on different levels in the Schema. 

You can provide it:

1. [Namespace Level Config](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/lib/NamespaceSchema.ts#L9)
2. [Per Entity](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/lib/NamespaceSchema.ts#L28)
3. 