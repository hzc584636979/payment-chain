(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[36],{qotY:function(e,t,a){e.exports=a.p+"static/img_logon_empty.384f0ac3.png"},qq80:function(e,t,a){"use strict";var r=a("g09b"),l=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=r(a("jehZ"));a("+L6B");var n=r(a("2/Rp")),u=r(a("p0pE"));a("miYZ");var d=r(a("tsqr")),i=r(a("2Taf")),o=r(a("vZ4D")),c=r(a("l4Ni")),p=r(a("ujKo")),m=r(a("MhPg"));a("5NDa");var f=r(a("5rEg"));a("OaEy");var g=r(a("2fM7"));a("y8nQ");var h=r(a("Vl3Y"));a("FJo9");var y=r(a("L41K"));a("Znn+");var v,E,b,w=r(a("ZTPi")),C=l(a("q1tI")),x=r(a("wY1l")),N=a("Hg0r"),S=(r(a("3a4m")),r(a("vyRF"))),k=r(a("qotY")),P=(w.default.TabPane,y.default.Step),_=h.default.Item,F=(g.default.Option,f.default.Group),T=(C.default.createElement("div",{className:S.default.success},"\u5f3a\u5ea6\uff1a\u5f3a"),C.default.createElement("div",{className:S.default.warning},"\u5f3a\u5ea6\uff1a\u4e2d"),C.default.createElement("div",{className:S.default.error},"\u5f3a\u5ea6\uff1a\u592a\u77ed"),v=(0,N.connect)(function(e){var t=e.userAndregister,a=e.loading;return{userAndregister:t,submitting:a.effects["userAndregister/submit"]}}),v((b=function(e){function t(){var e,a;(0,i.default)(this,t);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return a=(0,c.default)(this,(e=(0,p.default)(t)).call.apply(e,[this].concat(l))),a.state={count:0,stepCurrent:0,tabType:"phone",params:{country:"china",prefix:"86"}},a.interval=void 0,a.handleTab=function(e){var t=a.props.form;t.resetFields(),clearInterval(a.interval);var r={country:"china",prefix:"86"};a.setState({tabType:e,params:r,count:null,stepCurrent:0})},a.onGetCaptcha=function(){var e=a.props.dispatch,t=a.state,r=t.params,l=t.tabType,s="";if("phone"==l){if(s="userAndregister/getPhoneCode",!r.phone||!/^1\d{10}$/.test(r.phone))return void d.default.error("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\uff01")}else if(s="userAndregister/getEmailCode",!r.email)return void d.default.error("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u90ae\u7bb1\u5730\u5740\uff01");e({type:s,payload:"phone"==l?{telephone_number:r.phone}:{email_address:r.email}}).then(function(e){if(1==e.status){d.default.success("\u64cd\u4f5c\u6210\u529f");var t=59;a.setState({count:t}),a.interval=window.setInterval(function(){t-=1,a.setState({count:t}),0===t&&clearInterval(a.interval)},1e3)}else d.default.error(e.msg)})},a.hanldeCaptcha=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{code:e.target.value})})},a.checkPassword=function(e,t,r){if(console.log(t),t.length<6||t.length>8)r("\u8bf7\u8f93\u51656\u4f4d~8\u4f4d\u4e4b\u95f4\u7684\u5bc6\u7801");else{var l=a.props.form;t&&l.validateFields(["confirm"],{force:!0}),r()}},a.checkConfirm=function(e,t,r){var l=a.props.form;t&&t!==l.getFieldValue("password")?r("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u5339\u914d!"):r()},a.changePrefix=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{prefix:e})})},a.hanldePhone=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{phone:e.target.value})})},a.nextPhoneStep2=function(){var e=a.props.dispatch,t=a.state.params;t.code?e({type:"userAndregister/nextPhoneStep2",payload:{telephone_number:t.phone,telephone_verify_code:t.code}}).then(function(e){1==e.status?(d.default.success("\u64cd\u4f5c\u6210\u529f"),clearInterval(a.interval),a.setState({stepCurrent:1,params:(0,u.default)({},t,{code:t.code})})):d.default.error(e.msg)}):d.default.error("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801")},a.subPhoneRegister=function(){var e=a.props,t=e.form,r=e.dispatch;t.validateFields({force:!0},function(e,t){if(!e){var l=a.state.params;r({type:"userAndregister/phoneSubmit",payload:{telephone_number:l.phone,login_pwd:t.password}}).then(function(e){1==e.status?a.setState({stepCurrent:2}):d.default.error(e.msg)})}})},a.phoneRenderFrom=function(){var e=a.props,t=e.form,r=e.submitting,l=t.getFieldDecorator,u={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},d=a.state,i=d.stepCurrent,o=(d.params,d.count),c="";return 0==i?c=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(_,{label:"\u624b\u673a\u53f7\u7801"},C.default.createElement(F,{compact:!0},l("mobile",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u624b\u673a\u53f7\uff01"},{pattern:/^1\d{10}$/,message:"\u624b\u673a\u53f7\u683c\u5f0f\u9519\u8bef\uff01"}]})(C.default.createElement(f.default,{size:"large",style:{width:560},maxLength:11,placeholder:"\u624b\u673a\u53f7",onKeyUp:a.hanldePhone})))),C.default.createElement(_,{label:"\u77ed\u4fe1\u9a8c\u8bc1\u7801"},l("captcha",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\uff01"}]})(C.default.createElement(f.default,{size:"large",style:{width:156},maxLength:6,placeholder:"\u9a8c\u8bc1\u7801",onKeyUp:a.hanldeCaptcha})),C.default.createElement(n.default,{size:"large",disabled:!!o,className:S.default.getCaptcha,onClick:a.onGetCaptcha,style:{width:140,display:"inline-block",marginLeft:20}},o?"".concat(o," s"):"\u83b7\u53d6\u9a8c\u8bc1\u7801")),C.default.createElement(_,null,C.default.createElement(n.default,{size:"large",loading:r,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.nextPhoneStep2},"\u4e0b\u4e00\u6b65"))):1==i?c=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(_,{label:"\u8bbe\u7f6e\u5bc6\u7801"},l("password",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801\uff01"},{validator:a.checkPassword}]})(C.default.createElement(f.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u8bbe\u7f6e\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(_,{label:"\u786e\u8ba4\u5bc6\u7801"},l("confirm",{rules:[{required:!0,message:"\u8bf7\u786e\u8ba4\u5bc6\u7801\uff01"},{validator:a.checkConfirm}]})(C.default.createElement(f.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u91cd\u65b0\u8f93\u5165\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(_,null,C.default.createElement(n.default,{size:"large",loading:r,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.subPhoneRegister},"\u63d0\u4ea4"))):2==i&&(c=C.default.createElement("div",{className:S.default.phoneSuccessImg},C.default.createElement("img",{src:k.default}),C.default.createElement("div",{className:S.default.txt},"\u60a8\u5df2\u6210\u529f\u6ce8\u518c\uff0c\u8d76\u5feb\u53bb",C.default.createElement(x.default,{to:"/user/login",style:{color:"#1890ff"}},"\u767b\u5f55~")))),c},a.hanldeEmail=function(e){var t=a.state.params;a.setState({params:(0,u.default)({},t,{email:e.target.value})})},a.nextEmailStep2=function(){var e=a.props.dispatch,t=a.state.params;t.code?e({type:"userAndregister/nextEmailStep2",payload:{email_address:t.email,email_verify_code:t.code}}).then(function(e){1==e.status?(d.default.success("\u64cd\u4f5c\u6210\u529f"),clearInterval(a.interval),a.setState({stepCurrent:1,params:(0,u.default)({},t,{code:t.code})})):d.default.error(e.msg)}):d.default.error("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801")},a.subEmailRegister=function(){var e=a.props,t=e.form,r=e.dispatch;t.validateFields({force:!0},function(e,t){if(!e){var l=a.state.params;r({type:"userAndregister/emailSubmit",payload:{email_address:l.email,login_pwd:t.password}}).then(function(e){1==e.status?a.setState({stepCurrent:2}):d.default.error(e.msg)})}})},a.emailRenderFrom=function(){var e=a.props,t=e.form,r=e.submitting,l=t.getFieldDecorator,u={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},d=a.state,i=d.stepCurrent,o=(d.params,d.count),c="";return 0==i?c=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(_,{label:"\u90ae\u7bb1"},l("mail",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u90ae\u7bb1\u5730\u5740\uff01"},{type:"email",message:"\u90ae\u7bb1\u5730\u5740\u683c\u5f0f\u9519\u8bef\uff01"}]})(C.default.createElement(f.default,{size:"large",placeholder:"\u90ae\u7bb1",onKeyUp:a.hanldeEmail}))),C.default.createElement(_,{label:"\u90ae\u7bb1\u9a8c\u8bc1\u7801"},l("captcha",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\uff01"}]})(C.default.createElement(f.default,{size:"large",style:{width:156},maxLength:6,placeholder:"\u9a8c\u8bc1\u7801",onKeyUp:a.hanldeCaptcha})),C.default.createElement(n.default,{size:"large",disabled:!!o,className:S.default.getCaptcha,onClick:a.onGetCaptcha,style:{width:140,display:"inline-block",marginLeft:20}},o?"".concat(o," s"):"\u83b7\u53d6\u9a8c\u8bc1\u7801")),C.default.createElement(_,null,C.default.createElement(n.default,{size:"large",loading:r,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.nextEmailStep2},"\u4e0b\u4e00\u6b65"))):1==i?c=C.default.createElement(h.default,(0,s.default)({style:{width:"80%",margin:"0 auto"}},u),C.default.createElement(_,{label:"\u8bbe\u7f6e\u5bc6\u7801"},l("password",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801\uff01"},{validator:a.checkPassword}]})(C.default.createElement(f.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u8bbe\u7f6e\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(_,{label:"\u786e\u8ba4\u5bc6\u7801"},l("confirm",{rules:[{required:!0,message:"\u8bf7\u786e\u8ba4\u5bc6\u7801\uff01"},{validator:a.checkConfirm}]})(C.default.createElement(f.default,{size:"large",type:"password",maxLength:8,style:{width:360},placeholder:"\u8bf7\u91cd\u65b0\u8f93\u5165\u767b\u5f55\u5bc6\u7801"}))),C.default.createElement(_,null,C.default.createElement(n.default,{size:"large",loading:r,className:S.default.submit,type:"primary",htmlType:"submit",onClick:a.subEmailRegister},"\u63d0\u4ea4"))):2==i&&(c=C.default.createElement("div",{className:S.default.phoneSuccessImg},C.default.createElement("img",{src:k.default}),C.default.createElement("div",{className:S.default.txt},"\u60a8\u5df2\u6210\u529f\u6ce8\u518c\uff0c\u8d76\u5feb\u53bb",C.default.createElement(x.default,{to:"/user/login",style:{color:"#1890ff"}},"\u767b\u5f55~")))),c},a.renderSteps=function(){var e=a.state,t=(e.tabType,e.stepCurrent),r="";return r=C.default.createElement(y.default,{labelPlacement:"vertical",className:S.default.stepWrap},0==t?C.default.createElement(P,{status:"process",className:"".concat(S.default.stepOn),title:"\u521b\u5efa\u8d26\u53f7"}):C.default.createElement(P,{status:"finish",className:"".concat(S.default.stepOn),title:"\u521b\u5efa\u8d26\u53f7"}),1==t?C.default.createElement(P,{status:"process",className:"".concat(S.default.stepOn),title:"\u8bbe\u7f6e\u5bc6\u7801"}):t<1?C.default.createElement(P,{title:"\u8bbe\u7f6e\u5bc6\u7801"}):C.default.createElement(P,{status:"finish",className:"".concat(S.default.stepOn),title:"\u8bbe\u7f6e\u5bc6\u7801"}),2==t?C.default.createElement(P,{status:"process",className:"".concat(S.default.stepOn),title:"\u6210\u529f"}):t<2?C.default.createElement(P,{title:"\u6210\u529f"}):C.default.createElement(P,{status:"finish",className:"".concat(S.default.stepOn),title:"\u6210\u529f"})),r},a}return(0,m.default)(t,e),(0,o.default)(t,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"render",value:function(){var e=this,t=this.props,a=t.form,r=(t.submitting,a.getFieldDecorator,this.state.tabType);return C.default.createElement("div",{className:S.default.main},this.renderSteps(),C.default.createElement("div",{className:S.default.cardContainer},C.default.createElement("div",{className:S.default.tabs},C.default.createElement("div",{className:"".concat(S.default.button," ").concat("phone"==r&&S.default.on),onClick:function(){return e.handleTab("phone")}},"\u624b\u673a\u6ce8\u518c"),C.default.createElement("div",{className:"".concat(S.default.button," ").concat("email"==r&&S.default.on),onClick:function(){return e.handleTab("email")}},"\u90ae\u7bb1\u6ce8\u518c")),C.default.createElement("div",{className:S.default.tabBox},"phone"==r?this.phoneRenderFrom():this.emailRenderFrom())))}}]),t}(C.Component),E=b))||E),q=h.default.create()(T);t.default=q},vyRF:function(e,t,a){e.exports={main:"antd-pro-pages-user-register-style-main",stepWrap:"antd-pro-pages-user-register-style-stepWrap",stepOn:"antd-pro-pages-user-register-style-stepOn",cardContainer:"antd-pro-pages-user-register-style-cardContainer",tabs:"antd-pro-pages-user-register-style-tabs",button:"antd-pro-pages-user-register-style-button",on:"antd-pro-pages-user-register-style-on",tabBox:"antd-pro-pages-user-register-style-tabBox",phoneSuccessImg:"antd-pro-pages-user-register-style-phoneSuccessImg",getCaptcha:"antd-pro-pages-user-register-style-getCaptcha",submit:"antd-pro-pages-user-register-style-submit",login:"antd-pro-pages-user-register-style-login",error:"antd-pro-pages-user-register-style-error",success:"antd-pro-pages-user-register-style-success",warning:"antd-pro-pages-user-register-style-warning","progress-pass":"antd-pro-pages-user-register-style-progress-pass",progress:"antd-pro-pages-user-register-style-progress"}}}]);