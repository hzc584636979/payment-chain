(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{e82U:function(e,a,t){"use strict";var n=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var r=n(t("d6i3")),s=n(t("p0pE")),i=t("dCQc"),p={namespace:"message",state:{data:{list:[],pagination:{},history:{}}},effects:{fetch:r.default.mark(function e(a,t){var n,p,u,c,o,d,l,f,g,w,h,y;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=a.payload,p=t.call,u=t.put,c=t.select,!(window.location.href.indexOf("?history")>-1)){e.next=7;break}return e.next=5,c(function(e){return e.message.data.history});case 5:o=e.sent,n=(0,s.default)({},o,{page:o.page||n.page,pageSize:o.pageSize||n.pageSize});case 7:return e.next=9,p(i.messageData,n);case 9:return d=e.sent,l=d.data||{},f=l.rows,g=l.count,w=n&&n.page,h=n&&n.pageSize,y={list:f,pagination:{total:g,current:w+1,pageSize:h},history:(0,s.default)({},n)},e.next=16,u({type:"save",payload:y});case 16:case"end":return e.stop()}},e)}),search:r.default.mark(function e(a,t){var n,p,u,c,o,d,l,f,g,w;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.payload,p=t.call,u=t.put,t.select,e.next=4,p(i.messageData,n);case 4:return c=e.sent,o=c.data||{},d=o.rows,l=o.count,f=n&&n.page,g=n&&n.pageSize,w={list:d,pagination:{total:l,current:f+1,pageSize:g},history:(0,s.default)({},n)},e.next=11,u({type:"save",payload:w});case 11:case"end":return e.stop()}},e)})},reducers:{save:function(e,a){var t=a.payload;return(0,s.default)({},e,{data:t})}}},u=p;a.default=u}}]);