(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[28],{"3z5J":function(e,t,a){e.exports={main:"antd-pro-pages-user-forget-style-main",stepWrap:"antd-pro-pages-user-forget-style-stepWrap",stepOn:"antd-pro-pages-user-forget-style-stepOn",cardContainer:"antd-pro-pages-user-forget-style-cardContainer",tabs:"antd-pro-pages-user-forget-style-tabs",button:"antd-pro-pages-user-forget-style-button",on:"antd-pro-pages-user-forget-style-on",tabBox:"antd-pro-pages-user-forget-style-tabBox",phoneSuccessImg:"antd-pro-pages-user-forget-style-phoneSuccessImg",getCaptcha:"antd-pro-pages-user-forget-style-getCaptcha",submit:"antd-pro-pages-user-forget-style-submit",login:"antd-pro-pages-user-forget-style-login",error:"antd-pro-pages-user-forget-style-error",success:"antd-pro-pages-user-forget-style-success",warning:"antd-pro-pages-user-forget-style-warning","progress-pass":"antd-pro-pages-user-forget-style-progress-pass",progress:"antd-pro-pages-user-forget-style-progress"}},V0NG:function(e,t,a){"use strict";var l=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=l(a("jehZ"));a("+L6B");var n=l(a("2/Rp")),u=l(a("p0pE"));a("miYZ");var o=l(a("tsqr")),d=l(a("2Taf")),c=l(a("vZ4D")),i=l(a("l4Ni")),p=l(a("ujKo")),f=l(a("MhPg"));a("5NDa");var m=l(a("5rEg"));a("OaEy");var g=l(a("2fM7"));a("y8nQ");var h=l(a("Vl3Y"));a("FJo9");var y=l(a("L41K"));a("Znn+");var v,E,b,w=l(a("ZTPi")),C=r(a("q1tI")),N=l(a("wY1l")),x=a("Hg0r"),S=(l(a("3a4m")),l(a("3z5J"))),F=l(a("qotY")),k=(w.default.TabPane,y.default.Step),P=h.default.Item,z=(g.default.Option,m.default.Group),_=(C.default.createElement("div",{className:S.default.success},"\u5f3a\u5ea6\uff1a\u5f3a"),C.default.createElement("div",{className:S.default.warning},"\u5f3a\u5ea6\uff1a\u4e2d"),C.default.createElement("div",{className:S.default.error},"\u5f3a\u5ea6\uff1a\u592a\u77ed"),v=(0,x.connect)(function(e){var t=e.userForget,a=e.loading;return{userForget:t,submitting:a.effects["userForget/submit"]}}),v((b=function(e){function t(){var e,a;(0,d.default)(this,t);for(var l=arguments.length,r=new Array(l),c=0;c<l;c++)r[c]=arguments[c];return a=(0,i.default)(this,(e=(0,p.default)(t)).call.apply(e,[this].concat(r))),a.state={count:0,stepCurrent:0,tabType:"phone",params:{country:"china",prefix:"86"}},a.interval=void 0,a.handleTab=function(e){var t=a.props.form;t.resetFields(),clearInterval(a.interval);var l={country:"china",prefix:"86"};a.setState({tabType:e,params:l,count:null,stepCurrent:0})},a.onGetCaptcha=function(){var e=a.props.dispatch,t=a.state,l=t.params,r=t.tabType,s="";if("phone"==r){if(s="userForget/getPhoneCode",!l.phone||!regPhone(l.phone))return void o.default.error("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\uff01")}else if(s="userForget/getEmailCode",!l.email||!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(l.email))return void o.default.error("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u90ae\u7bb1\u5730\u5740\uff01");e({type:s,payload:"phone"==r?{telephone_number:l.phone}:{email_address:l.email}}).then(function(e){if(1==e.status){o.default.success("\u64cd\u4f5c\u6210\u529f");var t=59;a.setState({count:t}),a.interval=window.setInterval(function(){t-=1,a.setState({count:t}),0===t&&clearInterval(a.interval)},1e3)}else o.default.error(e.msg)})},a.hanldeCaptcha=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{code:e.target.value})})},a.checkPassword=function(e,t,l){if(t.length<6||t.length>8)l("\u8bf7\u8f93\u51656\u4f4d~8\u4f4d\u4e4b\u95f4\u7684\u5bc6\u7801");else{var r=a.props.form;t&&r.validateFields(["confirm"],{force:!0}),l()}},a.checkConfirm=function(e,t,l){var r=a.props.form;t&&t!==r.getFieldValue("password")?l("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u5339\u914d!"):l()},a.changePrefix=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{prefix:e})})},a.hanldePhone=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{phone:e.target.value})})},a.nextPhoneStep2=function(){var e=a.props.dispatch,t=a.state.params;t.code?e({type:"userForget/nextPhoneStep2",payload:{telephone_number:t.phone,telephone_verify_code:t.code}}).then(function(e){1==e.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),clearInterval(a.interval),a.setState({stepCurrent:1,params:(0,u.default)({},t,{code:t.code})})):o.default.error(e.msg)}):o.default.error("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801")},a.subPhoneRegister=function(){var e=a.props,t=e.form,l=e.dispatch;t.validateFields({force:!0},function(e,t){if(!e){var r=a.state.params;l({type:"userForget/phoneSubmit",payload:{telephone_number:r.phone,login_pwd:t.password}}).then(function(e){1==e.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),a.setState({stepCurrent:2})):o.default.error(e.msg)})}})},a.phoneRenderFrom=function(){var e=a.props,t=e.form,l=e.submitting,r=t.getFieldDecorator,u={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},o=a.state,d=o.stepCurrent,c=(o.params,o.count),i="";return 0==d?i=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(P,{label:"\u624b\u673a\u53f7\u7801"},C.default.createElement(z,{compact:!0},r("mobile",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u624b\u673a\u53f7\uff01"},{pattern:/^1\d{10}$/,message:"\u624b\u673a\u53f7\u683c\u5f0f\u9519\u8bef\uff01"}]})(C.default.createElement(m.default,{size:"large",style:{width:560},maxLength:11,placeholder:"\u624b\u673a\u53f7",onKeyUp:a.hanldePhone})))),C.default.createElement(P,{label:"\u77ed\u4fe1\u9a8c\u8bc1\u7801"},r("captcha",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\uff01"}]})(C.default.createElement(m.default,{size:"large",style:{width:156},maxLength:6,placeholder:"\u9a8c\u8bc1\u7801",onKeyUp:a.hanldeCaptcha})),C.default.createElement(n.default,{size:"large",disabled:!!c,className:S.default.getCaptcha,onClick:a.onGetCaptcha,style:{width:140,display:"inline-block",marginLeft:20}},c?"".concat(c," s"):"\u83b7\u53d6\u9a8c\u8bc1\u7801")),C.default.createElement(P,null,C.default.createElement(n.default,{size:"large",loading:l,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.nextPhoneStep2},"\u4e0b\u4e00\u6b65"))):1==d?i=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(P,{label:"\u8bbe\u7f6e\u5bc6\u7801"},r("password",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801\uff01"},{validator:a.checkPassword}]})(C.default.createElement(m.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u8bbe\u7f6e\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(P,{label:"\u786e\u8ba4\u5bc6\u7801"},r("confirm",{rules:[{required:!0,message:"\u8bf7\u786e\u8ba4\u5bc6\u7801\uff01"},{validator:a.checkConfirm}]})(C.default.createElement(m.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u91cd\u65b0\u8f93\u5165\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(P,null,C.default.createElement(n.default,{size:"large",loading:l,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.subPhoneRegister},"\u63d0\u4ea4"))):2==d&&(i=C.default.createElement("div",{className:S.default.phoneSuccessImg},C.default.createElement("img",{src:F.default}),C.default.createElement("div",{className:S.default.txt},"\u60a8\u5df2\u6210\u529f\u6ce8\u518c\uff0c\u8d76\u5feb\u53bb",C.default.createElement(N.default,{to:"/user/login",style:{color:"#1890ff"}},"\u767b\u5f55~")))),i},a.hanldeEmail=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{email:e.target.value})})},a.nextEmailStep2=function(){var e=a.props.dispatch,t=a.state.params;t.code?e({type:"userForget/nextEmailStep2",payload:{email_address:t.email,email_verify_code:t.code}}).then(function(e){1==e.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),clearInterval(a.interval),a.setState({stepCurrent:1,params:(0,u.default)({},t,{code:t.code})})):o.default.error(e.msg)}):o.default.error("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801")},a.subEmailRegister=function(){var e=a.props,t=e.form,l=e.dispatch;t.validateFields({force:!0},function(e,t){if(!e){var r=a.state.params;l({type:"userForget/emailSubmit",payload:{email_address:r.email,login_pwd:t.password}}).then(function(e){1==e.status?(o.default.success("\u64cd\u4f5c\u6210\u529f"),a.setState({stepCurrent:2})):o.default.error(e.msg)})}})},a.emailRenderFrom=function(){var e=a.props,t=e.form,l=e.submitting,r=t.getFieldDecorator,u={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},o=a.state,d=o.stepCurrent,c=(o.params,o.count),i="";return 0==d?i=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(P,{label:"\u90ae\u7bb1"},r("mail",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u90ae\u7bb1\u5730\u5740\uff01"},{type:"email",message:"\u90ae\u7bb1\u5730\u5740\u683c\u5f0f\u9519\u8bef\uff01"}]})(C.default.createElement(m.default,{size:"large",placeholder:"\u90ae\u7bb1",onKeyUp:a.hanldeEmail}))),C.default.createElement(P,{label:"\u90ae\u7bb1\u9a8c\u8bc1\u7801"},r("captcha",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\uff01"}]})(C.default.createElement(m.default,{size:"large",style:{width:156},maxLength:6,placeholder:"\u9a8c\u8bc1\u7801",onKeyUp:a.hanldeCaptcha})),C.default.createElement(n.default,{size:"large",disabled:!!c,className:S.default.getCaptcha,onClick:a.onGetCaptcha,style:{width:140,display:"inline-block",marginLeft:20}},c?"".concat(c," s"):"\u83b7\u53d6\u9a8c\u8bc1\u7801")),C.default.createElement(P,null,C.default.createElement(n.default,{size:"large",loading:l,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.nextEmailStep2},"\u4e0b\u4e00\u6b65"))):1==d?i=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(P,{label:"\u8bbe\u7f6e\u5bc6\u7801"},r("password",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801\uff01"},{validator:a.checkPassword}]})(C.default.createElement(m.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u8bbe\u7f6e\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(P,{label:"\u786e\u8ba4\u5bc6\u7801"},r("confirm",{rules:[{required:!0,message:"\u8bf7\u786e\u8ba4\u5bc6\u7801\uff01"},{validator:a.checkConfirm}]})(C.default.createElement(m.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u91cd\u65b0\u8f93\u5165\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(P,null,C.default.createElement(n.default,{size:"large",loading:l,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.subEmailRegister},"\u63d0\u4ea4"))):2==d&&(i=C.default.createElement("div",{className:S.default.phoneSuccessImg},C.default.createElement("img",{src:F.default}),C.default.createElement("div",{className:S.default.txt},"\u60a8\u5df2\u6210\u529f\u6ce8\u518c\uff0c\u8d76\u5feb\u53bb",C.default.createElement(N.default,{to:"/user/login",style:{color:"#1890ff"}},"\u767b\u5f55~")))),i},a.renderSteps=function(){var e=a.state,t=(e.tabType,e.stepCurrent),l="";return l=C.default.createElement(y.default,{labelPlacement:"vertical",className:S.default.stepWrap},0==t?C.default.createElement(k,{status:"process",className:"".concat(S.default.stepOn),title:"\u8f93\u5165\u8d26\u6237"}):C.default.createElement(k,{status:"finish",className:"".concat(S.default.stepOn),title:"\u8f93\u5165\u8d26\u6237"}),1==t?C.default.createElement(k,{status:"process",className:"".concat(S.default.stepOn),title:"\u91cd\u8bbe\u5bc6\u7801"}):t<1?C.default.createElement(k,{title:"\u91cd\u8bbe\u5bc6\u7801"}):C.default.createElement(k,{status:"finish",className:"".concat(S.default.stepOn),title:"\u91cd\u8bbe\u5bc6\u7801"}),2==t?C.default.createElement(k,{status:"process",className:"".concat(S.default.stepOn),title:"\u6210\u529f"}):t<2?C.default.createElement(k,{title:"\u6210\u529f"}):C.default.createElement(k,{status:"finish",className:"".concat(S.default.stepOn),title:"\u6210\u529f"})),l},a}return(0,f.default)(t,e),(0,c.default)(t,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"render",value:function(){var e=this,t=this.props,a=t.form,l=(t.submitting,a.getFieldDecorator,this.state.tabType);return C.default.createElement("div",{className:S.default.main},this.renderSteps(),C.default.createElement("div",{className:S.default.cardContainer},C.default.createElement("div",{className:S.default.tabs},C.default.createElement("div",{className:"".concat(S.default.button," ").concat("phone"==l&&S.default.on),onClick:function(){return e.handleTab("phone")}},"\u624b\u673a\u627e\u56de"),C.default.createElement("div",{className:"".concat(S.default.button," ").concat("email"==l&&S.default.on),onClick:function(){return e.handleTab("email")}},"\u90ae\u7bb1\u627e\u56de")),C.default.createElement("div",{className:S.default.tabBox},"phone"==l?this.phoneRenderFrom():this.emailRenderFrom())))}}]),t}(C.Component),E=b))||E),T=h.default.create()(_);t.default=T},qotY:function(e,t,a){e.exports=a.p+"static/img_logon_empty.384f0ac3.png"}}]);