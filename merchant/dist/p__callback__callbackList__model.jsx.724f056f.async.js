(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{Vb0X:function(e,a,t){"use strict";var n=t("mZ4U");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var r=n(t("Ico4")),c=n(t("mK77")),l=t("dCQc"),s={namespace:"callbackList",state:{data:{list:[],pagination:{},history:{}}},effects:{fetch:r.default.mark(function e(a,t){var n,s,u,i,o,p,d,f,h,w,g,y;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.payload,s=t.select,u=t.call,i=t.put,o={},e.next=5,s(function(e){return e.callbackList.data.history});case 5:if(p=e.sent,!(window.location.href.indexOf("?history")>-1&&0!=Object.keys(p).length)){e.next=13;break}return n=(0,c.default)({},p,{page:p.page||n.page,pageSize:p.pageSize||n.pageSize}),e.next=10,u(l.callbackSearchAll,n);case 10:o=e.sent,e.next=16;break;case 13:return e.next=15,u(l.callback,n);case 15:o=e.sent;case 16:return d=o.data||{},f=d.rows,h=d.count,w=n&&n.page,g=n&&n.pageSize,y={list:f,pagination:{total:h,current:w+1,pageSize:g},history:(0,c.default)({},n)},e.next=22,i({type:"save",payload:y});case 22:case"end":return e.stop()}},e)}),search:r.default.mark(function e(a,t){var n,s,u,i,o,p,d,f,h,w;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.payload,s=t.call,u=t.put,e.next=4,s(l.callbackSearchAll,n);case 4:return i=e.sent,o=i.data||{},p=o.rows,d=o.count,f=n&&n.page,h=n&&n.pageSize,w={list:p,pagination:{total:d,current:f+1,pageSize:h},history:(0,c.default)({},n)},e.next=11,u({type:"save",payload:w});case 11:case"end":return e.stop()}},e)}),export:r.default.mark(function e(a,t){var n,c,s;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.payload,c=t.call,t.put,e.next=4,c(l.callbackSearchAll,n);case 4:return s=e.sent,e.abrupt("return",s);case 6:case"end":return e.stop()}},e)})},reducers:{save:function(e,a){return(0,c.default)({},e,{data:a.payload})}}},u=s;a.default=u}}]);