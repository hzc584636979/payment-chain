(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[31],{"8bIy":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getPageQuery=r,t.setAuthority=o;var n=a("Qyje");function r(){return(0,n.parse)(window.location.href.split("?")[1])}function o(e){var t="string"===typeof e?[e]:e;localStorage.setItem("antd-pro-authority",JSON.stringify(t));try{window.reloadAuthorized&&window.reloadAuthorized()}catch(e){}return e}},ebWa:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("d6i3")),o=n(a("p0pE")),u=a("7DNP"),i=a("dCQc"),s=a("8bIy"),c={namespace:"userAndlogin",state:{status:void 0},effects:{phoneLogin:r.default.mark(function e(t,a){var n,c,l,d,f,w,p,g;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,c=a.call,l=a.put,e.next=4,c(i.phoneAccountLogin,n);case 4:if(d=e.sent,1!=d.status){e.next=24;break}if(f=new URL(window.location.href),w=(0,s.getPageQuery)(),p=w.redirect,!p){e.next=18;break}if(g=new URL(p),g.origin!==f.origin){e.next=16;break}p=p.substr(f.origin.length),p.match(/^\/.*#/)&&(p=p.substr(p.indexOf("#")+1)),e.next=18;break;case 16:return window.location.href=p,e.abrupt("return");case 18:return e.next=20,l({type:"changeLoginStatus",payload:d.data?(0,o.default)({},d.data.accountInfo,d.data.userInfo,{gas:d.data.walletInfo[0].gas,walletInfo:d.data.walletInfo,erc20:d.data.walletInfo[0],omni:d.data.walletInfo[1]}):null});case 20:return e.next=22,l(u.routerRedux.replace(p||"/"));case 22:e.next=24;break;case 24:return e.abrupt("return",d);case 25:case"end":return e.stop()}},e)}),emailLogin:r.default.mark(function e(t,a){var n,c,l,d,f,w,p,g;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,c=a.call,l=a.put,e.next=4,c(i.emailAccountLogin,n);case 4:if(d=e.sent,1!=d.status){e.next=24;break}if(f=new URL(window.location.href),w=(0,s.getPageQuery)(),p=w.redirect,!p){e.next=18;break}if(g=new URL(p),g.origin!==f.origin){e.next=16;break}p=p.substr(f.origin.length),p.match(/^\/.*#/)&&(p=p.substr(p.indexOf("#")+1)),e.next=18;break;case 16:return window.location.href=p,e.abrupt("return");case 18:return e.next=20,l({type:"changeLoginStatus",payload:d.data?(0,o.default)({},d.data.accountInfo,d.data.userInfo,{walletInfo:d.data.walletInfo,erc20:d.data.walletInfo[0],omni:d.data.walletInfo[1]}):null});case 20:return e.next=22,l(u.routerRedux.replace(p||"/"));case 22:e.next=24;break;case 24:return e.abrupt("return",d);case 25:case"end":return e.stop()}},e)})},reducers:{changeLoginStatus:function(e,t){var a=t.payload;return(0,s.setAuthority)("admin"),g_setLocalStorage(a),(0,o.default)({},e,{status:a.status})}}},l=c;t.default=l}}]);