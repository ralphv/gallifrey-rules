"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[256],{1933:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var s=n(4848),o=n(8453);const r={sidebar_position:1},l="Scheduled Events Setup",a={id:"advanced/scheduled-events",title:"Scheduled Events Setup",description:"Out of the box, Gallifrey Rules gives you the ability to create events to be consumed in the future.",source:"@site/docs/advanced/scheduled-events.md",sourceDirName:"advanced",slug:"/advanced/scheduled-events",permalink:"/docs/advanced/scheduled-events",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Reviewing the steps",permalink:"/docs/getting-started/recap"},next:{title:"Configs",permalink:"/docs/advanced/configs"}},c={},d=[{value:"What you need",id:"what-you-need",level:2},{value:"Steps to set up",id:"steps-to-set-up",level:2},{value:"Scheduled events tables:",id:"scheduled-events-tables",level:4},{value:"Kafka connector setup:",id:"kafka-connector-setup",level:4}];function i(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h4:"h4",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"scheduled-events-setup",children:"Scheduled Events Setup"})}),"\n",(0,s.jsx)(t.p,{children:"Out of the box, Gallifrey Rules gives you the ability to create events to be consumed in the future."}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h2,{id:"what-you-need",children:"What you need"}),"\n",(0,s.jsxs)(t.p,{children:["The ",(0,s.jsx)(t.code,{children:"EngineRuleInterface"})," has a method called ",(0,s.jsx)(t.a,{href:"https://github.com/ralphv/gallifrey-rules/blob/main/src/engine-interfaces/EngineScheduledEventsAccessInterface.ts#L8",children:"insertScheduledEvent"}),"."]}),"\n",(0,s.jsx)(t.p,{children:"In order for Scheduled Events functionality to work correctly some extra setup is needed."}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsx)(t.p,{children:"You need a Postgres database server. You need to provide the proper environment variables to connect to it. You also need two new tables in this database."}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsx)(t.p,{children:"You need to have a Kafka connect service. Kafka connect will have a connector that will connect to the Postgres DB and determine the events that needs to be pulled into Kafka."}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.hr,{}),"\n",(0,s.jsx)(t.h2,{id:"steps-to-set-up",children:"Steps to set up"}),"\n",(0,s.jsxs)(t.p,{children:["The container ",(0,s.jsx)(t.code,{children:"ghcr.io/ralphv/gallifrey-rules-tools:latest"})," make this super easy for you."]}),"\n",(0,s.jsx)(t.h4,{id:"scheduled-events-tables",children:"Scheduled events tables:"}),"\n",(0,s.jsx)(t.p,{children:"To set up the scheduled events database tables, run the following command"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"docker run -it --rm ghcr.io/ralphv/gallifrey-rules-tools:latest create-postgres-scheduled-events\n"})}),"\n",(0,s.jsx)(t.p,{children:"Follow the instructions given by this tool to provide the environment variables to connect to Postgres."}),"\n",(0,s.jsx)(t.h4,{id:"kafka-connector-setup",children:"Kafka connector setup:"}),"\n",(0,s.jsx)(t.p,{children:"To set up the connector, run the following command"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-bash",children:"docker run -it --rm ghcr.io/ralphv/gallifrey-rules-tools:latest create-kafka-connector-scheduled-events\n"})}),"\n",(0,s.jsx)(t.p,{children:"Follow the instructions given by this tool to provide the environment variables to connect to Postgres and Kafka connect."}),"\n",(0,s.jsx)(t.p,{children:"Finally, don't forget to provide the Postgres environment variables to Gallifrey Rules engine. [placeholder]"})]})}function h(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(i,{...e})}):i(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>l,x:()=>a});var s=n(6540);const o={},r=s.createContext(o);function l(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:l(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);