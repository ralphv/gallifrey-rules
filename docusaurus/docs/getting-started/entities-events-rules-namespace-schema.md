---
sidebar_position: 3
---
# Entities/Events/Rules in the Schema

In the previous page, we have established that we have a single entity `orders`. For orders, we have a single event called `new-order`. And
when we get the event `new-order` of entity `orders`, we run the single rule `notify-customer-new-order-rule`.

Let's see what [the rule looks like in our sample example](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/plugins/rules/NotifyCustomerNewOrderRule.ts#L16).

The rule plugin has to provide at least one method. `trigger` which is the entry of the rule. 

In the `trigger` method, you can see a simple 3-step logic.

1. Pull customer information using customerID: This is external data and so it should be done through
    a DataObject plugin. **Remember its very important that your rule only has business logic** It should not pull data and it should not mutate data. 
2. Create an email body: Once you get the customer info, we can put together a nice email.
3. Send an email notifying new order: Once the email body is ready, now we have to send this email.
Sending the email is a mutation, basically an action that changes or does something in your system. In this case
it will send/queue the email.

___

Rule: [NotifyCustomerNewOrderRule](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/plugins/rules/NotifyCustomerNewOrderRule.ts#L16)

DataObject: [CustomerInfoDataObject](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/plugins/data-objects/CustomerInfoDataObject.ts#L13)

Action: [SendEmailAction](https://github.com/ralphv/gallifrey-rules-sample/blob/main/src/modules/plugins/actions/SendEmailAction.ts#L13)


