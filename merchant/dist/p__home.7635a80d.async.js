(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{Jyqh:function(e,t,a){e.exports={wrap:"antd-pro-components-layer-style-wrap",title:"antd-pro-components-layer-style-title",close:"antd-pro-components-layer-style-close",mask:"antd-pro-components-layer-style-mask"}},LVro:function(e,t,a){e.exports=a.p+"static/apiDoc-v1.0.0.7389e972.docx"},WNL3:function(e,t,a){e.exports=a.p+"static/img_home_banner.1795e48a.png"},dZZS:function(e,t,a){e.exports={wrap:"antd-pro-pages-home-style-wrap",layoutLeft:"antd-pro-pages-home-style-layoutLeft",layoutRight:"antd-pro-pages-home-style-layoutRight",userInfo:"antd-pro-pages-home-style-userInfo",avatar:"antd-pro-pages-home-style-avatar",user:"antd-pro-pages-home-style-user",bottom:"antd-pro-pages-home-style-bottom",button:"antd-pro-pages-home-style-button",messageWrap:"antd-pro-pages-home-style-messageWrap",message1:"antd-pro-pages-home-style-message1",passed:"antd-pro-pages-home-style-passed",message1error:"antd-pro-pages-home-style-message1error",message2:"antd-pro-pages-home-style-message2",message3:"antd-pro-pages-home-style-message3",itemBox:"antd-pro-pages-home-style-itemBox",title:"antd-pro-pages-home-style-title",item:"antd-pro-pages-home-style-item",but:"antd-pro-pages-home-style-but",itemBoxBg2:"antd-pro-pages-home-style-itemBoxBg2",otherWrap:"antd-pro-pages-home-style-otherWrap",orderWrap:"antd-pro-pages-home-style-orderWrap",name:"antd-pro-pages-home-style-name",num:"antd-pro-pages-home-style-num",payLayout:"antd-pro-pages-home-style-payLayout",ewm:"antd-pro-pages-home-style-ewm",address:"antd-pro-pages-home-style-address",desc:"antd-pro-pages-home-style-desc",withdrawApplyLayout:"antd-pro-pages-home-style-withdrawApplyLayout",passedLayer:"antd-pro-pages-home-style-passedLayer"}},lggp:function(e,t,a){"use strict";var l=a("g09b"),d=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("5NDa");var n=l(a("5rEg"));a("+L6B");var s=l(a("2/Rp"));a("Pwec");var r=l(a("CtXQ"));a("fV52");var u=l(a("3I+P"));a("14J3");var c=l(a("BMrR"));a("jCWc");var i=l(a("kPKH"));a("miYZ");var m=l(a("tsqr")),o=l(a("eHn4")),f=l(a("2Taf")),p=l(a("vZ4D")),y=l(a("l4Ni")),h=l(a("ujKo")),E=l(a("MhPg"));a("OaEy");var g,v,w,A=l(a("2fM7")),b=d(a("q1tI")),N=l(a("wY1l")),x=a("Hx5s"),k=a("Hg0r"),T=l(a("ttOL")),S=l(a("+QRC")),U=a("+n12"),C=l(a("wd/R")),B=l(a("D1Df")),D=l(a("kB5k")),W=l(a("dZZS")),R=l(a("WNL3")),I=(l(a("wata")),l(a("LVro"))),L=A.default.Option,V=(g=(0,k.connect)(function(e){var t=e.user,a=e.home,l=e.loading;return{currentUser:t.currentUser,home:a,loading:l.effects["home/fetch"]}}),g((w=function(e){function t(){var e,a;(0,f.default)(this,t);for(var l=arguments.length,d=new Array(l),n=0;n<l;n++)d[n]=arguments[n];return a=(0,y.default)(this,(e=(0,h.default)(t)).call.apply(e,[this].concat(d))),a.state={tokenBalance1:g_getLocalStorage("tokenBalance1")||!1,tokenBalance2:g_getLocalStorage("tokenBalance2")||!1,tokenBalance3:g_getLocalStorage("tokenBalance3")||!1,tokenBalance4:g_getLocalStorage("tokenBalance4")||!1,payVisible:!1,withdrawApplyVisible:!1,walletType:1},a.interval=void 0,a.eyeVisible=function(e){(0,U.getRealNamePassed)()&&(a.setState((0,o.default)({},e,!a.state[e])),g_setLocalStorage(!a.state[e],e))},a.handlePayVisible=function(e){(0,U.getRealNamePassed)()&&a.setState({payType:e,payVisible:!a.state.payVisible,walletType:1})},a.handleWithdrawApplyVisible=function(e){(0,U.getRealNamePassed)()&&(a.setState({withdrawApplyType:e,withdrawApplyVisible:!a.state.withdrawApplyVisible,walletType:1}),clearInterval(a.interval))},a.handleClipBoard=function(e){(0,S.default)(e)?m.default.success("\u590d\u5236\u6210\u529f"):m.default.error("\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5")},a.checkUserAuth=function(){var e=a.props.dispatch;(0,U.getRealNamePassed)()||e(k.routerRedux.push("/account"))},a.clickDownLoad=function(){var e=document.getElementById("qrid"),t=new Image;t.src=e.toDataURL("image/png");var a=document.getElementById("aId");a.href=t.src,a.download="\u4e8c\u7ef4\u7801.png"},a.handleWithdrawApplyAddress=function(e){a.setState({withdrawApplyAddress:e.target.value})},a.handleWithdrawApplyNumber=function(e){a.setState({withdrawApplyValue:e.target.value})},a.handleWithdrawApplyAll=function(e){a.setState({withdrawApplyValue:wei2USDT(e)})},a.handleWithdrawApplyCaptcha=function(e){a.setState({withdrawApplyCaptcha:e.target.value})},a.onGetCaptcha=function(){var e=a.props.dispatch;e({type:"home/getCode"}).then(function(e){if(1==e.status){var t=59;a.setState({count:t}),a.interval=window.setInterval(function(){t-=1,a.setState({count:t}),0===t&&clearInterval(a.interval)},1e3)}else m.default.error("\u77ed\u4fe1\u9a8c\u8bc1\u7801\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01")})},a.handleWithdrawApply=function(e){var t=a.props,l=t.dispatch,d=t.currentUser,n=a.state,s=n.withdrawApplyType,r=n.withdrawApplyValue,u=n.withdrawApplyAddress,c=n.withdrawApplyCaptcha,i=n.walletType;if(r&&0!=r&&u&&c)if(r<=0)m.default.error("\u91d1\u989d\u4e0d\u80fd\u5c0f\u4e8e0");else{var o=new D.default(r),f=new D.default(d.gas);if(o.plus(f).toNumber()>wei2USDT(e))m.default.error("\u8d85\u8fc7\u6700\u5927\u91d1\u989d");else{a.setState({withdrawApplyStatus:!0});var p="erc20"==s?"home/withdrawApplyErc20":"home/withdrawApplyOmni";l({type:p,payload:{coin_number:r,to_address:u,telephone_verify_code:c,token_id:i}}).then(function(e){a.setState({withdrawApplyStatus:!1}),1==e.status?(m.default.success("\u64cd\u4f5c\u6210\u529f"),l({type:"user/getUserInfo"})):m.default.error(e.msg)})}}else m.default.error("\u8bf7\u586b\u5199\u5b8c\u6574\u4fe1\u606f\u540e\u63d0\u4ea4")},a.changeWallet=function(e){var t=a.props.dispatch;t({type:"user/changeWalletInfo",payload:{walletType:Number(e)-1}}).then(function(t){1==t.status?(m.default.success("\u64cd\u4f5c\u6210\u529f"),a.setState({walletType:e})):m.default.error(t.msg)})},a.changeWallet1=function(e){a.setState({walletType:e})},a}return(0,E.default)(t,e),(0,p.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.dispatch;e({type:"home/fetch"})}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"render",value:function(){var e=this,t=this.state,a=t.tokenBalance1,l=t.tokenBalance2,d=(t.tokenBalance3,t.tokenBalance4,t.payVisible),m=t.withdrawApplyVisible,o=t.withdrawApplyValue,f=(t.withdrawApplyType,t.withdrawApplyCaptcha),p=t.withdrawApplyAddress,y=t.count,h=t.walletType,E=(t.payType,t.withdrawApplyStatus),g=this.props,v=g.currentUser,w=g.home,k=(g.loading,v.id?"1"==h?v.erc20.address:v.omni.address:null);return b.default.createElement(x.GridContent,null,b.default.createElement(b.Fragment,null,b.default.createElement("div",{className:W.default.wrap},b.default.createElement(c.default,{gutter:24,type:"flex"},b.default.createElement(i.default,{xl:5,md:24,sm:24,xs:24},b.default.createElement("div",{className:"".concat(W.default.layoutLeft," ").concat(W.default.userInfo)},b.default.createElement("div",{className:W.default.avatar},b.default.createElement("img",{src:v.logo_path||DEFAULTAVATAR})),b.default.createElement("div",{className:W.default.user},v.user_name||b.default.createElement(N.default,{to:"/account"},"\u8bbe\u7f6e\u540d\u79f0"),b.default.createElement("br",null),b.default.createElement("span",{style:{fontSize:12}},v.telephone_number)),b.default.createElement("div",{className:W.default.bottom},b.default.createElement("div",{className:W.default.button},b.default.createElement(N.default,{to:"/account"},"\u8d26\u6237\u7ba1\u7406")),b.default.createElement("div",{className:W.default.time},"\u4e0a\u6b21\u767b\u5f55\uff1a",(0,C.default)(v.login_date).local().format("YYYY-MM-DD HH:mm:ss"))))),b.default.createElement(i.default,{xl:19,md:24,sm:24,xs:24},b.default.createElement("div",{className:"".concat(W.default.layoutRight," ").concat(W.default.messageWrap)},v.real_name_passed?b.default.createElement(c.default,{className:"".concat(W.default.message1," ").concat(W.default.passed),type:"flex",justify:"space-between"},b.default.createElement(i.default,null,"\u60a8\u5df2\u901a\u8fc7\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1")):b.default.createElement(c.default,{className:W.default.message1,type:"flex",justify:"space-between"},b.default.createElement(i.default,null,"\u60a8\u5c1a\u672a\u901a\u8fc7\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1\uff0c",b.default.createElement(N.default,{to:"/account"},"\u53bb\u8ba4\u8bc1>"))),b.default.createElement("div",{className:W.default.message2},b.default.createElement(u.default,{style:{width:"100%",height:205,overflow:"hidden"},autoplay:!0},b.default.createElement("img",{src:R.default,width:"100%",height:"205"}))),b.default.createElement("div",{className:W.default.message3},b.default.createElement(c.default,{style:{height:56,lineHeight:"56px",borderBottom:"1px solid #ECECEC",padding:"0 20px 0 30px"},type:"flex",justify:"space-between"},b.default.createElement(i.default,{style:{fontSize:16}},b.default.createElement("span",{style:{display:"inline-block",width:16,height:16,borderRadius:"50%",background:"#DDDDDD",marginRight:20,verticalAlign:"middle"}}),b.default.createElement("span",{style:{color:"#CF0000"}},"[\u91cd\u8981\u901a\u77e5]"),v.real_name_passed?" \u60a8\u63d0\u4ea4\u7684\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1\uff0c\u5df2\u901a\u8fc7\u5ba1\u6838":" \u60a8\u63d0\u4ea4\u7684\u652f\u4ed8\u94fe\u5546\u5bb6\u8ba4\u8bc1\uff0c\u540e\u53f0\u6b63\u5728\u5ba1\u6838\u4e2d")),b.default.createElement(c.default,{type:"flex"},b.default.createElement(i.default,{xl:12,md:12,sm:24,xs:24},b.default.createElement("div",{className:W.default.itemBox},b.default.createElement("div",{className:W.default.title},"USDT\u4ee3\u5e01\u4f59\u989d"),b.default.createElement("div",{className:W.default.item},b.default.createElement("span",{style:{display:"inline-block",width:160}},"\u53ef\u7528\u4f59\u989d\uff08USDT\uff09"),a?b.default.createElement("span",{style:{display:"inline-block",minWidth:50,color:"#2194FF",textAlign:"center"}},wei2USDT(v.all_balance)):b.default.createElement("span",{style:{display:"inline-block",minWidth:50,color:"#333333",textAlign:"center"}},"****"),b.default.createElement("span",{style:{padding:"0 5px"}},"\u2248"),a?b.default.createElement("span",{style:{display:"inline-block",minWidth:50,textAlign:"center"}},(wei2USDT(v.all_balance)*v.token_price*v.rate).toFixed(2)):b.default.createElement("span",{style:{display:"inline-block",minWidth:50,textAlign:"center"}},"****"),"CNY",b.default.createElement("span",{style:{cursor:"pointer",marginLeft:5},onClick:function(){return e.eyeVisible("tokenBalance1")}},a?b.default.createElement(r.default,{type:"eye-invisible"}):b.default.createElement(r.default,{type:"eye"}))),b.default.createElement("div",{className:W.default.item},b.default.createElement("span",{style:{display:"inline-block",width:160}},"\u4e0d\u53ef\u7528\u4f59\u989d\uff08USDT\uff09"),l?b.default.createElement("span",{style:{display:"inline-block",minWidth:50,color:"#2194FF",textAlign:"center"}},wei2USDT(v.all_lock_balance)):b.default.createElement("span",{style:{display:"inline-block",minWidth:50,color:"#333333",textAlign:"center"}},"****"),b.default.createElement("span",{style:{padding:"0 5px"}},"\u2248"),l?b.default.createElement("span",{style:{display:"inline-block",minWidth:50,textAlign:"center"}},(wei2USDT(v.all_lock_balance)*v.token_price*v.rate).toFixed(2)):b.default.createElement("span",{style:{display:"inline-block",minWidth:50,textAlign:"center"}},"****"),"CNY",b.default.createElement("span",{style:{cursor:"pointer",marginLeft:5},onClick:function(){return e.eyeVisible("tokenBalance2")}},l?b.default.createElement(r.default,{type:"eye-invisible"}):b.default.createElement(r.default,{type:"eye"}))),b.default.createElement("div",{className:W.default.but},b.default.createElement("a",{onClick:function(){return e.handlePayVisible("erc20")}},"\u5145\u503c"),b.default.createElement("a",{onClick:function(){return e.handleWithdrawApplyVisible("erc20")}},"\u63d0\u5e01"),b.default.createElement(N.default,{to:"/yield/yieldErc20"},"\u51fa\u91d1"),b.default.createElement(N.default,{to:"/entry/entryErc20"},"\u5165\u91d1"))))))))),b.default.createElement("div",{style:{height:10}}),b.default.createElement(c.default,{gutter:24,type:"flex",style:{marginTop:24}},b.default.createElement(i.default,{xl:5,md:24,sm:24,xs:24},b.default.createElement("div",{className:"".concat(W.default.layoutLeft," ").concat(W.default.otherWrap)},b.default.createElement("div",{className:W.default.title},"\u8bf4\u660e\u6587\u6863"),b.default.createElement("div",{className:W.default.item},b.default.createElement(s.default,{type:"primary",style:{width:"100%"},download:!0,target:"_blank",href:I.default},"\u63a5\u53e3\u6587\u6863")))),b.default.createElement(i.default,{xl:19,md:24,sm:24,xs:24},b.default.createElement("div",{className:"".concat(W.default.layoutLeft," ").concat(W.default.orderWrap)},b.default.createElement("div",{className:W.default.itemBox,style:{borderBottom:"1px solid #ECECEC"}},b.default.createElement("div",{className:W.default.title},"\u5f85\u5904\u7406"),b.default.createElement(c.default,{gutter:24,type:"flex",style:{marginTop:24}},b.default.createElement(i.default,{xl:8,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u51fa\u91d1\u5f85\u5904\u7406"),b.default.createElement("div",{className:W.default.num},w.buy_order_pending),b.default.createElement("div",{className:W.default.but},b.default.createElement(N.default,{to:"/order/goldYieldOrder"},b.default.createElement(s.default,{type:"primary"},"\u53bb\u5904\u7406"))))),b.default.createElement(i.default,{xl:8,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u51fa\u91d1\u7533\u8bc9\u5f85\u5904\u7406"),b.default.createElement("div",{className:W.default.num},w.buy_complaint_order_pending),b.default.createElement("div",{className:W.default.but},b.default.createElement(N.default,{to:"/dissentOrder/goldYieldOrder"},b.default.createElement(s.default,{type:"primary"},"\u53bb\u5904\u7406"))))),b.default.createElement(i.default,{xl:8,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u5165\u91d1\u7533\u8bc9\u5f85\u5904\u7406"),b.default.createElement("div",{className:W.default.num},w.sell_complaint_order_pending),b.default.createElement("div",{className:W.default.but},b.default.createElement(N.default,{to:"/dissentOrder/goldEntryOrder"},b.default.createElement(s.default,{type:"primary"},"\u53bb\u5904\u7406"))))))),b.default.createElement("div",{className:W.default.itemBox},b.default.createElement("div",{className:W.default.title},"\u4ea4\u6613\u6570\u636e"),b.default.createElement(c.default,{gutter:24,type:"flex",style:{marginTop:24}},b.default.createElement(i.default,{xl:4,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u603b\u51fa\u91d1\uff08USDT\uff09"),b.default.createElement("div",{className:W.default.num},w.total_gold_yield))),b.default.createElement(i.default,{xl:4,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u603b\u5165\u91d1\uff08USDT\uff09"),b.default.createElement("div",{className:W.default.num},w.total_deposit))),b.default.createElement(i.default,{xl:4,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u603b\u63d0\u5e01\uff08USDT\uff09"),b.default.createElement("div",{className:W.default.num},wei2USDT(w.total_cash_out)))),b.default.createElement(i.default,{xl:4,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u4eca\u65e5\u51fa\u91d1\uff08USDT\uff09"),b.default.createElement("div",{className:W.default.num},w.today_gold_yield))),b.default.createElement(i.default,{xl:4,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u4eca\u65e5\u5165\u91d1\uff08USDT\uff09"),b.default.createElement("div",{className:W.default.num},w.today_deposit))),b.default.createElement(i.default,{xl:4,md:8,sm:12,xs:12},b.default.createElement("div",{className:W.default.item},b.default.createElement("div",{className:W.default.name},"\u4eca\u65e5\u63d0\u5e01\uff08USDT\uff09"),b.default.createElement("div",{className:W.default.num},wei2USDT(w.today_cash_out))))))))))),d&&b.default.createElement(T.default,{title:"\u5145\u503c",hiddenVisible:this.handlePayVisible},b.default.createElement("div",{className:W.default.payLayout},b.default.createElement("div",{style:{margin:"5px 0"}},b.default.createElement("label",{style:{fontSize:16}},"USDT\u5e01\u79cd\uff1a"),b.default.createElement(A.default,{value:h+"",onChange:this.changeWallet1},Object.keys(coinType2).map(function(e,t){if(0!=t)return b.default.createElement(L,{value:e,key:e},coinType2[e])}))),k&&b.default.createElement("div",{style:{textAlign:"center"}},b.default.createElement("div",{className:W.default.ewm},b.default.createElement(B.default,{id:"qrid",value:k,size:220,style:{margin:"0 auto"}})),b.default.createElement(s.default,{type:"primary",style:{width:130}},b.default.createElement("a",{download:!0,id:"aId",onClick:this.clickDownLoad},"\u4fdd\u5b58\u4e8c\u7ef4\u7801")),b.default.createElement("div",{className:W.default.address},k),b.default.createElement(s.default,{type:"primary",style:{width:130},onClick:function(){return e.handleClipBoard(k)}},"\u590d\u5236\u5730\u5740")),b.default.createElement("div",{className:W.default.desc},"\u6e29\u99a8\u63d0\u793a\uff1a",b.default.createElement("br",null),"\u5145\u503cUSDT\u9700\u89816\u4e2a\u533a\u5757\u786e\u8ba4\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85\u3002\u6b64\u5730\u5740\u53ea\u63a5\u53d7",1==h?"erc20":"omni","\u534f\u8bae\u7684USDT\uff0c\u8bf7\u52ff\u5f80\u5730\u5740\u5143\u503c\u5176\u4ed6\u534f\u8bae\u7684USDT\u53d1\u9001\u5176\u4ed6\u5e01\u79cd\u5230\u6b64\u5730\u5740\u5c06\u65e0\u6cd5\u627e\u56de\uff0c\u5e73\u53f0\u4e5f\u4e0d\u627f\u62c5\u5e26\u6765\u7684\u635f\u5931\u3002"))),m&&b.default.createElement(T.default,{title:"\u63d0\u5e01",hiddenVisible:this.handleWithdrawApplyVisible},b.default.createElement("div",{className:W.default.withdrawApplyLayout},b.default.createElement("div",{style:{textAlign:"center"}},b.default.createElement(c.default,null,b.default.createElement(i.default,{xl:4,md:5,sm:24,xs:24,style:{marginBottom:40}},"USDT\u5e01\u79cd\uff1a"),b.default.createElement(i.default,{xl:14,md:13,sm:24,xs:24,style:{marginRight:10}},b.default.createElement(A.default,{value:h+"",onChange:this.changeWallet1,style:{width:"100%"}},Object.keys(coinType2).map(function(e,t){if(0!=t)return b.default.createElement(L,{value:e,key:e},coinType2[e])})))),b.default.createElement(c.default,null,b.default.createElement(i.default,{xl:4,md:5,sm:24,xs:24,style:{marginBottom:40}},"\u63d0\u5e01\u5730\u5740\uff1a"),b.default.createElement(i.default,{xl:14,md:13,sm:24,xs:24,style:{marginRight:10}},b.default.createElement(n.default,{placeholder:"\u8f93\u5165\u63d0\u5e01\u5730\u5740",onChange:this.handleWithdrawApplyAddress,value:p}))),b.default.createElement(c.default,null,b.default.createElement(i.default,{xl:4,md:5,sm:24,xs:24,style:{marginBottom:10}},"\u63d0\u5e01\u6570\u91cf\uff1a"),b.default.createElement(i.default,{xl:14,md:13,sm:24,xs:24,style:{marginRight:10}},b.default.createElement(n.default,{placeholder:"\u8f93\u5165\u63d0\u5e01\u6570\u91cf",onChange:this.handleWithdrawApplyNumber,value:o})),b.default.createElement(i.default,{xl:5,md:5,sm:24,xs:24},b.default.createElement(s.default,{style:{width:128},onClick:function(){return e.handleWithdrawApplyAll(v.all_balance)}},"\u5168\u90e8"))),b.default.createElement(c.default,{style:{marginBottom:40}},b.default.createElement(i.default,{xl:4,md:5,sm:0,xs:0,style:{lineHeight:"32px",fontSize:16,color:"#666666"}}),b.default.createElement(i.default,{xl:14,md:13,sm:24,xs:24,style:{color:"#333333",textAlign:"left"}},b.default.createElement("span",{style:{paddingRight:10}},"\u624b\u7eed\u8d39:",v.gas," USDT"),b.default.createElement("span",null,"\u53ef\u7528\u4f59\u989d:",wei2USDT(v.all_balance)," USDT"))),b.default.createElement(c.default,null,b.default.createElement(i.default,{xl:4,md:5,sm:24,xs:24,style:{lineHeight:"32px",fontSize:16,color:"#666666"}},"\u77ed\u4fe1\u9a8c\u8bc1\u7801\uff1a"),b.default.createElement(i.default,{xl:14,md:13,sm:24,xs:24,style:{marginRight:10}},b.default.createElement(n.default,{placeholder:"\u8f93\u5165\u77ed\u4fe1\u9a8c\u8bc1\u7801",maxLength:6,onChange:this.handleWithdrawApplyCaptcha,value:f})),b.default.createElement(i.default,{xl:5,md:5,sm:24,xs:24},b.default.createElement(s.default,{disabled:!!y,onClick:this.onGetCaptcha,style:{width:128,display:"inline-block"}},y?"".concat(y," s"):"\u83b7\u53d6\u624b\u673a\u9a8c\u8bc1\u7801")))),b.default.createElement("div",{className:W.default.desc},"\u6e29\u99a8\u63d0\u793a\uff1a",b.default.createElement("br",null),"1.\u63d0\u5e01\u6240\u9700\u624b\u7eed\u8d39\uff0c\u624b\u7eed\u8d39\u4e3a\u6240\u63d0\u6570\u91cf\u7684\u5343\u5206\u4e4b\u516d\uff1b",b.default.createElement("br",null),"2.\u8bf7\u52a1\u5fc5\u786e\u4fdd\u63d0\u5e01\u5730\u5740\u7684\u6b63\u786e\u6027\uff0c\u82e5\u7531\u4e8e\u5730\u5740\u586b\u5199\u9519\u8bef\u5bfc\u81f4\u8d44\u91d1\u4e22\u5931\uff0c\u4e0d\u5c5e\u4e8e\u5e73\u53f0\u8d23\u4efb\u3002"),b.default.createElement("div",{style:{textAlign:"center"}},b.default.createElement(s.default,{loading:E,type:"primary",style:{width:120},onClick:function(){return e.handleWithdrawApply(v.all_balance)}},"\u786e\u5b9a")))),!(0,U.getRealNamePassed)()&&b.default.createElement("div",{className:W.default.passedLayer},"\u7528\u6237\u5fc5\u987b\u901a\u8fc7\u5b9e\u540d\u8ba4\u8bc1\u540e\u65b9\u53ef\u4f7f\u7528\u5e73\u53f0\u7684\u529f\u80fd ",b.default.createElement("span",{onClick:this.checkUserAuth,style:{color:"#EA0000",cursor:"pointer"}},"\u53bb\u8ba4\u8bc1")))}}]),t}(b.Component),v=w))||v),_=V;t.default=_},ttOL:function(e,t,a){"use strict";var l=a("tAuX"),d=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("Pwec");var n=d(a("CtXQ")),s=d(a("2Taf")),r=d(a("vZ4D")),u=d(a("l4Ni")),c=d(a("ujKo")),i=d(a("MhPg")),m=l(a("q1tI")),o=(a("Hg0r"),a("k82f")),f=d(a("Jyqh")),p=function(e){function t(){var e,a;(0,s.default)(this,t);for(var l=arguments.length,d=new Array(l),n=0;n<l;n++)d[n]=arguments[n];return a=(0,u.default)(this,(e=(0,c.default)(t)).call.apply(e,[this].concat(d))),a.state={},a}return(0,i.default)(t,e),(0,r.default)(t,[{key:"componentDidMount",value:function(){var e=document.createElement("div");e.className=f.default.mask,document.body.appendChild(e),document.documentElement.style.overflow="hidden"}},{key:"componentWillUnmount",value:function(){var e=document.getElementsByClassName(f.default.mask)[0];document.body.removeChild(e),document.documentElement.style.overflow="visible"}},{key:"render",value:function(){var e=this,t=this.props,a=t.hiddenVisible,l=t.title,d=t.children,s=this.content&&this.content.clientHeight;return s&&s+50>document.documentElement.clientHeight&&(s=document.documentElement.clientHeight-50),m.default.createElement("div",{className:f.default.wrap},m.default.createElement("div",{className:f.default.title},l,m.default.createElement("a",{className:f.default.close,onClick:a},m.default.createElement(n.default,{type:"close"}))),m.default.createElement("div",{className:f.default.content,style:{height:s}},m.default.createElement(o.Scrollbars,null,m.default.createElement("div",{ref:function(t){e.content=t}},d))))}}]),t}(m.Component),y=p;t.default=y},wata:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc3Nzk1OUE2MTI0QTExRUFCRjU2RUEyQzAwNUZGOTFGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc3Nzk1OUE3MTI0QTExRUFCRjU2RUEyQzAwNUZGOTFGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Nzc3OTU5QTQxMjRBMTFFQUJGNTZFQTJDMDA1RkY5MUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Nzc3OTU5QTUxMjRBMTFFQUJGNTZFQTJDMDA1RkY5MUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Qu/xHAAABkklEQVR42qyVTStEURjHjdR4SVEKY0UJichCiY0iLBjvO3Y2SnwEn8BKdmp2k1sWimRjoZSNJkQpNsJGE2YhC3P9T/3v7em5516pe+o3p3vOc3733PPyTMJ13ZI4S5n5adkOtJeCSTADBkGK7S/gDDjgCBTloMdVClXpARnQbelrJksgx/paz0QWM6vzEJntxRdgLEzYB7Kg4h9LZmL3QZcWmnpXyfJgEXyKtjcwC96VNOO5POGU5TNrQRUYpdTIhkE9qFGxvWBcCudUgNm9G7AGKsEIZXVghRuhz9uCf2wYLMs9SItjkWddANOcyDFoFWOGpLBBCdvBg3jeYL0VsUEpKbSVgpjhN+sPsYnVKj4pha+gUXTegU7LOu0I4S1oE31PclNO1cAOzs4l68R7/lEy3+EJnRjygiOFB+AqItisT3lEf47Jwl9D83nLvMe2q7cZIftikijqu2zeMs8A2wyTIbK0zDg62xyCAcr/KpegH5wEEqxlPUzmmeCVNAm2iX3PTLB7vCmBdJ+I+y/gV4ABACz0VW+3NlLUAAAAAElFTkSuQmCC"}}]);