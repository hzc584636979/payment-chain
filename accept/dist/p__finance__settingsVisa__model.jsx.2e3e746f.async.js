(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[15],{GQvc:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("p0pE")),u=n(a("d6i3")),s=a("dCQc"),c={namespace:"financeSettingsVisa",state:{},effects:{fetch:u.default.mark(function e(t,a){var n,r,c,i;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,r=a.call,c=a.put,e.next=4,r(s.financeSettingsVisa,n);case 4:return i=e.sent,e.next=7,c({type:"save",payload:i.data||{}});case 7:return e.abrupt("return",i.data);case 8:case"end":return e.stop()}},e)}),getCode:u.default.mark(function e(t,a){var n,r,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,r=a.call,a.put,e.next=4,r(s.financeSettingsVisaCode,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),submit:u.default.mark(function e(t,a){var n,r,c,i;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,r=a.call,c=a.put,e.next=4,r(s.financeSettingsVisaSubmit,n);case 4:return i=e.sent,e.next=7,c({type:"save",payload:i});case 7:return e.abrupt("return",i);case 8:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,r.default)({},e,t.payload)}}},i=c;t.default=i}}]);