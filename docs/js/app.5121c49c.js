(function(t){function e(e){for(var o,c,s=e[0],i=e[1],u=e[2],l=0,f=[];l<s.length;l++)c=s[l],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&f.push(a[c][0]),a[c]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o]);d&&d(e);while(f.length)f.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],o=!0,c=1;c<n.length;c++){let i=n[c];0!==a[i]&&(o=!1)}o&&(r.splice(e--,1),t=s(s.s=n[0]))}return t}var o={},a={app:0},r=[];function c(t){return s.p+"js/"+({}[t]||t)+"."+{"chunk-2d221fb8":"534fe671"}[t]+".js"}function s(e){if(o[e])return o[e].exports;let n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(t){let e=[],n=a[t];if(0!==n)if(n)e.push(n[2]);else{let o=new Promise((function(e,o){n=a[t]=[e,o]}));e.push(n[2]=o);let r,i=document.createElement("script");i.charset="utf-8",i.timeout=120,s.nc&&i.setAttribute("nonce",s.nc),i.src=c(t);let u=new Error;r=function(e){i.onerror=i.onload=null,clearTimeout(l);let n=a[t];if(0!==n){if(n){let o=e&&("load"===e.type?"missing":e.type),r=e&&e.target&&e.target.src;u.message="Loading chunk "+t+" failed.\n("+o+": "+r+")",u.name="ChunkLoadError",u.type=o,u.request=r,n[1](u)}a[t]=void 0}};var l=setTimeout((function(){r({type:"timeout",target:i})}),12e4);i.onerror=i.onload=r,document.head.appendChild(i)}return Promise.all(e)},s.m=t,s.c=o,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;let n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(let o in t)s.d(n,o,function(e){return t[e]}.bind(null,o));return n},s.n=function(t){let e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/",s.oe=function(t){throw console.error(t),t};let i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=e,i=i.slice();for(let l=0;l<i.length;l++)e(i[l]);var d=u;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("cd49")},"0613":function(t,e,n){"use strict";n("99af"),n("4de4"),n("b0c0"),n("ac1f"),n("5319"),n("1276"),n("2ca0"),n("96cf");let o=n("1da1"),a=n("2b0e"),r=n("2f62");a["default"].use(r["a"]),e["a"]=new r["a"].Store({state:{name:"",alerts:[],connectionState:"Disconnected",isHost:!1,connection:new WebSocket("ws://scholar-bowl-server.herokuapp.com","echo-protocol"),activeBuzzer:null,onlineList:[],host:""},mutations:{setName:function(t,e){t.name=e,localStorage.hasName=JSON.stringify(e)},addAlert:function(t,e){t.alerts.push(e)},removeAlert:function(t,e){t.alerts=t.alerts.filter((function(t){return t!==e}))},changeConnectionState:function(t,e){t.connectionState=e},setHost:function(t,e){t.isHost=e,e&&(t.host=t.name)},setConnection:function(t,e){t.connection=e},setBuzzer:function(t,e){t.activeBuzzer="null"===e?null:e},setOnline:function(t,e){t.onlineList=e},addHost:function(t,e){t.host=e,t.isHost=t.name===t.host},updateHosts:function(t){t.isHost=t.name===t.host}},actions:{start:function(t){let e=t.commit;localStorage?localStorage.hasName?e("setName",JSON.parse(localStorage.hasName)):e("setName",prompt("What name would you like to use?")):alert("Your browser doesn't support local storage - that's an issue. Please use a modern browser that does")},connect:function(t){let e=arguments;return Object(o["a"])(regeneratorRuntime.mark((function n(){let o,a,r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:o=t.commit,a=t.dispatch,r=e.length>1&&void 0!==e[1]&&e[1],o("changeConnectionState","Connecting..."),o("setHost",r),o("updateHosts"),a("join");case 6:case"end":return n.stop()}}),n)})))()},disconnect:function(t){return Object(o["a"])(regeneratorRuntime.mark((function e(){let n,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=t.commit,o=t.state,o.connection.close(),n("changeConnectionState","Disconnected");case 3:case"end":return e.stop()}}),e)})))()},buzz:function(t){let e=t.state,n=t.commit;null===e.activeBuzzer?(e.connection.send("buzz ".concat(e.name)),n("setBuzzer",e.name),n("addAlert","You buzzed")):n("addAlert","".concat(e.activeBuzzer===e.name?"You have":"".concat(e.activeBuzzer," has")," already buzzed"))},clear:function(t){let e=t.state,n=t.commit;e.connection.send("clear"),n("setBuzzer","null"),n("addAlert","You cleared")},join:function(t){return Object(o["a"])(regeneratorRuntime.mark((function e(){let n,o,a,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=t.commit,o=t.dispatch,a=t.state,r=new WebSocket("ws://scholar-bowl-server.herokuapp.com","echo-protocol"),r.onopen=function(t){n("changeConnectionState","Connected"),a.isHost&&r.send("host ".concat(a.name)),n("updateHosts")},r.onclose=function(t){n("addAlert","Connection ".concat(t.wasClean?"":"(not cleanly) ","closed: ").concat(t.reason))},r.onmessage=function(t){let e=t.data;if(e.startsWith("buzz")){let c=e.replace(/^buzz /,"");o("onBuzz",c)}else if(e.startsWith("clear"))o("onClear");else if(e.startsWith("names"))r.send("name ".concat(a.name));else if(e.startsWith("host")){let s=e.replace(/^host /,"");s===a.name&&(n("setHost",!0),n("addAlert","You are now the host")),n("addHost",s),n("updateHosts")}else if(e.startsWith("online")){let i=e.replace(/^online /,"").split(",");n("setOnline",i),n("updateHosts"),a.isHost&&r.send("host ".concat(a.name))}else n("addAlert","Unknown message type: ".concat(e))},r.onerror=function(t){n("addAlert","ERROR: ".concat(t)),console.error("error",t)},n("setConnection",r);case 7:case"end":return e.stop()}}),e)})))()},onBuzz:function(t,e){let n=t.commit;n("addAlert","".concat(e," buzzed")),n("setBuzzer",e)},onClear:function(t){let e=t.commit,n=t.state;e("addAlert","".concat(n.host," cleared")),e("setBuzzer","null")},host:function(t,e){let n=t.state,o=t.commit;n.connection.send("host ".concat(e)),o("addHost",e),o("setHost",e===n.name),o("updateHosts")}},modules:{}})},"5c0b":function(t,e,n){"use strict";let o=n("9c0c"),a=n.n(o);a.a},"9c0c":function(t,e,n){},cd49:function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");let o=n("2b0e"),a=function(){let t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("nav",{staticClass:"navbar navbar-dark bg-secondary",attrs:{id:"nav"}},[n("span",{staticClass:"h-100 nav-form"},[t._v(" Welcome, "),n("b-form-input",{staticClass:"d-inline form-control form-control-sm h-100 align-baseline",staticStyle:{width:"200px"},attrs:{value:t.store.state.name,placeholder:"wait a minute...who are you?"},on:{input:t.updateName}})],1),n("span",{staticClass:"float-right"},[t._v(" "+t._s(t.store.state.connectionState)+" "),"Disconnected"===t.store.state.connectionState?n("button",{staticClass:"btn btn-primary d-inline btn-sm ml-1 align-baseline",on:{click:function(e){return t.connect(!1)}}},[t._v(" Connect ")]):t._e(),"Disconnected"===t.store.state.connectionState?n("button",{staticClass:"btn btn-primary d-inline btn-sm ml-1 align-baseline",on:{click:function(e){return t.connect(!0)}}},[t._v(" Connect as host ")]):"Connected"===t.store.state.connectionState?n("button",{staticClass:"btn btn-primary d-inline btn-sm ml-1 align-baseline",on:{click:function(e){return t.store.dispatch("disconnect")}}},[t._v(" Disconnect ")]):t._e()])]),n("div",{staticClass:"container pt-3"},[n("router-view"),n("Alerts",{staticClass:"fixed-bottom pr-3 pl-3"})],1)])},r=[],c=(n("b0c0"),n("d4ec")),s=n("bee2"),i=n("262e"),u=n("2caf"),l=n("9ab4"),d=n("60a3"),f=n("0613"),p=n("5f5b"),m=function(){let t=this,e=t.$createElement,n=t._self._c||e;return n("div",t._l(t.alerts,(function(e){return n("b-alert",{key:e,attrs:{show:"5",fade:"",dismissible:""}},[t._v(" "+t._s(e)+" ")])})),1)},h=[],b=function(t){Object(i["a"])(n,t);let e=Object(u["a"])(n);function n(){return Object(c["a"])(this,n),e.apply(this,arguments)}return Object(s["a"])(n,[{key:"alerts",get:function(){return f["a"].state.alerts}}]),n}(d["b"]);b=Object(l["a"])([d["a"]],b);let v=b,g=v,w=n("2877"),y=Object(w["a"])(g,m,h,!1,null,null,null),z=y.exports;d["b"].use(p["a"]);let O=function(t){Object(i["a"])(n,t);let e=Object(u["a"])(n);function n(){return Object(c["a"])(this,n),e.apply(this,arguments)}return Object(s["a"])(n,[{key:"mounted",value:function(){f["a"].dispatch("start")}},{key:"updateName",value:function(t){f["a"].commit("setName",t.target.value)}},{key:"connect",value:function(){let t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];f["a"].dispatch("connect",t)}},{key:"name",get:function(){return f["a"].state.name}},{key:"store",get:function(){return f["a"]}}]),n}(d["b"]);O=Object(l["a"])([Object(d["a"])({components:{Alerts:z}})],O);let j=O,k=j,C=(n("5c0b"),Object(w["a"])(k,a,r,!1,null,null,null)),S=C.exports,_=(n("d3b7"),n("8c4f"));o["default"].use(_["a"]);let H=[{path:"/",name:"Main",component:function(){return n.e("chunk-2d221fb8").then(n.bind(null,"cd56"))}}],A=new _["a"]({mode:"history",base:"/",routes:H}),x=A;o["default"].config.productionTip=!1,new o["default"]({router:x,store:f["a"],render:function(t){return t(S)}}).$mount("#app")}});
//# sourceMappingURL=app.5121c49c.js.map