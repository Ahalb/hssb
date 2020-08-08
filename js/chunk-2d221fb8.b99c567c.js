(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d221fb8"],{cd56:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{attrs:{id:"main"}},["Connected"!==t.store.state.connectionState?n("button",{staticClass:"btn btn-primary d-inline btn-sm align-baseline mt-3 mt-sm-0 col-md",on:{click:function(e){return t.connect(!1)}}},[t._v("Connect")]):n("button",{staticClass:"btn btn-primary d-inline btn-sm align-baseline col-md",on:{click:function(e){return t.store.dispatch("disconnect")}}},[t._v("Disconnect")]),"Connected"!==t.store.state.connectionState?n("button",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],staticClass:"btn btn-primary d-inline btn-sm align-baseline mt-2 col-md",attrs:{title:"Connect as a host; the host can clear buzzes"},on:{click:function(e){return t.connect(!0)}}},[t._v("Connect as host")]):n("button",{staticClass:"btn btn-primary d-inline btn-sm align-baseline col-md mt-2",on:{click:t.reconnect}},[t._v("Reconnect")]),n("button",{staticClass:"btn btn-secondary btn-lg w-100 mb-3 mt-3",on:{click:t.buzz}},[t._v("Buzz")]),t.isHost?n("button",{staticClass:"btn btn-secondary btn-lg w-100 mb-3",on:{click:t.clear}},[t._v("Clear")]):t._e(),t.onlineList.length?n("div",{staticClass:"mb-3"},[n("h4",[t._v("Online")]),n("b-list-group",t._l(t.onlineList,(function(e){return n("b-list-group-item",{directives:[{name:"show",rawName:"v-show",value:e.trim().length,expression:"user.trim().length"}],key:e,attrs:{active:t.activeBuzzer===e}},[n("span",{staticClass:"align-middle"},[n("span",{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{hover:!0}}],attrs:{title:e+" is the host"}},[t._v(t._s(t.host===e?"◆":""))]),t._v(" "+t._s(e)+" ")]),t.host!==e&&t.isHost?n("b-button",{staticClass:"btn-sm float-right make-host",on:{click:function(n){return t.makeHost(e)}}},[t._v("Make Host")]):t._e()],1)})),1)],1):t._e(),n("a",{staticClass:"sr-only",attrs:{href:"#footer"}},[t._v("Skip alerts")]),n("Alerts",{staticClass:"sticky-bottom mb-5 pb-5"})],1)},s=[],c=(n("caad"),n("b0c0"),n("2532"),n("498a"),n("96cf"),n("1da1")),i=n("d4ec"),o=n("bee2"),r=n("262e"),l=n("2caf"),u=n("9ab4"),b=n("60a3"),m=n("0613"),h=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",t._l(t.alerts,(function(e,a){return n("b-alert",{key:""+e+a,attrs:{show:"5",fade:"",dismissible:""}},[t._v(" "+t._s(e)+" ")])})),1)},d=[],v=function(t){Object(r["a"])(n,t);var e=Object(l["a"])(n);function n(){return Object(i["a"])(this,n),e.apply(this,arguments)}return Object(o["a"])(n,[{key:"alerts",get:function(){return m["a"].state.alerts}}]),n}(b["b"]);v=Object(u["a"])([b["a"]],v);var f=v,p=f,k=n("2877"),y=Object(k["a"])(p,h,d,!1,null,null,null),g=y.exports,_=n("f7fe"),w=n.n(_),C=function(t){Object(r["a"])(n,t);var e=Object(l["a"])(n);function n(){var t;return Object(i["a"])(this,n),t=e.apply(this,arguments),t.debounceReconnect=w()(t.reconnect,500),t}return Object(o["a"])(n,[{key:"makeHost",value:function(t){m["a"].dispatch("host",t),m["a"].commit("addAlert","You are no longer the host")}},{key:"buzz",value:function(){m["a"].dispatch("buzz")}},{key:"clear",value:function(){m["a"].dispatch("clear")}},{key:"updateName",value:function(t){m["a"].commit("setName",t),!t.includes(",")&&t.trim().length&&this.debounceReconnect()}},{key:"connect",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];m["a"].dispatch("connect",t)}},{key:"reconnect",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=m["a"].state.name===m["a"].state.host,t.next=3,m["a"].dispatch("disconnect");case 3:return t.next=5,m["a"].dispatch("connect",e);case 5:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{key:"name",get:function(){return m["a"].state.name}},{key:"isHost",get:function(){return this.host===this.name}},{key:"onlineList",get:function(){return m["a"].state.onlineList}},{key:"host",get:function(){return m["a"].state.host}},{key:"activeBuzzer",get:function(){return m["a"].state.activeBuzzer}},{key:"store",get:function(){return m["a"]}}]),n}(b["b"]);C=Object(u["a"])([Object(b["a"])({components:{Alerts:g}})],C);var z=C,O=z,j=Object(k["a"])(O,a,s,!1,null,null,null);e["default"]=j.exports}}]);
//# sourceMappingURL=chunk-2d221fb8.b99c567c.js.map