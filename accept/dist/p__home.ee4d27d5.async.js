(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{Jyqh:function(e,t,a){e.exports={wrap:"antd-pro-components-layer-style-wrap",title:"antd-pro-components-layer-style-title",close:"antd-pro-components-layer-style-close",mask:"antd-pro-components-layer-style-mask"}},WNL3:function(e,t,a){e.exports=a.p+"static/img_home_banner.e909022f.png"},dZZS:function(e,t,a){e.exports={wrap:"antd-pro-pages-home-style-wrap",layoutLeft:"antd-pro-pages-home-style-layoutLeft",layoutRight:"antd-pro-pages-home-style-layoutRight",userInfo:"antd-pro-pages-home-style-userInfo",avatar:"antd-pro-pages-home-style-avatar",user:"antd-pro-pages-home-style-user",bottom:"antd-pro-pages-home-style-bottom",button:"antd-pro-pages-home-style-button",messageWrap:"antd-pro-pages-home-style-messageWrap",message1:"antd-pro-pages-home-style-message1",passed:"antd-pro-pages-home-style-passed",message1error:"antd-pro-pages-home-style-message1error",message2:"antd-pro-pages-home-style-message2",message3:"antd-pro-pages-home-style-message3",itemBox:"antd-pro-pages-home-style-itemBox",title:"antd-pro-pages-home-style-title",item:"antd-pro-pages-home-style-item",but:"antd-pro-pages-home-style-but",itemBoxBg2:"antd-pro-pages-home-style-itemBoxBg2",otherWrap:"antd-pro-pages-home-style-otherWrap",orderWrap:"antd-pro-pages-home-style-orderWrap",name:"antd-pro-pages-home-style-name",num:"antd-pro-pages-home-style-num",payLayout:"antd-pro-pages-home-style-payLayout",ewm:"antd-pro-pages-home-style-ewm",address:"antd-pro-pages-home-style-address",desc:"antd-pro-pages-home-style-desc",mortgageLayout:"antd-pro-pages-home-style-mortgageLayout",passedLayer:"antd-pro-pages-home-style-passedLayer"}},lggp:function(e,t,a){"use strict";var l=a("mZ4U"),n=a("fbTi");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("/9S5");var d=l(a("W5sj"));a("inXZ");var s=l(a("db/f"));a("1THz");var u=l(a("SsKN"));a("xjEU");var r=l(a("uiF6"));a("ePFx");var c=l(a("0Bz6"));a("7lm+");var i=l(a("Oy9c"));a("flUi");var m=l(a("BFxG"));a("GOpK");var f=l(a("D012"));a("eqX4");var o=l(a("ek8B")),p=l(a("3CjV")),y=l(a("43Yg")),g=l(a("/tCh")),E=l(a("scpF")),h=l(a("O/V9")),v=l(a("8aBX"));a("QnEw");var b,N,S,k=l(a("52uI")),x=n(a("2w0b")),w=l(a("h5Yw")),U=a("J3b2"),C=a("XLjY"),A=l(a("ttOL")),L=l(a("+Qhu")),T=a("+n12"),B=l(a("a/LZ")),O=l(a("ketZ")),D=l(a("scG4")),V=l(a("dZZS")),R=l(a("WNL3")),I=(l(a("wata")),k.default.Option),M=(b=(0,C.connect)(function(e){var t=e.user,a=e.home,l=e.loading;return{currentUser:t.currentUser,home:a,loading:l.effects["home/fetch"],getUserInfoLoading:l.effects["user/getUserInfo"]}}),b((S=function(e){function t(){var e,a;(0,y.default)(this,t);for(var l=arguments.length,n=new Array(l),d=0;d<l;d++)n[d]=arguments[d];return a=(0,E.default)(this,(e=(0,h.default)(t)).call.apply(e,[this].concat(n))),a.state={accountBalance1:g_getLocalStorage("accountBalance1")||!1,tokenBalance1:g_getLocalStorage("tokenBalance1")||!1,tokenBalance2:g_getLocalStorage("tokenBalance2")||!1,payVisible:!1,mortgageVisible:!1,buyStatus:"out",sellStatus:"out",walletType:1},a.eyeVisible=function(e){(0,T.getRealNamePassed)()&&(a.setState((0,p.default)({},e,!a.state[e])),g_setLocalStorage(!a.state[e],e))},a.handlePayVisible=function(){(0,T.getRealNamePassed)()&&a.setState({payVisible:!a.state.payVisible})},a.handleMortgageVisible=function(){(0,T.getRealNamePassed)()&&a.setState({mortgageVisible:!a.state.mortgageVisible})},a.toggleManagement=function(e,t){if((0,T.getRealNamePassed)()){var l=a.props.dispatch,n="buyStatus"==e?"home/buyStatus":"home/sellStatus";l({type:n,payload:{online_status:t}}).then(function(e){1==e.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),l({type:"user/getUserInfo"})):o.default.error(e.msg)})}},a.handleClipBoard=function(e){(0,L.default)(e)?o.default.success("\u590d\u5236\u6210\u529f"):o.default.error("\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5")},a.checkUserAuth=function(){var e=a.props.dispatch;(0,T.getRealNamePassed)()||e(C.routerRedux.push("/account"))},a.clickDownLoad=function(){var e=document.getElementById("qrid"),t=new Image;t.src=e.toDataURL("image/png");var a=document.getElementById("aId");a.href=t.src,a.download="\u4e8c\u7ef4\u7801.png"},a.handleMortgageNumber=function(e){a.setState({mortgageValue:e.target.value})},a.handleMortgageAll=function(e){var t=a.props.currentUser;a.setState({mortgageValue:wei2USDT(t.erc20.balance-t.erc20.lock_balance)})},a.handleMortgage=function(){var e=a.props,t=e.dispatch,l=e.currentUser,n=a.state.walletType;Number(a.state.mortgageValue)&&0!=a.state.mortgageValue?a.state.mortgageValue>wei2USDT(l.erc20.balance-l.erc20.lock_balance)?o.default.error("\u8d85\u8fc7\u6700\u5927\u91d1\u989d"):t({type:"home/mortgage",payload:{token_id:n,pledge_amount:a.state.mortgageValue}}).then(function(e){1==e.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),t({type:"user/getUserInfo"})):o.default.error(e.msg)}):o.default.error("\u8bf7\u8f93\u5165\u91d1\u989d")},a.changeWallet=function(e){var t=a.props.dispatch;t({type:"user/changeWalletInfo",payload:{walletType:Number(e)-1}}).then(function(t){1==t.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),a.setState({walletType:e})):o.default.error(t.msg)})},a.changeWallet1=function(e){a.setState({walletType:e})},a.firstOnlineLayerClose=function(){a.setState({firstOnlineLayerStatus:!1}),setCookie("firstOnlineLayer","1")},a.firstOnlineLayerSubmit=function(){var e=a.state,t=e.firstBuyStatus,l=e.firstSellStatus;setCookie("firstOnlineLayer","1"),t&&a.toggleManagement("buyStatus",!0),l&&a.toggleManagement("sellStatus",!0)},a.firstOnlineLayerChangeStatus=function(e,t){a.setState((0,p.default)({},e,t))},a.firstOnlineLayer=function(){var e=a.state,t=e.firstBuyStatus,l=e.firstSellStatus;if(!getCookie("firstOnlineLayer"))return x.default.createElement(A.default,{title:"\u627f\u5151\u7ba1\u7406",hiddenVisible:a.firstOnlineLayerClose},x.default.createElement("div",{className:V.default.mortgageLayout},x.default.createElement(i.default,{gutter:24,type:"flex"},x.default.createElement(m.default,{xl:24},x.default.createElement("div",{className:"".concat(V.default.layoutLeft," ").concat(V.default.otherWrap),style:{padding:0,height:"auto"}},x.default.createElement("div",{className:V.default.item},"\u8d2d\u4e70",x.default.createElement("span",{style:{display:"inline-block",width:"10px"}}),x.default.createElement(f.default,{type:t?"primary":"",onClick:function(){return a.firstOnlineLayerChangeStatus("firstBuyStatus",!0)}},"\u4e0a\u7ebf"),x.default.createElement("span",{style:{display:"inline-block",width:"10px"}}),x.default.createElement(f.default,{type:t?"":"primary",onClick:function(){return a.firstOnlineLayerChangeStatus("firstBuyStatus",!1)}},"\u4e0b\u7ebf")),x.default.createElement("div",{className:V.default.item},"\u51fa\u552e",x.default.createElement("span",{style:{display:"inline-block",width:"10px"}}),x.default.createElement(f.default,{type:l?"primary":"",onClick:function(){return a.firstOnlineLayerChangeStatus("firstSellStatus",!0)}},"\u4e0a\u7ebf"),x.default.createElement("span",{style:{display:"inline-block",width:"10px"}}),x.default.createElement(f.default,{type:l?"":"primary",onClick:function(){return a.firstOnlineLayerChangeStatus("firstSellStatus",!1)}},"\u4e0b\u7ebf"))),x.default.createElement("div",{className:V.default.desc,style:{margin:"10px 0"}},"\u6e29\u99a8\u63d0\u793a\uff1a",x.default.createElement("br",null),"\u8bf7\u51c6\u5907\u5145\u8db3\u8d44\u91d1\u540e\u4e0a\u7ebf\uff0c\u5426\u5219\u8ba2\u5355\u5931\u8d25\u5c06\u6709\u964d\u4f4e\u4fe1\u7528\u7684\u60e9\u7f5a"),x.default.createElement("div",{style:{textAlign:"center"}},x.default.createElement(f.default,{type:"primary",style:{width:120},onClick:a.firstOnlineLayerSubmit},"\u786e\u5b9a\u4e0a\u7ebf"),x.default.createElement("span",{style:{display:"inline-block",width:"10px"}}),x.default.createElement(f.default,{style:{width:120},onClick:a.firstOnlineLayerClose},"\u7a0d\u540e\u4e0a\u7ebf"))))))},a}return(0,v.default)(t,e),(0,g.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"user/getUserInfo"}),e({type:"home/fetch"})}},{key:"componentWillUnmount",value:function(){}},{key:"render",value:function(){var e=this,t=this.state,a=t.accountBalance1,l=t.tokenBalance1,n=t.tokenBalance2,o=t.payVisible,p=t.mortgageVisible,y=(t.buyStatus,t.sellStatus,t.mortgageValue),g=t.walletType,E=this.props,h=E.currentUser,v=E.home,b=(E.loading,E.getUserInfoLoading),N=h.id?"1"==g?h.erc20.address:h.omni.address:null,S=h.id?new D.default(wei2USDT(h.erc20.balance)).plus(new D.default(wei2USDT(h.omni.balance,"omni"))).toNumber():0,C=h.id?new D.default(wei2USDT(h.erc20.lock_balance)).plus(new D.default(wei2USDT(h.omni.lock_balance,"omni"))).toNumber():0,L=h.id?"1"==g?h.erc20.confirmations:h.omni.confirmations:null;return x.default.createElement(d.default,{spinning:!!b},x.default.createElement(U.GridContent,null,x.default.createElement(x.Fragment,null,x.default.createElement("div",{className:V.default.wrap},x.default.createElement(i.default,{gutter:24,type:"flex"},x.default.createElement(m.default,{xl:5,md:24,sm:24,xs:24},x.default.createElement("div",{className:"".concat(V.default.layoutLeft," ").concat(V.default.userInfo)},x.default.createElement("div",{className:V.default.avatar},x.default.createElement("img",{src:h.logo_path||DEFAULTAVATAR})),x.default.createElement("div",{className:V.default.user},h.user_name||x.default.createElement(w.default,{to:"/account"},"\u8bbe\u7f6e\u540d\u79f0")," | ",x.default.createElement("span",{style:{color:"#2194FF"}},100*Number(h.success_order_percent),"%"),x.default.createElement("br",null),x.default.createElement("span",{style:{fontSize:12}},h.telephone_number)),x.default.createElement("div",{className:V.default.bottom},x.default.createElement("div",{className:V.default.button},x.default.createElement(w.default,{to:"/account"},"\u8d26\u6237\u7ba1\u7406")),x.default.createElement("div",{className:V.default.time},"\u4e0a\u6b21\u767b\u5f55\uff1a",(0,B.default)(h.login_date).local().format("YYYY-MM-DD HH:mm:ss"))))),x.default.createElement(m.default,{xl:19,md:24,sm:24,xs:24},x.default.createElement("div",{className:"".concat(V.default.layoutRight," ").concat(V.default.messageWrap)},h.real_name_passed?x.default.createElement(i.default,{className:"".concat(V.default.message1," ").concat(V.default.passed),type:"flex",justify:"space-between"},x.default.createElement(m.default,null,"\u60a8\u5df2\u901a\u8fc7\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1")):x.default.createElement(i.default,{className:V.default.message1,type:"flex",justify:"space-between"},x.default.createElement(m.default,null,"\u60a8\u5c1a\u672a\u901a\u8fc7\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1\uff0c",x.default.createElement(w.default,{to:"/account"},"\u53bb\u8ba4\u8bc1>"))),x.default.createElement("div",{className:V.default.message2},x.default.createElement(c.default,{style:{width:"100%",height:205,overflow:"hidden"},autoplay:!0},x.default.createElement("img",{src:R.default,width:"100%",height:"205"}))),x.default.createElement("div",{className:V.default.message3},x.default.createElement(i.default,{style:{height:56,lineHeight:"56px",borderBottom:"1px solid #ECECEC",padding:"0 20px 0 30px"},type:"flex",justify:"space-between"},x.default.createElement(m.default,{style:{fontSize:16}},x.default.createElement("span",{style:{display:"inline-block",width:16,height:16,borderRadius:"50%",background:"#DDDDDD",marginRight:20,verticalAlign:"middle"}}),x.default.createElement("span",{style:{color:"#CF0000"}},"[\u91cd\u8981\u901a\u77e5]"),h.real_name_passed?" \u60a8\u63d0\u4ea4\u7684\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1\uff0c\u5df2\u901a\u8fc7\u5ba1\u6838":" \u60a8\u63d0\u4ea4\u7684\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1\uff0c\u540e\u53f0\u6b63\u5728\u5ba1\u6838\u4e2d")),x.default.createElement(i.default,{type:"flex"},x.default.createElement(m.default,{xl:12,md:12,sm:24,xs:24},x.default.createElement("div",{className:V.default.itemBox},x.default.createElement("div",{className:V.default.title},"\u4ee3\u5e01\u4f59\u989d"),x.default.createElement("div",{className:V.default.item},x.default.createElement("span",{style:{display:"inline-block",width:160}},"\u53ef\u7528\u4f59\u989d\uff08USDT\uff09"),l?x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#2194FF"}},new D.default(S).minus(new D.default(C)).toNumber()):x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#333333"}},"****"),x.default.createElement("span",{style:{cursor:"pointer"},onClick:function(){return e.eyeVisible("tokenBalance1")}},l?x.default.createElement(r.default,{type:"eye-invisible"}):x.default.createElement(r.default,{type:"eye"}))),x.default.createElement("div",{className:V.default.item},x.default.createElement("span",{style:{display:"inline-block",width:160}},"\u51bb\u7ed3\u4f59\u989d\uff08USDT\uff09"),n?x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#2194FF"}},C):x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#333333"}},"****"),x.default.createElement("span",{style:{cursor:"pointer"},onClick:function(){return e.eyeVisible("tokenBalance2")}},n?x.default.createElement(r.default,{type:"eye-invisible"}):x.default.createElement(r.default,{type:"eye"}))),x.default.createElement("div",{className:V.default.but},x.default.createElement("a",{onClick:this.handlePayVisible},"\u5145\u503c"),x.default.createElement(w.default,{to:"/finance/withdrawApply"},"\u63d0\u5e01")))),x.default.createElement(m.default,{xl:12,md:12,sm:24,xs:24},x.default.createElement("div",{className:"".concat(V.default.itemBox," ").concat(V.default.itemBoxBg2),style:{borderLeft:"1px solid #ECECEC"}},x.default.createElement("div",{className:V.default.title},"\u62b5\u62bc\u8d44\u91d1"),x.default.createElement("div",{className:V.default.item},x.default.createElement("span",{style:{display:"inline-block",width:160}},"\u6211\u7684\u6392\u540d"),x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#2194FF"}},h.rank),x.default.createElement("span",{style:{cursor:"pointer",color:"#49a1ff"}},x.default.createElement(u.default,{content:x.default.createElement("div",null,"\u7f34\u7eb3\u66f4\u591a\u62bc\u91d1\uff0c\u53ef\u63d0\u5347\u6392\u540d")},x.default.createElement(r.default,{type:"exclamation-circle"})))),x.default.createElement("div",{className:V.default.item},x.default.createElement("span",{style:{display:"inline-block",width:160}},"\u62b5\u62bc\u8d44\u91d1\uff08USDT\uff09"),a?x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#2194FF"}},h.pledge_amount):x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#333333"}},"****"),x.default.createElement("span",{style:{cursor:"pointer"},onClick:function(){return e.eyeVisible("accountBalance1")}},a?x.default.createElement(r.default,{type:"eye-invisible"}):x.default.createElement(r.default,{type:"eye"}))),x.default.createElement("div",{className:V.default.item},x.default.createElement("span",{style:{display:"inline-block",width:160}},"\u4fe1\u7528\u8bc4\u5206"),x.default.createElement("span",{style:{display:"inline-block",minWidth:100,color:"#2194FF"}},h.credit),x.default.createElement("span",{style:{cursor:"pointer",color:"#49a1ff"}},x.default.createElement(u.default,{content:x.default.createElement("div",null,"\u589e\u52a0\u62b5\u62bc\u8d44\u91d1\u53ef\u63d0\u9ad8\u4fe1\u7528\u8bc4\u5206")},x.default.createElement(r.default,{type:"exclamation-circle"})))),x.default.createElement("div",{className:V.default.but},x.default.createElement("a",{onClick:this.handleMortgageVisible},"\u62b5\u62bc"),x.default.createElement(w.default,{to:"/finance/depositList"},"\u7533\u8bf7\u89e3\u51bb"))))))))),x.default.createElement("div",{style:{height:10}}),x.default.createElement(i.default,{gutter:24,type:"flex",style:{marginTop:24}},x.default.createElement(m.default,{xl:5,md:24,sm:24,xs:24},x.default.createElement("div",{className:"".concat(V.default.layoutLeft," ").concat(V.default.otherWrap)},x.default.createElement("div",{className:V.default.title},"\u627f\u5151\u7ba1\u7406"),x.default.createElement("div",{className:V.default.item},x.default.createElement("p",null,"\u8d2d\u4e70"),x.default.createElement("div",{className:V.default.but},x.default.createElement(f.default,{type:h.buy_online?"primary":"",style:{width:"47%",marginRight:"3%"},onClick:function(){return e.toggleManagement("buyStatus",!0)}},"\u4e0a\u7ebf"),x.default.createElement(f.default,{type:h.buy_online?"":"primary",style:{width:"47%"},onClick:function(){return e.toggleManagement("buyStatus",!1)}},"\u4e0b\u7ebf"))),x.default.createElement("div",{className:V.default.item},x.default.createElement("p",null,"\u51fa\u552e"),x.default.createElement("div",{className:V.default.but},x.default.createElement(f.default,{type:h.sell_online?"primary":"",style:{width:"47%",marginRight:"3%"},onClick:function(){return e.toggleManagement("sellStatus",!0)}},"\u4e0a\u7ebf"),x.default.createElement(f.default,{type:h.sell_online?"":"primary",style:{width:"47%"},onClick:function(){return e.toggleManagement("sellStatus",!1)}},"\u4e0b\u7ebf"))))),x.default.createElement(m.default,{xl:19,md:24,sm:24,xs:24},x.default.createElement("div",{className:"".concat(V.default.layoutLeft," ").concat(V.default.orderWrap)},x.default.createElement("div",{className:V.default.itemBox,style:{borderBottom:"1px solid #ECECEC"}},x.default.createElement("div",{className:V.default.title},"\u5f85\u5904\u7406"),x.default.createElement(i.default,{gutter:24,type:"flex",style:{marginTop:24}},x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u51fa\u552e\u8ba2\u5355\u5f85\u5904\u7406"),x.default.createElement("div",{className:V.default.num},v.sell_order_pending),x.default.createElement("div",{className:V.default.but},x.default.createElement(w.default,{to:"/order/sellOrder"},x.default.createElement(f.default,{type:"primary"},"\u53bb\u5904\u7406"))))),x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u8d2d\u4e70\u8ba2\u5355\u5f85\u5904\u7406"),x.default.createElement("div",{className:V.default.num},v.buy_order_pending),x.default.createElement("div",{className:V.default.but},x.default.createElement(w.default,{to:"/order/buyOrder"},x.default.createElement(f.default,{type:"primary"},"\u53bb\u5904\u7406"))))),x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u51fa\u552e\u5f02\u8bae\u5f85\u5904\u7406"),x.default.createElement("div",{className:V.default.num},v.sell_complaint_order_pending),x.default.createElement("div",{className:V.default.but},x.default.createElement(w.default,{to:"/dissentOrder/sellOrder"},x.default.createElement(f.default,{type:"primary"},"\u53bb\u5904\u7406"))))),x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u8d2d\u4e70\u5f02\u8bae\u5f85\u5904\u7406"),x.default.createElement("div",{className:V.default.num},v.buy_complaint_order_pending),x.default.createElement("div",{className:V.default.but},x.default.createElement(w.default,{to:"/dissentOrder/buyOrder"},x.default.createElement(f.default,{type:"primary"},"\u53bb\u5904\u7406"))))))),x.default.createElement("div",{className:V.default.itemBox},x.default.createElement("div",{className:V.default.title},"\u6536\u76ca"),x.default.createElement(i.default,{gutter:24,type:"flex",style:{marginTop:24}},x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u603b\u6536\u76ca\uff08USDT\uff09"),x.default.createElement("div",{className:V.default.num},v.total_earnings))),x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u603b\u6210\u5355\u91cf\uff08\u7b14\uff09"),x.default.createElement("div",{className:V.default.num},v.total_success_order))),x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u4eca\u65e5\u6536\u76ca\uff08USDT\uff09"),x.default.createElement("div",{className:V.default.num},v.today_earnings))),x.default.createElement(m.default,{xl:6,md:6,sm:12,xs:12},x.default.createElement("div",{className:V.default.item},x.default.createElement("div",{className:V.default.name},"\u4eca\u65e5\u6210\u5355\u91cf\uff08\u7b14\uff09"),x.default.createElement("div",{className:V.default.num},v.today_success_order)))))))))),o&&x.default.createElement(A.default,{title:"\u5145\u503c",hiddenVisible:this.handlePayVisible},x.default.createElement("div",{className:V.default.payLayout},x.default.createElement("div",{style:{margin:"5px 0"}},x.default.createElement("label",{style:{fontSize:16}},"USDT\u5e01\u79cd\uff1a"),x.default.createElement(k.default,{value:g+"",onChange:this.changeWallet1},Object.keys(coinType2).map(function(e,t){if(0!=t)return x.default.createElement(I,{value:e,key:e},coinType2[e])}))),N&&x.default.createElement("div",{style:{textAlign:"center"}},x.default.createElement("div",{className:V.default.ewm},x.default.createElement(O.default,{id:"qrid",value:N,size:220,style:{margin:"0 auto"}})),x.default.createElement(f.default,{type:"primary",style:{width:130}},x.default.createElement("a",{download:!0,id:"aId",onClick:this.clickDownLoad},"\u4fdd\u5b58\u4e8c\u7ef4\u7801")),x.default.createElement("div",{className:V.default.address},N),x.default.createElement(f.default,{type:"primary",style:{width:130},onClick:function(){return e.handleClipBoard(N)}},"\u590d\u5236\u5730\u5740")),x.default.createElement("div",{className:V.default.desc},"\u6e29\u99a8\u63d0\u793a\uff1a",x.default.createElement("br",null),"\u5145\u503cUSDT\u9700\u8981",L,"\u4e2a\u533a\u5757\u786e\u8ba4\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u3002\u6b64\u5730\u5740\u53ea\u63a5\u53d7",1==g?"erc20":"omni","\u534f\u8bae\u7684USDT\uff0c\u8bf7\u52ff\u5f80\u5730\u5740\u5143\u503c\u5176\u4ed6\u534f\u8bae\u7684USDT\u53d1\u9001\u5176\u4ed6\u5e01\u79cd\u5230\u6b64\u5730\u5740\u5c06\u65e0\u6cd5\u627e\u56de\uff0c\u5e73\u53f0\u4e5f\u4e0d\u627f\u62c5\u5e26\u6765\u7684\u635f\u5931\u3002"))),p&&x.default.createElement(A.default,{title:"\u62b5\u62bc",hiddenVisible:this.handleMortgageVisible},x.default.createElement("div",{className:V.default.mortgageLayout},x.default.createElement("div",{style:{textAlign:"center"}},x.default.createElement(i.default,null,x.default.createElement(m.default,{xl:4,md:5,sm:24,xs:24,style:{lineHeight:"32px",fontSize:16,color:"#666666"}},"\u62b5\u62bc\u91d1\u989d\uff1a"),x.default.createElement(m.default,{xl:14,md:13,sm:24,xs:24,style:{marginRight:10}},x.default.createElement(s.default,{placeholder:"\u8bf7\u8f93\u5165\u62b5\u62bc\u91d1\u989d",onChange:this.handleMortgageNumber,value:y})),x.default.createElement(m.default,{xl:5,md:5,sm:24,xs:24},x.default.createElement(f.default,{style:{width:128},onClick:this.handleMortgageAll},"\u5168\u90e8\u62b5\u62bc"))),x.default.createElement(i.default,null,x.default.createElement(m.default,{xl:4,md:5,sm:0,xs:0,style:{lineHeight:"32px",fontSize:16,color:"#666666"}}),x.default.createElement(m.default,{xl:14,md:13,sm:24,xs:24,style:{color:"#333333",textAlign:"left"}},"\u53ef\u7528\u4f59\u989d:",wei2USDT(h.erc20.balance-h.erc20.lock_balance)," USDT"))),x.default.createElement("div",{className:V.default.desc},"\u6e29\u99a8\u63d0\u793a\uff1a",x.default.createElement("br",null),"1.\u5145\u503cUSDT\u9700\u8981",h.erc20.confirmations,"\u4e2a\u533a\u5757\u786e\u8ba4\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u3002 \u6b64\u5730\u5740 \u53ea\u63a5\u53d7erc20\u534f\u8bae\u7684USDT\uff0c\u8bf7\u52ff\u5f80\u5730\u5740\u5143\u503c\u5176\u4ed6\u534f\u8bae\u7684USDT\u53d1\u9001\u5176\u4ed6\u5e01\u79cd\u5230\u6b64",x.default.createElement("br",null),"2.\u5730\u5740\u5c06\u65e0\u6cd5\u627e\u56de\uff0c\u5e73\u53f0\u4e5f\u4e0d\u627f\u62c5\u5e26\u6765\u7684\u635f\u5931\u3002\u5145\u503cUSDT\u9700\u89816\u4e2a\u533a\u5757\u786e\u8ba4\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u3002 \u6b64\u5730\u5740 \u53ea\u63a5\u53d7erc20\u534f\u8bae\u7684USDT\uff0c\u8bf7\u52ff\u5f80\u5730\u5740\u5143\u503c\u5176\u4ed6\u534f\u8bae\u7684USDT\u53d1\u9001\u5176\u4ed6\u5e01\u79cd\u5230\u6b64\u5730\u5740\u5c06\u65e0\u6cd5\u627e\u56de\uff0c\u5e73\u53f0\u4e5f\u4e0d\u627f\u62c5\u5e26\u6765\u7684\u635f\u5931\u3002"),x.default.createElement("div",{style:{textAlign:"center"}},x.default.createElement(f.default,{type:"primary",style:{width:120},onClick:this.handleMortgage},"\u786e\u5b9a\u62b5\u62bc")))),(0,T.getRealNamePassed)()&&this.firstOnlineLayer(),!(0,T.getRealNamePassed)()&&x.default.createElement("div",{className:V.default.passedLayer},"\u7528\u6237\u5fc5\u987b\u901a\u8fc7\u5b9e\u540d\u8ba4\u8bc1\u540e\u65b9\u53ef\u4f7f\u7528\u5e73\u53f0\u7684\u529f\u80fd ",x.default.createElement("span",{onClick:this.checkUserAuth,style:{color:"#EA0000",cursor:"pointer"}},"\u53bb\u8ba4\u8bc1"))))}}]),t}(x.Component),N=S))||N),W=M;t.default=W},ttOL:function(e,t,a){"use strict";var l=a("fbTi"),n=a("mZ4U");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("xjEU");var d=n(a("uiF6")),s=n(a("43Yg")),u=n(a("/tCh")),r=n(a("scpF")),c=n(a("O/V9")),i=n(a("8aBX")),m=l(a("2w0b")),f=(a("XLjY"),a("Dxrh")),o=n(a("Jyqh")),p=function(e){function t(){var e,a;(0,s.default)(this,t);for(var l=arguments.length,n=new Array(l),d=0;d<l;d++)n[d]=arguments[d];return a=(0,r.default)(this,(e=(0,c.default)(t)).call.apply(e,[this].concat(n))),a.state={},a}return(0,i.default)(t,e),(0,u.default)(t,[{key:"componentDidMount",value:function(){var e=document.createElement("div");e.className=o.default.mask,document.body.appendChild(e),document.documentElement.style.overflow="hidden"}},{key:"componentWillUnmount",value:function(){var e=document.getElementsByClassName(o.default.mask)[0];document.body.removeChild(e),document.documentElement.style.overflow="visible"}},{key:"render",value:function(){var e=this,t=this.props,a=t.hiddenVisible,l=t.title,n=t.children,s=this.content&&this.content.clientHeight;return s&&s+50>document.documentElement.clientHeight&&(s=document.documentElement.clientHeight-50),m.default.createElement("div",{className:o.default.wrap},m.default.createElement("div",{className:o.default.title},l,m.default.createElement("a",{className:o.default.close,onClick:a},m.default.createElement(d.default,{type:"close"}))),m.default.createElement("div",{className:o.default.content,style:{height:"80vh"}},m.default.createElement(f.Scrollbars,null,m.default.createElement("div",{ref:function(t){e.content=t}},n))))}}]),t}(m.Component),y=p;t.default=y},wata:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc3Nzk1OUE2MTI0QTExRUFCRjU2RUEyQzAwNUZGOTFGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc3Nzk1OUE3MTI0QTExRUFCRjU2RUEyQzAwNUZGOTFGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Nzc3OTU5QTQxMjRBMTFFQUJGNTZFQTJDMDA1RkY5MUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Nzc3OTU5QTUxMjRBMTFFQUJGNTZFQTJDMDA1RkY5MUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Qu/xHAAABkklEQVR42qyVTStEURjHjdR4SVEKY0UJichCiY0iLBjvO3Y2SnwEn8BKdmp2k1sWimRjoZSNJkQpNsJGE2YhC3P9T/3v7em5516pe+o3p3vOc3733PPyTMJ13ZI4S5n5adkOtJeCSTADBkGK7S/gDDjgCBTloMdVClXpARnQbelrJksgx/paz0QWM6vzEJntxRdgLEzYB7Kg4h9LZmL3QZcWmnpXyfJgEXyKtjcwC96VNOO5POGU5TNrQRUYpdTIhkE9qFGxvWBcCudUgNm9G7AGKsEIZXVghRuhz9uCf2wYLMs9SItjkWddANOcyDFoFWOGpLBBCdvBg3jeYL0VsUEpKbSVgpjhN+sPsYnVKj4pha+gUXTegU7LOu0I4S1oE31PclNO1cAOzs4l68R7/lEy3+EJnRjygiOFB+AqItisT3lEf47Jwl9D83nLvMe2q7cZIftikijqu2zeMs8A2wyTIbK0zDg62xyCAcr/KpegH5wEEqxlPUzmmeCVNAm2iX3PTLB7vCmBdJ+I+y/gV4ABACz0VW+3NlLUAAAAAElFTkSuQmCC"}}]);