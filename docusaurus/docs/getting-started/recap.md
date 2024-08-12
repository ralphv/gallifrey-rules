---
sidebar_position: 6
---
# Reviewing the steps

Let's quickly recap what are the step needed to create a new project using Gallifrey Rules. 

1. Create a new Typescript/Node.Js application.
2. Include `gallifrey-rules` from npm.

   ```shell
   npm i gallifrey-rules
   ```
3. Create a folder under your project just for your `modules`.
4. Create the entry point to your application and create the Gallifrey Rules Engine instance.
5. Prepare your Namespace Schema. You will need
   1. The path to your modules folder.
   2. Your list of consumers, with their event dispatcher providers.
   3. Decide on your entities/events and the rules that will run.
6. Initialize the engine with your schema and call `startConsumers()`.
7. Dockerize your app, provide the proper environment variables needed to get your started. At 
the very least you will need a Kafka setup.

You can always check [the sample app](https://github.com/ralphv/gallifrey-rules-sample/) for more details.
