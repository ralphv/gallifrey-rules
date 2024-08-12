---
sidebar_position: 6
---
# Reviewing the steps

Let's quickly recap what are the step needed to create a new project using Gallifrey Rules. 
Check [the sample app](https://github.com/ralphv/gallifrey-rules-sample/) if needed.

1. Create a new Typescript/Node.Js application.
2. include `gallifrey-rules` from npm.
3. Create a folder under your project just for your `modules`.
4. Create the entry point to your application and initialize the Gallifrey Rules Engine instance.
5. Prepare your Namespace Schema. You will need
   1. The path to your modules folder.
   2. Your list of consumers, with their event dispatcher providers.
   3. Decide on your entities/events and the rules that will run.
6. Dockerize your app, provide the proper environment variables needed to get your started. At 
the very least you will need a Kafka setup.