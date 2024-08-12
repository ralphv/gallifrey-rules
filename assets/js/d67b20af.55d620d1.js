"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[81],{6184:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>u,frontMatter:()=>t,metadata:()=>h,toc:()=>x});var r=s(4848),i=s(8453),l=(s(6540),s(5195));const o={tableOfContentsInline:"tableOfContentsInline_prmo"};function d(e){let{toc:n,minHeadingLevel:s,maxHeadingLevel:i}=e;return(0,r.jsx)("div",{className:o.tableOfContentsInline,children:(0,r.jsx)(l.A,{toc:n,minHeadingLevel:s,maxHeadingLevel:i,className:"table-of-contents",linkClassName:null})})}const t={sidebar_position:6,toc_min_heading_level:3,toc_max_heading_level:5,title:"Environment Variables"},c=void 0,h={id:"advanced/environment-variables",title:"Environment Variables",description:"This document outlines the environment variables used by Gallifrey Rules. These variables can be set in your environment to configure various aspects of the library's behavior. Most environment variables are prefixed with GR_.",source:"@site/docs/advanced/environment-variables.mdx",sourceDirName:"advanced",slug:"/advanced/environment-variables",permalink:"/docs/advanced/environment-variables",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,toc_min_heading_level:3,toc_max_heading_level:5,title:"Environment Variables"},sidebar:"tutorialSidebar",previous:{title:"Default Built in Modules",permalink:"/docs/advanced/default-built-in-modules"},next:{title:"Testing",permalink:"/docs/advanced/testing"}},a={},x=[{value:"<code>GR_LOG_LEVEL</code>",id:"gr_log_level",level:3},{value:"<code>GR_THROW_ON_NOT_MODULE</code>",id:"gr_throw_on_not_module",level:3},{value:"<code>GR_EXTENSIONS_OF_MODULES</code>",id:"gr_extensions_of_modules",level:3},{value:"<code>GR_SKIP_EXTENSIONS_OF_MODULES</code>",id:"gr_skip_extensions_of_modules",level:3},{value:"<code>GR_MODULES_PATHS</code>",id:"gr_modules_paths",level:3},{value:"<code>GR_MODULE_NAME_PATTERN</code>",id:"gr_module_name_pattern",level:3},{value:"<code>GR_INFLUXDB_TOKEN</code>",id:"gr_influxdb_token",level:3},{value:"<code>GR_INFLUXDB_ORG</code>",id:"gr_influxdb_org",level:3},{value:"<code>GR_INFLUXDB_BUCKET</code>",id:"gr_influxdb_bucket",level:3},{value:"<code>GR_INFLUXDB_URL</code>",id:"gr_influxdb_url",level:3},{value:"<code>GR_THROW_ON_EVENT_UNHANDLED_EXCEPTION</code>",id:"gr_throw_on_event_unhandled_exception",level:3},{value:"<code>GR_THROW_ON_CRITICAL_ERROR</code>",id:"gr_throw_on_critical_error",level:3},{value:"<code>GR_ENABLE_CONSUMER_METRICS</code>",id:"gr_enable_consumer_metrics",level:3},{value:"<code>GR_AUTO_COMMIT_THRESHOLD</code>",id:"gr_auto_commit_threshold",level:3},{value:"<code>GR_AUTO_COMMIT_INTERVAL</code>",id:"gr_auto_commit_interval",level:3},{value:"<code>GR_ADD_EXTRA_TO_CONSOLE_JOURNAL_LOGS</code>",id:"gr_add_extra_to_console_journal_logs",level:3},{value:"<code>GR_FAIL_EVENT_ON_SINGLE_RULE_FAIL</code>",id:"gr_fail_event_on_single_rule_fail",level:3},{value:"<code>GR_PLUGIN_CLASS_NAMES_FORCE_POSTFIX</code>",id:"gr_plugin_class_names_force_postfix",level:3},{value:"<code>GR_PLUGIN_MODULE_NAMES_FORCE_POSTFIX</code>",id:"gr_plugin_module_names_force_postfix",level:3},{value:"<code>GR_KAFKA_CLIENT_ID</code>",id:"gr_kafka_client_id",level:3},{value:"<code>GR_KAFKA_BROKERS</code>",id:"gr_kafka_brokers",level:3},{value:"<code>GR_DB_USERNAME</code>",id:"gr_db_username",level:3},{value:"<code>GR_DB_HOSTNAME</code>",id:"gr_db_hostname",level:3},{value:"<code>GR_DB_NAME</code>",id:"gr_db_name",level:3},{value:"<code>GR_DB_PASSWORD</code>",id:"gr_db_password",level:3},{value:"<code>GR_DB_PORT</code>",id:"gr_db_port",level:3},{value:"<code>GR_IS_DISTRIBUTED_LOCKS_ENABLED</code>",id:"gr_is_distributed_locks_enabled",level:3},{value:"<code>GR_DISTRIBUTED_LOCKS_MAX_WAIT_TIME_SECONDS</code>",id:"gr_distributed_locks_max_wait_time_seconds",level:3},{value:"<code>GR_IS_CONTINUE_ON_FAILED_ACQUIRE_LOCK</code>",id:"gr_is_continue_on_failed_acquire_lock",level:3},{value:"<code>GR_IS_SCHEMA_FILE_MANDATORY</code>",id:"gr_is_schema_file_mandatory",level:3}];function j(e){const n={a:"a",br:"br",code:"code",h3:"h3",hr:"hr",li:"li",p:"p",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.p,{children:["This document outlines the environment variables used by ",(0,r.jsx)(n.strong,{children:"Gallifrey Rules"}),". These variables can be set in your environment to configure various aspects of the library's behavior. Most environment variables are prefixed with ",(0,r.jsx)(n.code,{children:"GR_"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Please note that you can easily append ",(0,r.jsx)(n.code,{children:"_FILE"})," to the end of the environment name to make it load from a file, this is especially useful for secrets."]}),"\n",(0,r.jsx)("h2",{id:"#heading-id",children:"List of variables"}),"\n",(0,r.jsx)(d,{toc:x}),"\n",(0,r.jsx)(n.h3,{id:"gr_log_level",children:(0,r.jsx)(n.code,{children:"GR_LOG_LEVEL"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls the default log level. These correspond to the values of the library ",(0,r.jsx)(n.a,{href:"https://github.com/stritti/log4js",children:"log4js"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","String. enums: ",(0,r.jsx)(n.code,{children:"['debug', 'info', 'warn', 'error']"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"info"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_throw_on_not_module",children:(0,r.jsx)(n.code,{children:"GR_THROW_ON_NOT_MODULE"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether to throw an exception or ignore, if a module is missing the decorators to designate them as plugins or providers."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boo lean."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"FALSE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_extensions_of_modules",children:(0,r.jsx)(n.code,{children:"GR_EXTENSIONS_OF_MODULES"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Specifies the extensions of files to consider as modules and attempt to load."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array of Path/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:".ts,.js"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["By default the engine will attempt to load all modules under the given folders. An alternative is to use ",(0,r.jsx)(n.code,{children:".module.js,.module.ts"})," to limit the files to those extensions."]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_skip_extensions_of_modules",children:(0,r.jsx)(n.code,{children:"GR_SKIP_EXTENSIONS_OF_MODULES"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Specifies the extensions of files to ignore as modules."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array of Path/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:".d.ts"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"It is important to ignore the .d.ts files otherwise the engine will get confused an attempt to load the same modules twice which will throw errors in the process"}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_modules_paths",children:(0,r.jsx)(n.code,{children:"GR_MODULES_PATHS"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Specifies the default paths of modules to load."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array of Path/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"[]"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Usually you use the ",(0,r.jsx)(n.code,{children:"$modulesPaths"})," in the schema to load the modules. But you can use this as an alternative for a cleaner namespace schema."]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_module_name_pattern",children:(0,r.jsx)(n.code,{children:"GR_MODULE_NAME_PATTERN"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls the naming pattern of the module names. i.e. ",(0,r.jsx)(n.code,{children:"getModuleName()"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Regex String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"^[a-z]+(-[a-z0-9]+)*$"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["The default is to follow ",(0,r.jsx)(n.a,{href:"https://www.pluralsight.com/blog/software-development/programming-naming-conventions-explained#kebab-case",children:"kebab-case"})," But you can change this or completely disable it."]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_influxdb_token",children:(0,r.jsx)(n.code,{children:"GR_INFLUXDB_TOKEN"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The InfluxDB token"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Secret String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Required only if you specify ",(0,r.jsx)(n.code,{children:"GR_INFLUXDB_URL"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_influxdb_org",children:(0,r.jsx)(n.code,{children:"GR_INFLUXDB_ORG"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The InfluxDB organization"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"gallifrey-rules"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Required only if you specify ",(0,r.jsx)(n.code,{children:"GR_INFLUXDB_URL"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_influxdb_bucket",children:(0,r.jsx)(n.code,{children:"GR_INFLUXDB_BUCKET"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The InfluxDB bucket"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"gallifrey-rules-bucket"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Required only if you specify ",(0,r.jsx)(n.code,{children:"GR_INFLUXDB_URL"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_influxdb_url",children:(0,r.jsx)(n.code,{children:"GR_INFLUXDB_URL"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The InfluxDB server url (with http/https and port number if needed)"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"If you don't specify this, metrics will be disabled."}),"\n",(0,r.jsx)(n.li,{children:"If you do specify this, you need to specify the other InfluxDB needed parameters."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_throw_on_event_unhandled_exception",children:(0,r.jsx)(n.code,{children:"GR_THROW_ON_EVENT_UNHANDLED_EXCEPTION"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether or not to bubble up unhandled exceptions from consumers."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"TRUE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Usually in production environments you want this to be false, which means it will log/deal with errors but continue consuming subsequent messages."}),"\n",(0,r.jsx)(n.li,{children:"If this is true, the consumers will stop and the engine will stop."}),"\n",(0,r.jsx)(n.li,{children:"Since this is a critical element of the engine's behavior, it is defaults to true and expected to be manually specified in production environments."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_throw_on_critical_error",children:(0,r.jsx)(n.code,{children:"GR_THROW_ON_CRITICAL_ERROR"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Critical Errors are thrown when you use the exception ",(0,r.jsx)(n.code,{children:"CriticalError"})," in your plugins code. You can decide on the behavior whether or not this means your consumer should stop or ignore and continue consuming subsequent messages. Please check the list of exception types that you can throw in your code to understand the different behaviors. [placeholder]"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"TRUE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Usually you want this to be true, because throwing this type of exception in the plugin code means that there is some critical error and we need to hard stop."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_enable_consumer_metrics",children:(0,r.jsx)(n.code,{children:"GR_ENABLE_CONSUMER_METRICS"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether the engine should enable metrics at a kafka consumer level."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"TRUE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_auto_commit_threshold",children:(0,r.jsx)(n.code,{children:"GR_AUTO_COMMIT_THRESHOLD"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls the count of messages to do an auto commit."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Number"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"1"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Usually in production environment you want to increase this number to get a better throughput. It's a balance between throughput and error resilience. If your consumers are not ",(0,r.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Idempotence",children:"idempotent"})," in nature, you might want to keep this low."]}),"\n",(0,r.jsx)(n.li,{children:"Ideally your system design should have idempotent consumers which means idepotent events/rules."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_auto_commit_interval",children:(0,r.jsx)(n.code,{children:"GR_AUTO_COMMIT_INTERVAL"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls the internal to auto commit in milliseconds."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Number"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"5000"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Usually in production environment you want to increase this number to get a better throughput. It's a balance between throughput and error resilience. If your consumers are not ",(0,r.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Idempotence",children:"idempotent"})," in nature, you might want to keep this low."]}),"\n",(0,r.jsx)(n.li,{children:"Ideally your system design should have idempotent consumers which means idepotent events/rules."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_add_extra_to_console_journal_logs",children:(0,r.jsx)(n.code,{children:"GR_ADD_EXTRA_TO_CONSOLE_JOURNAL_LOGS"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether journal logs should print out the extra payloads."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"FALSE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Usually this is left off to increase readability of journal logs. However in troubleshooting situations, it makes sense to turn it on."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_fail_event_on_single_rule_fail",children:(0,r.jsx)(n.code,{children:"GR_FAIL_EVENT_ON_SINGLE_RULE_FAIL"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","When an event has multiple rules to process, this control whether when a single rule gets an  exception to bubble up or ignore. Ignoring means subsequent rules will still run."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"TRUE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["Setting this to false means unhandled errors in rules will now not bubble up no matter what, this means they will just get logged and go through ",(0,r.jsx)(n.code,{children:"ReactToRuleFailureProvider"}),"."]}),"\n",(0,r.jsx)(n.li,{children:"Ideally you want this to always be TRUE."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_plugin_class_names_force_postfix",children:(0,r.jsx)(n.code,{children:"GR_PLUGIN_CLASS_NAMES_FORCE_POSTFIX"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether or not class names of plugins should be postfixed with their plugin type. For Example, send email action should have the class named ",(0,r.jsx)(n.code,{children:"SendEmailAction"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"TRUE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Keeping this to true will help organize your classes and make them easily distinguishable. Highly recommended to be on."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_plugin_module_names_force_postfix",children:(0,r.jsx)(n.code,{children:"GR_PLUGIN_MODULE_NAMES_FORCE_POSTFIX"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether or not module names of plugins should be postfixed with their plugin type. For Example, send email action should have the module name ",(0,r.jsx)(n.code,{children:"send-email-action"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"TRUE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Keeping this to true will help organize your module names and make them easily distinguishable. Highly recommended to be on."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_kafka_client_id",children:(0,r.jsx)(n.code,{children:"GR_KAFKA_CLIENT_ID"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The client ID to be provided to Kafka server"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"gallifrey-rules"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"You can override this value when you pass it in the config of the consumer in the Namespace schema [placeholder]"}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_kafka_brokers",children:(0,r.jsx)(n.code,{children:"GR_KAFKA_BROKERS"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The list of brokers of your Kafka setup"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"This must be filled in, otherwise you will have to manually specify it in the config of the consumer in the Namespace schema."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_db_username",children:(0,r.jsx)(n.code,{children:"GR_DB_USERNAME"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The postgres DB username"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no. YES when using Postgres Distrubuted Locks Provider or Scheduled Events feature"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["This can also be specified using ",(0,r.jsx)(n.code,{children:"POSTGRES_USERNAME"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_db_hostname",children:(0,r.jsx)(n.code,{children:"GR_DB_HOSTNAME"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The postgres DB server hostname"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no. YES when using Postgres Distrubuted Locks Provider or Scheduled Events feature"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["This can also be specified using ",(0,r.jsx)(n.code,{children:"POSTGRES_HOST"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_db_name",children:(0,r.jsx)(n.code,{children:"GR_DB_NAME"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The postgres database name"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no. YES when using Postgres Distrubuted Locks Provider or Scheduled Events feature"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["This can also be specified using ",(0,r.jsx)(n.code,{children:"POSTGRES_DB"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_db_password",children:(0,r.jsx)(n.code,{children:"GR_DB_PASSWORD"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The postgres DB password"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no. YES when using Postgres Distrubuted Locks Provider or Scheduled Events feature"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["This can also be specified using ",(0,r.jsx)(n.code,{children:"POSTGRES_PASSWORD"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_db_port",children:(0,r.jsx)(n.code,{children:"GR_DB_PORT"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","The postgres DB server port"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Array/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"5432"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["This can also be specified using ",(0,r.jsx)(n.code,{children:"POSTGRES_PORT"})]}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_is_distributed_locks_enabled",children:(0,r.jsx)(n.code,{children:"GR_IS_DISTRIBUTED_LOCKS_ENABLED"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Whether or not you want to use Postgres Distributed Locks Provider"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"FALSE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"When set to true, the Postgres DB parameters should also be specified."}),"\n",(0,r.jsxs)(n.li,{children:["To fully activate locks, you need to use ",(0,r.jsx)(n.code,{children:"$atomicEvent"})," and/or ",(0,r.jsx)(n.code,{children:"$atomicEntity"})," in your schema. [placeholder]"]}),"\n",(0,r.jsx)(n.li,{children:"To function correctly, all instances of the engine should be connected to the same Postgres DB parameters."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_distributed_locks_max_wait_time_seconds",children:(0,r.jsx)(n.code,{children:"GR_DISTRIBUTED_LOCKS_MAX_WAIT_TIME_SECONDS"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","When distributed locks are used, what is the maximum wait time to attempt to aquire the lock."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Number/Seconds"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"60"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_is_continue_on_failed_acquire_lock",children:(0,r.jsx)(n.code,{children:"GR_IS_CONTINUE_ON_FAILED_ACQUIRE_LOCK"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","When distributed locks are used, and a lock has failed to be aquired, this controls the behavior of whether to throw an exception or ignore the lock and continue without it."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Boolean"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"FALSE"})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Ideally you don't want to continue if you fail to aquire the lock."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{}),"\n",(0,r.jsx)(n.h3,{id:"gr_is_schema_file_mandatory",children:(0,r.jsx)(n.code,{children:"GR_IS_SCHEMA_FILE_MANDATORY"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Description:"}),(0,r.jsx)(n.br,{}),"\n","Controls whether or not ",(0,r.jsx)(n.code,{children:"$schemaFile"})," is mandatory in the Namespace. When mandatory, it should point to a JSON schema file to validate against the event payload."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Type:"}),(0,r.jsx)(n.br,{}),"\n","Path/String"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Default:"}),(0,r.jsx)(n.br,{}),"\n","``"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Mandatory:"}),(0,r.jsx)(n.br,{}),"\n",(0,r.jsx)(n.code,{children:"no, YES in production unless explicitly specified and turned off"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Notes:"})}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"It's a good idea to have an extra layer of validation of the message payloads."}),"\n"]}),"\n",(0,r.jsx)(n.hr,{})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(j,{...e})}):j(e)}},5195:(e,n,s)=>{s.d(n,{A:()=>_});var r=s(6540),i=s(6342);function l(e){const n=e.map((e=>({...e,parentIndex:-1,children:[]}))),s=Array(7).fill(-1);n.forEach(((e,n)=>{const r=s.slice(2,e.level);e.parentIndex=Math.max(...r),s[e.level]=n}));const r=[];return n.forEach((e=>{const{parentIndex:s,...i}=e;s>=0?n[s].children.push(i):r.push(i)})),r}function o(e){let{toc:n,minHeadingLevel:s,maxHeadingLevel:r}=e;return n.flatMap((e=>{const n=o({toc:e.children,minHeadingLevel:s,maxHeadingLevel:r});return function(e){return e.level>=s&&e.level<=r}(e)?[{...e,children:n}]:n}))}function d(e){const n=e.getBoundingClientRect();return n.top===n.bottom?d(e.parentNode):n}function t(e,n){let{anchorTopOffset:s}=n;const r=e.find((e=>d(e).top>=s));if(r){return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(d(r))?r:e[e.indexOf(r)-1]??null}return e[e.length-1]??null}function c(){const e=(0,r.useRef)(0),{navbar:{hideOnScroll:n}}=(0,i.p)();return(0,r.useEffect)((()=>{e.current=n?0:document.querySelector(".navbar").clientHeight}),[n]),e}function h(e){const n=(0,r.useRef)(void 0),s=c();(0,r.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:r,linkActiveClassName:i,minHeadingLevel:l,maxHeadingLevel:o}=e;function d(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(r),d=function(e){let{minHeadingLevel:n,maxHeadingLevel:s}=e;const r=[];for(let i=n;i<=s;i+=1)r.push(`h${i}.anchor`);return Array.from(document.querySelectorAll(r.join()))}({minHeadingLevel:l,maxHeadingLevel:o}),c=t(d,{anchorTopOffset:s.current}),h=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,s){s?(n.current&&n.current!==e&&n.current.classList.remove(i),e.classList.add(i),n.current=e):e.classList.remove(i)}(e,e===h)}))}return document.addEventListener("scroll",d),document.addEventListener("resize",d),d(),()=>{document.removeEventListener("scroll",d),document.removeEventListener("resize",d)}}),[e,s])}var a=s(8774),x=s(4848);function j(e){let{toc:n,className:s,linkClassName:r,isChild:i}=e;return n.length?(0,x.jsx)("ul",{className:i?void 0:s,children:n.map((e=>(0,x.jsxs)("li",{children:[(0,x.jsx)(a.A,{to:`#${e.id}`,className:r??void 0,dangerouslySetInnerHTML:{__html:e.value}}),(0,x.jsx)(j,{isChild:!0,toc:e.children,className:s,linkClassName:r})]},e.id)))}):null}const u=r.memo(j);function _(e){let{toc:n,className:s="table-of-contents table-of-contents__left-border",linkClassName:d="table-of-contents__link",linkActiveClassName:t,minHeadingLevel:c,maxHeadingLevel:a,...j}=e;const _=(0,i.p)(),p=c??_.tableOfContents.minHeadingLevel,g=a??_.tableOfContents.maxHeadingLevel,m=function(e){let{toc:n,minHeadingLevel:s,maxHeadingLevel:i}=e;return(0,r.useMemo)((()=>o({toc:l(n),minHeadingLevel:s,maxHeadingLevel:i})),[n,s,i])}({toc:n,minHeadingLevel:p,maxHeadingLevel:g});return h((0,r.useMemo)((()=>{if(d&&t)return{linkClassName:d,linkActiveClassName:t,minHeadingLevel:p,maxHeadingLevel:g}}),[d,t,p,g])),(0,x.jsx)(u,{toc:m,className:s,linkClassName:d,...j})}},8453:(e,n,s)=>{s.d(n,{R:()=>o,x:()=>d});var r=s(6540);const i={},l=r.createContext(i);function o(e){const n=r.useContext(l);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(l.Provider,{value:n},e.children)}}}]);