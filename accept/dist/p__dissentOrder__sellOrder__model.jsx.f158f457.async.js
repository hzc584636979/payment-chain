(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{T7vn:function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a("d6i3")),s=r(a("p0pE")),l=a("dCQc"),c={namespace:"sellDissentOrder",state:{data:{list:[],pagination:{},history:{}}},effects:{fetch:n.default.mark(function e(t,a){var r,c,i,u,o,p,d,f,h,w,g,y;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,c=a.select,i=a.call,u=a.put,o={},e.next=5,c(function(e){return e.sellDissentOrder.data.history});case 5:if(p=e.sent,!(window.location.href.indexOf("?history")>-1&&0!=Object.keys(p).length)){e.next=13;break}return r=(0,s.default)({},p,{page:p.page||r.page,pageSize:p.pageSize||r.pageSize}),e.next=10,i(l.sellDissentOrderSearchAll,r);case 10:o=e.sent,e.next=16;break;case 13:return e.next=15,i(l.sellDissentOrder,r);case 15:o=e.sent;case 16:return d=o.data||{},f=d.rows,h=d.count,w=r&&r.page,g=r&&r.pageSize,y={list:f,pagination:{total:h,current:w+1,pageSize:g},history:(0,s.default)({},r)},e.next=22,u({type:"save",payload:y});case 22:case"end":return e.stop()}},e)}),search:n.default.mark(function e(t,a){var r,c,i,u,o,p,d,f,h,w;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,c=a.call,i=a.put,e.next=4,c(l.sellDissentOrderSearchAll,r);case 4:return u=e.sent,o=u.data||{},p=o.rows,d=o.count,f=r&&r.page,h=r&&r.pageSize,w={list:p,pagination:{total:d,current:f+1,pageSize:h},history:(0,s.default)({},r)},e.next=11,i({type:"save",payload:w});case 11:case"end":return e.stop()}},e)}),export:n.default.mark(function e(t,a){var r,s,c;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,a.put,console.log(r),e.next=5,s(l.sellDissentOrderSearchAll,r);case 5:return c=e.sent,e.abrupt("return",c);case 7:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,s.default)({},e,{data:t.payload})}}},i=c;t.default=i}}]);