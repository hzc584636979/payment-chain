(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{"5VD2":function(e,t,a){"use strict";var r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(a("d6i3")),u=r(a("p0pE")),d=a("dCQc"),l={namespace:"goldYieldOrder",state:{data:{list:[],pagination:{},history:{}}},effects:{fetch:n.default.mark(function e(t,a){var r,l,c,s,i,o,p,f,w,g,h,y;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,l=a.select,c=a.call,s=a.put,i={},e.next=5,l(function(e){return e.goldYieldOrder.data.history});case 5:if(o=e.sent,!(window.location.href.indexOf("?history")>-1&&0!=Object.keys(o).length)){e.next=13;break}return r=(0,u.default)({},o,{page:o.page||r.page,pageSize:o.pageSize||r.pageSize}),e.next=10,c(d.goldYieldOrderSearchAll,r);case 10:i=e.sent,e.next=16;break;case 13:return e.next=15,c(d.goldYieldOrder,r);case 15:i=e.sent;case 16:return p=i.data||{},f=p.rows,w=p.count,g=r&&r.page,h=r&&r.pageSize,y={list:f,pagination:{total:w,current:g+1,pageSize:h},history:(0,u.default)({},r)},e.next=22,s({type:"save",payload:y});case 22:case"end":return e.stop()}},e)}),search:n.default.mark(function e(t,a){var r,l,c,s,i,o,p,f,w,g;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,l=a.call,c=a.put,e.next=4,l(d.goldYieldOrderSearchAll,r);case 4:return s=e.sent,i=s.data||{},o=i.rows,p=i.count,f=r&&r.page,w=r&&r.pageSize,g={list:o,pagination:{total:p,current:f+1,pageSize:w},history:(0,u.default)({},r)},e.next=11,c({type:"save",payload:g});case 11:case"end":return e.stop()}},e)}),export:n.default.mark(function e(t,a){var r,u,l;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=a.call,a.put,e.next=4,u(d.goldYieldOrderSearchAll,r);case 4:return l=e.sent,e.abrupt("return",l);case 6:case"end":return e.stop()}},e)}),yield:n.default.mark(function e(t,a){var r,u,l;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=a.call,a.put,e.next=4,u(d.yieldErc20,r);case 4:return l=e.sent,e.abrupt("return",l);case 6:case"end":return e.stop()}},e)}),auditOrder:n.default.mark(function e(t,a){var r,u,l;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=a.call,a.put,e.next=4,u(d.goldYieldOrderAuditOrder,r);case 4:return l=e.sent,e.abrupt("return",l);case 6:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){var a=t.payload;return(0,u.default)({},e,{data:a})}}},c=l;t.default=c}}]);