(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{W5cY:function(e,t,r){"use strict";var a=r("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(r("p0pE")),u=a(r("d6i3")),s=r("dCQc"),c={namespace:"userForget",state:{status:void 0},effects:{getPhoneCode:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.forgetPhoneCode,a);case 4:return c=e.sent,console.log(c),e.abrupt("return",c);case 7:case"end":return e.stop()}},e)}),nextPhoneStep2:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.forgetNextPhoneStep2,a);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),phoneSubmit:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.phoneForget,a);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),getEmailCode:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.forgetEmailCode,a);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),nextEmailStep2:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.forgetNextEmailStep2,a);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)}),emailSubmit:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.emailForget,a);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})},reducers:{registerHandle:function(e,t){var r=t.payload;return(0,n.default)({},e,{status:r.status})}}},o=c;t.default=o}}]);