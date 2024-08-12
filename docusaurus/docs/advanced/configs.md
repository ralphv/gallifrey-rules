---
sidebar_position: 2
---
# Configs

In any software project, configuration values are crucial. Gallifrey Rules enhances this experience by offering unparalleled flexibility in managing these values across various levels of granularity.

To ensure consistency and future-proofing, 
it's advisable to always use [the following methods](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/interfaces/Providers/ConfigurationAccessorInterface.ts#L2) when accessing configuration values 
within your plugins. 
Even for configurations that may not require immediate control or modification at runtime, 
it is best practice to use these methods with default values. 
This approach allows for seamless overrides at runtime as your requirements evolve.

The [default ConfigurationProvider](https://github.com/ralphv/gallifrey-rules/blob/99d932a9a252a89ae368a0dc6d307ef1aca40e61/src/modules/EnvVariableConfigurationProvider.ts#L9) in Gallifrey Rules is designed to extract values from environment variables. 
For instance, consider a scenario where [your plugin code retrieves the SMTP server details](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/plugins/actions/SendEmailAction.ts#L14). 
This value can be easily provided using the `CONFIG_DEFAULT_SMTP_SERVER` environment variable.
[Learn more](/docs/advanced/default-built-in-modules#envvariableconfigurationprovider).

Gallifrey Rules further empowers users by enabling configuration values to be
specified at `namespace/entity/event` levels. 
This feature provides a mechanism to override specific configurations for particular events 
by utilizing the `$config` attribute on different levels.

If you look closely at the schema, you will see the different levels where you can provide `$config` values.

You can provide it at:

1. [Namespace Level Config](https://github.com/ralphv/gallifrey-rules/blob/6bcd2e5b058219de3430b1455c84d94a2e31f0c2/src/lib/NamespaceSchema.ts#L9)
2. [Entity Level Config](https://github.com/ralphv/gallifrey-rules/blob/6bcd2e5b058219de3430b1455c84d94a2e31f0c2/src/lib/NamespaceSchema.ts#L34)
3. [Event Level Config](https://github.com/ralphv/gallifrey-rules/blob/6bcd2e5b058219de3430b1455c84d94a2e31f0c2/src/lib/NamespaceSchema.ts#L40)

This capability is **exceptionally powerful**, allowing you to define overrides at varying levels of detail and control specific configurations at a more granular level.

The values defined within the schema are consolidated into a single configuration object and supplied to the
`ConfigurationProvider`, integrating them into its overarching configuration retrieval mechanism.