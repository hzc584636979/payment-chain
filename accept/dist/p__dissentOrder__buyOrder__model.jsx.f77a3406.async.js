(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{mqM2:function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a("d6i3")),s=r(a("p0pE")),u=a("dCQc"),c={namespace:"buyDissentOrder",state:{data:{list:[],pagination:{},history:{}}},effects:{fetch:n.default.mark(function e(t,a){var r,c,i,o,p,l,d,f,y,h,w,g;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,c=a.select,i=a.call,o=a.put,p={},e.next=5,c(function(e){return e.buyDissentOrder.data.history});case 5:if(l=e.sent,!(window.location.href.indexOf("?history")>-1&&0!=Object.keys(l).length)){e.next=13;break}return r=(0,s.default)({},l,{page:l.page||r.page,pageSize:l.pageSize||r.pageSize}),e.next=10,i(u.buyDissentOrderSearchAll,r);case 10:p=e.sent,e.next=16;break;case 13:return e.next=15,i(u.buyDissentOrder,r);case 15:p=e.sent;case 16:return d=p.data||{},f=d.rows,y=d.count,h=r&&r.page,w=r&&r.pageSize,g={list:f,pagination:{total:y,current:h+1,pageSize:w},history:(0,s.default)({},r)},e.next=22,o({type:"save",payload:g});case 22:case"end":return e.stop()}},e)}),search:n.default.mark(function e(t,a){var r,c,i,o,p,l,d,f,y,h;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,c=a.call,i=a.put,e.next=4,c(u.buyDissentOrderSearchAll,r);case 4:return o=e.sent,p=o.data||{},l=p.rows,d=p.count,f=r&&r.page,y=r&&r.pageSize,h={list:l,pagination:{total:d,current:f+1,pageSize:y},history:(0,s.default)({},r)},e.next=11,i({type:"save",payload:h});case 11:case"end":return e.stop()}},e)}),export:n.default.mark(function e(t,a){var r,s,c;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=a.call,a.put,console.log(r),e.next=5,s(u.buyDissentOrderSearchAll,r);case 5:return c=e.sent,e.abrupt("return",c);case 7:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,s.default)({},e,{data:t.payload})}}},i=c;t.default=i}}]);