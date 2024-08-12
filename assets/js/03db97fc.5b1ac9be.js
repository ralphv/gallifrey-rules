"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[643],{7670:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var o=n(4848),i=n(8453);const t={sidebar_position:5},s="Error Handling",a={id:"advanced/error-handling",title:"Error Handling",description:"There is a handful of special Exception classes that you can use to change the engine's behavior.",source:"@site/docs/advanced/error-handling.md",sourceDirName:"advanced",slug:"/advanced/error-handling",permalink:"/docs/advanced/error-handling",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Distributed locks",permalink:"/docs/advanced/distributed-locks"},next:{title:"Default Built in Modules",permalink:"/docs/advanced/default-built-in-modules"}},c={},d=[{value:"<code>InfoError</code>",id:"infoerror",level:3},{value:"<code>WarningError</code>",id:"warningerror",level:3},{value:"<code>CriticalError</code>",id:"criticalerror",level:3},{value:"<code>PauseConsumer</code>",id:"pauseconsumer",level:3},{value:"ReactToFailure Provider",id:"reacttofailure-provider",level:2}];function l(e){const r={a:"a",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",p:"p",strong:"strong",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.header,{children:(0,o.jsx)(r.h1,{id:"error-handling",children:"Error Handling"})}),"\n",(0,o.jsxs)(r.p,{children:["There is a handful of special ",(0,o.jsx)(r.code,{children:"Exception classes"})," that you can use to change the engine's behavior."]}),"\n",(0,o.jsx)(r.hr,{}),"\n",(0,o.jsx)(r.h3,{id:"infoerror",children:(0,o.jsx)(r.code,{children:"InfoError"})}),"\n",(0,o.jsxs)(r.p,{children:[(0,o.jsx)(r.strong,{children:"Description:"}),(0,o.jsx)(r.br,{}),"\n","Throwing this exception from plugins means that you want to stop processing the event without any errors and just an info log."]}),"\n",(0,o.jsx)(r.hr,{}),"\n",(0,o.jsx)(r.h3,{id:"warningerror",children:(0,o.jsx)(r.code,{children:"WarningError"})}),"\n",(0,o.jsxs)(r.p,{children:[(0,o.jsx)(r.strong,{children:"Description:"}),(0,o.jsx)(r.br,{}),"\n","Throwing this exception from plugins means that you want to stop processing the event with only a warning."]}),"\n",(0,o.jsx)(r.hr,{}),"\n",(0,o.jsx)(r.h3,{id:"criticalerror",children:(0,o.jsx)(r.code,{children:"CriticalError"})}),"\n",(0,o.jsxs)(r.p,{children:[(0,o.jsx)(r.strong,{children:"Description:"}),(0,o.jsx)(r.br,{}),"\n","Throwing this exception from plugins means that you want to stop processing the event with a critical error. Being a critical error this will also stop the consumers and the engine. You should only use this when you want to stop the engine due to an unrecoverable error."]}),"\n",(0,o.jsxs)(r.p,{children:["Please note that this behavior can be changed from ",(0,o.jsx)(r.a,{href:"/docs/advanced/environment-variables#gr_throw_on_critical_error",children:"the environment variables"}),"."]}),"\n",(0,o.jsx)(r.hr,{}),"\n",(0,o.jsx)(r.h3,{id:"pauseconsumer",children:(0,o.jsx)(r.code,{children:"PauseConsumer"})}),"\n",(0,o.jsxs)(r.p,{children:[(0,o.jsx)(r.strong,{children:"Description:"}),(0,o.jsx)(r.br,{}),"\n","This is a special exception. When you throw this exception the event will stop processing and will pause the consumer with the duration specified in the exception. It is highly recommended to use it sparingly. One use case is when you hit some API limit or rate and you want to slow down consumption rate. Needless to say using this will affect your processing throughput."]}),"\n",(0,o.jsx)(r.h2,{id:"reacttofailure-provider",children:"ReactToFailure Provider"}),"\n",(0,o.jsx)(r.p,{children:"Another feature Gallifrey Rules provides is a provider that decides what to do\nwhen you get an unrecoverable error, do you push the failed event to another topic to later consume again?\nOr do you perhaps log it to Google Big Query for further analysis and re-queueing?"}),"\n",(0,o.jsxs)(r.p,{children:["Ouf of the box you have ",(0,o.jsx)(r.a,{href:"/docs/advanced/default-built-in-modules#pushtotopicreacttofailureprovider",children:"two Providers you can choose from"}),"."]})]})}function h(e={}){const{wrapper:r}={...(0,i.R)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},8453:(e,r,n)=>{n.d(r,{R:()=>s,x:()=>a});var o=n(6540);const i={},t=o.createContext(i);function s(e){const r=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),o.createElement(t.Provider,{value:r},e.children)}}}]);