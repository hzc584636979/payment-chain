(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{sMfp:function(e,t,r){"use strict";var a=r("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(r("d6i3")),u=a(r("p0pE"));r("miYZ");var s=a(r("tsqr")),c=r("dCQc"),l={namespace:"withdrawApply",state:{},effects:{getCoinInfo:n.default.mark(function e(t,r){var a,l,p,o;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,l=r.call,p=r.put,r.select,e.next=4,l(c.getUserInfo);case 4:if(o=e.sent,1==o.status){e.next=8;break}return s.default.error("\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u51fa\u9519\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5\uff01"),e.abrupt("return",{});case 8:return e.next=10,p({type:"save",payload:o.data?(0,u.default)({},o.data.walletInfo[a.walletType],{gas:o.data.walletInfo[0].gas,loading:!0}):null});case 10:return e.abrupt("return",o);case 11:case"end":return e.stop()}},e)}),getCode:n.default.mark(function e(t,r){var a,u,s,l;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a=r.call,r.put,u=r.select,e.next=4,u(function(e){return e.user.currentUser.telephone_number});case 4:return s=e.sent,e.next=7,a(c.withdrawApplyCode,{telephone_number:s});case 7:return l=e.sent,e.abrupt("return",l);case 9:case"end":return e.stop()}},e)}),submit:n.default.mark(function e(t,r){var a,s,l,p,o;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=r.call,r.put,l=r.select,e.next=4,l(function(e){return e.user.currentUser.telephone_number});case 4:return p=e.sent,e.next=7,s(c.withdrawApplySubmit,(0,u.default)({},a,{telephone_number:p}));case 7:return o=e.sent,e.abrupt("return",o);case 9:case"end":return e.stop()}},e)}),clear:n.default.mark(function e(t,r){var a;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r.call,a=r.put,e.next=3,a({type:"clearData"});case 3:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){var r=t.payload;return(0,u.default)({},e,r)},clearData:function(){return{}}}},p=l;t.default=p}}]);