(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{QDGq:function(e,r,t){"use strict";var a=t("mZ4U");Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var n=a(t("mK77")),d=a(t("Ico4")),l=t("dCQc"),u=a(t("UaMt")),c={namespace:"sellOrderDetail",state:{},effects:{fetch:d.default.mark(function e(r,t){var a,n,c,o,i;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r.payload,a=t.call,n=t.put,c=(0,u.default)("/order/sellOrder_detail/:id").exec(window.location.pathname),o={order_id:c[1],order_type:2},e.next=6,a(l.querySellOrderDetail,o);case 6:return i=e.sent,e.next=9,n({type:"save",payload:i.data});case 9:return e.abrupt("return",i);case 10:case"end":return e.stop()}},e)}),receipt:d.default.mark(function e(r,t){var a,n,c,o;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r.payload,a=t.call,t.put,n=(0,u.default)("/order/sellOrder_detail/:id").exec(window.location.pathname),c={order_id:n[1]},e.next=6,a(l.sellOrderReceipt,c);case 6:return o=e.sent,e.abrupt("return",o);case 8:case"end":return e.stop()}},e)}),noReceipt:d.default.mark(function e(r,t){var a,n,c,o;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r.payload,a=t.call,t.put,n=(0,u.default)("/order/sellOrder_detail/:id").exec(window.location.pathname),c={order_id:n[1]},e.next=6,a(l.sellOrderNoReceipt,c);case 6:return o=e.sent,e.abrupt("return",o);case 8:case"end":return e.stop()}},e)})},reducers:{save:function(e,r){return(0,n.default)({},e,r.payload)}}},o=c;r.default=o}}]);