(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{IwpJ:function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a("d6i3")),s=r(a("p0pE")),u=a("dCQc"),c={namespace:"sellOrder",state:{data:{list:[],pagination:{},history:{}}},effects:{fetch:n.default.mark(function e(t,a){var r,c,l,p,i,o,d,f,w,h,x,g;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,c=a.select,l=a.call,p=a.put,i={},e.next=5,c(function(e){return e.sellOrder.data.history});case 5:if(o=e.sent,!(window.location.href.indexOf("?history")>-1&&0!=Object.keys(o).length)){e.next=13;break}return r=(0,s.default)({},o,{page:o.page||r.page,pageSize:o.pageSize||r.pageSize}),e.next=10,l(u.sellOrderSearchAll,r);case 10:i=e.sent,e.next=16;break;case 13:return e.next=15,l(u.sellOrder,r);case 15:i=e.sent;case 16:return d=i.data||{},f=d.rows,w=d.count,h=r&&r.page,x=r&&r.pageSize,g={list:f,pagination:{total:w,current:h+1,pageSize:x},history:(0,s.default)({},r)},e.next=22,p({type:"save",payload:g});case 22:case"end":return e.stop()}},e)}),search:n.default.mark(function e(t,a){var r,c,l,p,i,o,d,f,w,h;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,c=a.call,l=a.put,e.next=4,c(u.sellOrderSearchAll,r);case 4:return p=e.sent,i=p.data||{},o=i.rows,d=i.count,f=r&&r.page,w=r&&r.pageSize,h={list:o,pagination:{total:d,current:f+1,pageSize:w},history:(0,s.default)({},r)},e.next=11,l({type:"save",payload:h});case 11:case"end":return e.stop()}},e)}),receipt:n.default.mark(function e(t,a){var r,s,c;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,a.put,e.next=4,s(u.sellOrderReceipt,r);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),noReceipt:n.default.mark(function e(t,a){var r,s,c;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,a.put,e.next=4,s(u.sellOrderNoReceipt,r);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),export:n.default.mark(function e(t,a){var r,s,c;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,a.put,e.next=4,s(u.sellOrderSearchAll,r);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,s.default)({},e,{data:t.payload})}}},l=c;t.default=l}}]);