(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{RGGp:function(e,t,r){"use strict";var a=r("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(r("p0pE")),d=a(r("d6i3")),s=r("dCQc"),l=a(r("bALw")),u={namespace:"sellDissentOrderDetail",state:{},effects:{fetch:d.default.mark(function e(t,r){var a,n,u,i,c;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a=r.call,n=r.put,u=(0,l.default)("/dissentOrder/sellOrder_detail/:id").exec(window.location.pathname),i={order_id:u[1],order_type:2},e.next=6,a(s.querySellDissentOrderDetail,i);case 6:return c=e.sent,e.next=9,n({type:"save",payload:c.data});case 9:return e.abrupt("return",c);case 10:case"end":return e.stop()}},e)}),KF:d.default.mark(function e(t,r){var a,n,u,i;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a=r.call,r.put,n=(0,l.default)("/dissentOrder/sellOrder_detail/:id").exec(window.location.pathname),u={order_id:n[1],order_type:2},e.next=6,a(s.sellDissentOrderKF,u);case 6:return i=e.sent,e.abrupt("return",i);case 8:case"end":return e.stop()}},e)}),close:d.default.mark(function e(t,r){var a,n,u,i;return d.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a=r.call,r.put,n=(0,l.default)("/dissentOrder/sellOrder_detail/:id").exec(window.location.pathname),u={order_id:n[1],order_type:2},e.next=6,a(s.sellDissentOrderClose,u);case 6:return i=e.sent,e.abrupt("return",i);case 8:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,n.default)({},e,t.payload)}}},i=u;t.default=i}}]);