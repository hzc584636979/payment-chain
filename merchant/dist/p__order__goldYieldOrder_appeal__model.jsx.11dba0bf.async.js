(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[30],{"/0Zz":function(e,a,t){"use strict";var r=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var d=r(t("d6i3")),n=r(t("p0pE")),u=t("dCQc"),l=r(t("bALw")),p={namespace:"goldYieldOrderAppeal",state:{data:{}},effects:{submit:d.default.mark(function e(a,t){var r,p,o,s,c,i;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=a.payload,p=t.call,o=t.put,s=(0,l.default)("/order/goldYieldOrder_appeal/:id").exec(window.location.pathname),c=(0,n.default)({},r,{order_id:s[1],order_type:2}),e.next=6,p(u.goldYieldOrderAppeal,c);case 6:return i=e.sent,e.next=9,o({type:"save",payload:i.result});case 9:return e.abrupt("return",i);case 10:case"end":return e.stop()}},e)})},reducers:{save:function(e,a){return(0,n.default)({},e,{data:a.payload})}}},o=p;a.default=o}}]);