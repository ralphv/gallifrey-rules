"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[67],{573:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>d});var i=n(4848),s=n(8453);const o={sidebar_position:5},a="The Modules",r={id:"getting-started/the-modules",title:"The Modules",description:"Gallifrey Rules has a dynamic plugins loading system. The $modulesPath in the namespace schema takes a list of directories to load modules from dynamically. The loading is done recursively. The '$' is a special path that tells the engine to load the internal built in modules.",source:"@site/docs/getting-started/the-modules.md",sourceDirName:"getting-started",slug:"/getting-started/the-modules",permalink:"/docs/getting-started/the-modules",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Consumers in the Schema",permalink:"/docs/getting-started/consumers-schema"},next:{title:"Reviewing the steps",permalink:"/docs/getting-started/recap"}},l={},d=[{value:"To create a module:",id:"to-create-a-module",level:3},{value:"Engine Interfaces",id:"engine-interfaces",level:3},{value:"Plugins",id:"plugins",level:3},{value:"Filter:",id:"filter",level:4},{value:"Rule:",id:"rule",level:4},{value:"DataObject:",id:"dataobject",level:4},{value:"Action:",id:"action",level:4},{value:"Providers",id:"providers",level:3},{value:"Module types and Interfaces:",id:"module-types-and-interfaces",level:3}];function c(e){const t={a:"a",code:"code",h1:"h1",h3:"h3",h4:"h4",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",strong:"strong",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"the-modules",children:"The Modules"})}),"\n",(0,i.jsxs)(t.p,{children:["Gallifrey Rules has a dynamic plugins loading system. The ",(0,i.jsx)(t.code,{children:"$modulesPath"})," in the namespace schema takes a list of directories to load modules from dynamically. The loading is done recursively. The ",(0,i.jsx)(t.code,{children:"'$'"})," is a special path that tells the engine to load the internal built in modules."]}),"\n",(0,i.jsx)(t.p,{children:"Modules in Gallifrey Rules are conceptually divided into two types. Plugins and Providers."}),"\n",(0,i.jsx)(t.h3,{id:"to-create-a-module",children:"To create a module:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsx)(t.p,{children:"Create a new TypeScript file with a TypeScript class in it."}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsxs)(t.p,{children:["The Typescript class has to be the ",(0,i.jsx)(t.code,{children:"default export"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsx)(t.p,{children:"You have to decorate the class with one of two decorators:"}),"\n",(0,i.jsxs)(t.p,{children:["a. ",(0,i.jsx)(t.a,{href:"https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/InterfaceDecorators.ts#L27",children:"@GallifreyPlugin"}),": It takes a single parameter, ",(0,i.jsx)(t.code,{children:"PluginType"}),", which indicates the plugin type."]}),"\n",(0,i.jsxs)(t.p,{children:["b. ",(0,i.jsx)(t.a,{href:"https://github.com/ralphv/gallifrey-rules/blob/main/src/interfaces/InterfaceDecorators.ts#L49",children:"@GallifreyProvider"}),": It takes two parameters. The first one is the ",(0,i.jsx)(t.code,{children:"ProviderType"})," and the second one is whether or not to mark this provider as the ",(0,i.jsx)(t.code,{children:"default"})," one for it's class."]}),"\n"]}),"\n",(0,i.jsxs)(t.li,{children:["\n",(0,i.jsx)(t.p,{children:"You have to implement the Interface for your particular module."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["All interface will require at least providing the module name via ",(0,i.jsx)(t.code,{children:"getModuleName()"})," method. The default naming pattern validation will force this to be all lower letters with ",(0,i.jsx)(t.code,{children:"-"})," as seperator. Also know as ",(0,i.jsx)(t.a,{href:"https://www.pluralsight.com/blog/software-development/programming-naming-conventions-explained#kebab-.case",children:"kebab-case"})," You can also modify the naming convention patters. ",(0,i.jsx)(t.a,{href:"/docs/advanced/environment-variables#gr_module_name_pattern",children:"Learn more"}),"."]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.h3,{id:"engine-interfaces",children:"Engine Interfaces"}),"\n",(0,i.jsxs)(t.p,{children:["When Gallifrey Rules call methods on your modules, it will pass in an ",(0,i.jsx)(t.code,{children:"Engine Interface"}),". For example for Rules, it will pass in ",(0,i.jsx)(t.a,{href:"https://github.com/ralphv/gallifrey-rules/blob/main/src/engine-interfaces/EngineRuleInterface.ts#L17",children:"EngineRuleInterface"}),". These engine interfaces are provided to your modules to access the engine services. Through them, you can, for example, schedule future event, get configurations, do actions, pull data objects, add metrics and much more. It's easy to discover what the interfaces do through the IDE's code completion features."]}),"\n",(0,i.jsxs)(t.p,{children:["Some plugins will not get all the services, for example ",(0,i.jsx)(t.code,{children:"Rules"})," can ",(0,i.jsx)(t.code,{children:"schedule future events"})," because they are concerned with the business logic, however it doesn't make sense for an action to schedule a future event, so you won't find that in ",(0,i.jsx)(t.code,{children:"EngineActionInterface"}),". Similarly an action should not be able to pull data because that's something a rule should do. Actions should only take a payload and do something based on that, think of them like ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Pure_function",children:"pure functions"}),". The outcome of the action should never be influnced by external states. This is especially important when you want to modify your Action to run asynchronously."]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.h3,{id:"plugins",children:"Plugins"}),"\n",(0,i.jsx)(t.p,{children:"Plugins are usually created on the start of a new event and are destroyed when the event is done."}),"\n",(0,i.jsx)(t.p,{children:"There are currently 4 Plugin types:"}),"\n",(0,i.jsx)(t.h4,{id:"filter",children:"Filter:"}),"\n",(0,i.jsx)(t.p,{children:"A filter is a plugin that runs on the start of an event and has a simple job, can we continue processing and run the rules? or skip this event."}),"\n",(0,i.jsx)(t.h4,{id:"rule",children:"Rule:"}),"\n",(0,i.jsxs)(t.p,{children:["A rule is the core element in the engine. It is the business logic that runs for each event. It is better practicse to have a single concern per rule, this will make it easier to reuse. Your schema will dictate which rules to run per event. ",(0,i.jsx)(t.strong,{children:"It is very important to avoid the mistake of writing all your code inside a rule, transforming it into a blackbox again and loosing a lot of the key benefits that this engine delivers"}),". Mutations should go into Actions, Hydrating Data should go into DataObjects. ",(0,i.jsx)(t.strong,{children:"Proper seperation of concerns is extremelly important."})]}),"\n",(0,i.jsx)(t.h4,{id:"dataobject",children:"DataObject:"}),"\n",(0,i.jsx)(t.p,{children:"A data object is a plugin that is concerned with pulling or hydrating data. Any data requests should go through data objects. API calls? GraphQL Calls? Loading data from database? All of those should go into data objects, Moreover data objects should not modify any state, just read data."}),"\n",(0,i.jsx)(t.h4,{id:"action",children:"Action:"}),"\n",(0,i.jsxs)(t.p,{children:["Actions take parameters and mutate something in your system based solely on those parameters. They should be like ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Pure_function",children:"pure functions"})," in nature. While actions can return data that you can act upon, usually a success or a failure result, it is ",(0,i.jsx)(t.strong,{children:"best practise"})," to avoid basing logic on that, it will be easier to transform your Actions into Async Actions in the future if your rule logic doesn't depend on the return value of Actions."]}),"\n",(0,i.jsxs)(t.p,{children:["Actions also have access to pulling configuration values, but you should not use any config values to directly influence the logic of the action, remember they should remain ",(0,i.jsx)(t.strong,{children:"pure functions"}),". Suppose you have an Action that sends a Slack message,\nyou can use config values to figure out what the WebHook URL is, but you should not use config values to modify the contents of your Slack messages for example."]}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.h3,{id:"providers",children:"Providers"}),"\n",(0,i.jsx)(t.p,{children:"Providers are modules that provide basic functionalites to the engine state. Most of the provider instances are created and retained throughout the lifetime of the engine. Some examples include your metrics provider or your scheduled events provider."}),"\n",(0,i.jsx)(t.p,{children:"When the engine is initializing, there is some logic involved to decide which providers to load, and it goes like this."}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["Explicitly defining your provider name within the ",(0,i.jsx)(t.code,{children:"$providers"})," of your schema."]}),"\n",(0,i.jsx)(t.li,{children:"If a provider isn't explicitly defined but there is a single provider loaded for its type, the engine will automatically use that, or"}),"\n",(0,i.jsxs)(t.li,{children:["If there are multiple providers for its type but only one is marked as ",(0,i.jsx)(t.code,{children:"default"})," then it will use that."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"Otherwise the engine will complain that it can't figure out which provider to use, in this case it is asking you to explicitly provide it via the namespace schema."}),"\n",(0,i.jsx)(t.hr,{}),"\n",(0,i.jsx)(t.h3,{id:"module-types-and-interfaces",children:"Module types and Interfaces:"}),"\n",(0,i.jsxs)(t.p,{children:["Check the ",(0,i.jsx)(t.a,{href:"/docs/advanced/default-built-in-modules",children:"list of built-in modules here"}),"."]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>r});var i=n(6540);const s={},o=i.createContext(s);function a(e){const t=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(o.Provider,{value:t},e.children)}}}]);