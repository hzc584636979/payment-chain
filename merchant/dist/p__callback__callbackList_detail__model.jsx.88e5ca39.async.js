(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{OB6W:function(e,a,t){"use strict";var c=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n=c(t("p0pE")),r=c(t("d6i3")),l=t("dCQc"),u=c(t("bALw")),d={namespace:"callbackDetail",state:{},effects:{fetch:r.default.mark(function e(a,t){var c,n,d,s,i;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a.payload,c=t.call,n=t.put,d=(0,u.default)("/callback/callbackList_detail/:id").exec(window.location.pathname),s={id:d[1]},e.next=6,c(l.queryCallbackDetail,s);case 6:return i=e.sent,e.next=9,n({type:"save",payload:i.data});case 9:return e.abrupt("return",i);case 10:case"end":return e.stop()}},e)})},reducers:{save:function(e,a){return(0,n.default)({},e,a.payload)}}},s=d;a.default=s}}]);