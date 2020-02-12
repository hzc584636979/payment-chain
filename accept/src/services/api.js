import request from '@/utils/request';
import { formatMomentTime } from '@/utils/utils';

let apiAddress = '';
if(process.env.NODE_ENV == 'development') {
  apiAddress = '/server/api';
}else {
  apiAddress = 'http://www.boq.hk/acceptance/api';
}
console.log(process.env.NODE_ENV)

/*手机登陆*/
export async function phoneAccountLogin(params) {
  return request(`${apiAddress}/login/login`, {
    method: 'POST',
    data: {
      telephone_number: params.userName,
      login_pwd: params.login_pwd,
    },
  });
}

/*邮箱登陆*/
export async function emailAccountLogin(params) {
  return request(`${apiAddress}/login/login`, {
    method: 'POST',
    data: {
      email_address: params.userName,
      login_pwd: params.login_pwd,
    },
  });
}

/*手机注册-获取验证码*/
export async function getPhoneCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*手机注册-效验验证码*/
export async function nextPhoneStep2(params) {
  return request(`${apiAddress}/login/checkPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*手机注册-提交*/
export async function phoneRegister(params) {
  return request(`${apiAddress}/login/phoneRegister`, {
    method: 'POST',
    data: params,
  });
}

/*邮箱注册-获取验证码*/
export async function getEmailCode(params) {
  return request(`${apiAddress}/login/getEmailVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*邮箱注册-效验验证码*/
export async function nextEmailStep2(params) {
  return request(`${apiAddress}/login/checkEmailVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*邮箱注册-提交*/
export async function emailRegister(params) {
  return request(`${apiAddress}/login/emailRegister`, {
    method: 'POST',
    data: params,
  });
}

/*手机忘记密码-获取验证码*/
export async function forgetPhoneCode(params) {
  return request(`${apiAddress}/login/forgotPwd`, {
    method: 'POST',
    data: params,
  });
}

/*手机忘记密码-效验验证码*/
export async function forgetNextPhoneStep2(params) {
  return request(`${apiAddress}/login/checkPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*手机忘记密码-提交*/
export async function phoneForget(params) {
  return request(`${apiAddress}/login/pwdReset`, {
    method: 'POST',
    data: params,
  });
}

/*邮箱忘记密码-获取验证码*/
export async function forgetEmailCode(params) {
  return request(`${apiAddress}/login/forgotPwd`, {
    method: 'POST',
    data: params,
  });
}

/*邮箱忘记密码-效验验证码*/
export async function forgetNextEmailStep2(params) {
  return request(`${apiAddress}/login/checkEmailVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*邮箱忘记密码-提交*/
export async function emailForget(params) {
  return request(`${apiAddress}/login/pwdReset`, {
    method: 'POST',
    data: params,
  });
}

/*退出登录*/
export async function loginOut(params) {
  return request(`${apiAddress}/home/quitLogin`, {
    method: 'POST',
    data: params,
  });
}

/*首页-获取用户信息*/
export async function getUserInfo(params) {
  return request(`${apiAddress}/home/getUserInfo`, {
    method: 'POST',
    data: params,
  });
}

/*首页-获取交易信息*/
export async function homeGetTxInfo(params) {
  return request(`${apiAddress}/home/getTxInfo`, {
    method: 'POST',
    data: params,
  });
}

/*首页-承兑管理-购买状态*/
export async function homeBuyOnline(params) {
  return request(`${apiAddress}/home/changeBuyOnlineStatus`, {
    method: 'POST',
    data: params,
  });
}

/*首页-承兑管理-出售状态*/
export async function homeSellOnline(params) {
  return request(`${apiAddress}/home/changeSellOnlineStatus`, {
    method: 'POST',
    data: params,
  });
}

/*首页-抵押*/
export async function homeMortgage(params) {
  return request(`${apiAddress}/financial/stakeCoin`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-出售订单管理-请求*/
export async function sellOrder(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/sellOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*订单管理-出售订单管理-搜索*/
export async function sellOrderSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/sellOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*订单管理-出售订单管理-确认收款*/
export async function sellOrderReceipt(params) {
  return request(`${apiAddress}/order/confirmCollectMoney`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-出售订单管理-确认未收款*/
export async function sellOrderNoReceipt(params) {
  return request(`${apiAddress}/order/confirmUnCollectMoney`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-出售订单管理详情*/
export async function querySellOrderDetail(params) {
  return request(`${apiAddress}/order/orderDetail`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-出售订单管理申诉-提交问题*/
export async function sellOrderAppeal(params) {
  return request(`${apiAddress}/order/complaintOrder`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-购买订单管理-请求*/
export async function buyOrder(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*订单管理-购买订单管理-搜索*/
export async function buyOrderSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*订单管理-购买订单管理-确认接单*/
export async function buyOrderTakeOrder(params) {
  return request(`${apiAddress}/order/takeOrder`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-购买订单管理-确认转款*/
export async function buyOrderReceipt(params) {
  return request(`${apiAddress}/order/confirmPayment`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-购买订单管理详情*/
export async function queryBuyOrderDetail(params) {
  return request(`${apiAddress}/order/orderDetail`, {
    method: 'POST',
    data: params,
  });
}

/*订单管理-购买订单管理申诉-提交问题*/
export async function buyOrderAppeal(params) {
  return request(`${apiAddress}/order/complaintOrder`, {
    method: 'POST',
    data: params,
  });
}

/*异议订单管理-出售订单管理-请求*/
export async function sellDissentOrder(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/objectionSellOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*异议订单管理-出售订单管理-搜索*/
export async function sellDissentOrderSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/objectionSellOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*异议订单管理-出售订单管理详情*/
export async function querySellDissentOrderDetail(params) {
  return request(`${apiAddress}/order/orderDetail`, {
    method: 'POST',
    data: params,
  });
}

/*异议订单管理-出售订单管理详情-客服介入*/
export async function sellDissentOrderKF(params) {
  return request(`${apiAddress}/order/customerService`, {
    method: 'POST',
    data: params,
  });
}

/*异议订单管理-出售订单管理详情-关闭异议*/
export async function sellDissentOrderClose(params) {
  return request(`${apiAddress}/order/closeComplaint`, {
    method: 'POST',
    data: params,
  });
}

/*异议订单管理-购买订单管理-请求*/
export async function buyDissentOrder(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/objectionBuyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*异议订单管理-购买订单管理-搜索*/
export async function buyDissentOrderSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/order/objectionBuyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*异议订单管理-购买订单管理详情*/
export async function queryBuyDissentOrderDetail(params) {
  return request(`${apiAddress}/order/orderDetail`, {
    method: 'POST',
    data: params,
  });
}

/*异议订单管理-购买订单管理详情-客服介入*/
export async function buyDissentOrderKF(params) {
  return request(`${apiAddress}/order/customerService`, {
    method: 'POST',
    data: params,
  });
}

/*异议订单管理-购买订单管理详情-关闭异议*/
export async function buyDissentOrderClose(params) {
  return request(`${apiAddress}/order/closeComplaint`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-请求*/
export async function financeSettings(params) {
  return request(`${apiAddress}/financial/getPaymentSetInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-保存金额*/
export async function financeSettingsSaveCoin(params) {
  return request(`${apiAddress}/financial/setPaymentArea`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-禁用银行卡*/
export async function financeSettingsBankDisabled(params) {
  return request(`${apiAddress}/financial/setBankStatus`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-删除银行卡*/
export async function financeSettingsBankDelete(params) {
  return request(`${apiAddress}/financial/deleteBank`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-禁用支付宝*/
export async function financeSettingsAlipayDisabled(params) {
  return request(`${apiAddress}/financial/setAliPayStatus`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-删除支付宝*/
export async function financeSettingsAlipayDelete(params) {
  return request(`${apiAddress}/financial/deleteAliPay`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-禁用微信*/
export async function financeSettingsWXDisabled(params) {
  return request(`${apiAddress}/financial/setWeChatStatus`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-删除微信*/
export async function financeSettingsWXDelete(params) {
  return request(`${apiAddress}/financial/deleteWeChat`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-禁用Visa*/
export async function financeSettingsVisaDisabled(params) {
  return request(`${apiAddress}/financial/setVisaStatus`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-删除Visa*/
export async function financeSettingsVisaDelete(params) {
  return request(`${apiAddress}/financial/deleteVisa`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-禁用Paypal*/
export async function financeSettingsPaypalDisabled(params) {
  return request(`${apiAddress}/financial/setPaypalStatus`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-设置-删除Paypal*/
export async function financeSettingsPaypalDelete(params) {
  return request(`${apiAddress}/financial/deletePaypal`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-银行卡设置-请求*/
export async function financeSettingsBank(params) {
  return request(`${apiAddress}/financial/getPaymentSetInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-银行卡设置-验证码*/
export async function financeSettingsBankCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-银行卡设置-提交*/
export async function financeSettingsBankSubmit(params) {
  return request(`${apiAddress}/financial/setBankInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-支付宝设置-请求*/
export async function financeSettingsAlipay(params) {
  return request(`${apiAddress}/financial/getPaymentSetInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-支付宝设置-验证码*/
export async function financeSettingsAlipayCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-支付宝设置-提交*/
export async function financeSettingsAlipaySubmit(params) {
  return request(`${apiAddress}/financial/setAliPayInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-微信设置-请求*/
export async function financeSettingsWX(params) {
  return request(`${apiAddress}/financial/getPaymentSetInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-微信设置-验证码*/
export async function financeSettingsWXCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-微信设置-提交*/
export async function financeSettingsWXSubmit(params) {
  return request(`${apiAddress}/financial/setWeChatInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-Visa设置-请求*/
export async function financeSettingsVisa(params) {
  return request(`${apiAddress}/financial/getPaymentSetInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-Visa设置-验证码*/
export async function financeSettingsVisaCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-Visa设置-提交*/
export async function financeSettingsVisaSubmit(params) {
  return request(`${apiAddress}/financial/setVisaInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-Paypal设置-请求*/
export async function financeSettingsPaypal(params) {
  return request(`${apiAddress}/financial/getPaymentSetInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-Paypal设置-验证码*/
export async function financeSettingsPaypalCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-Paypal设置-提交*/
export async function financeSettingsPaypalSubmit(params) {
  return request(`${apiAddress}/financial/setPaypalInfo`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-提币/充币记录-请求*/
export async function withdrawList(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = parseInt(time[0] / 1000)+'';
  let end_time = parseInt(time[1] / 1000)+'';
  return request(`${apiAddress}/financial/getCashOutRecord`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*财务管理-提币/充币记录-搜索*/
export async function withdrawListSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = parseInt(time[0] / 1000)+'';
  let end_time = parseInt(time[1] / 1000)+'';
  return request(`${apiAddress}/financial/getCashOutRecord`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*财务管理-押金记录-请求*/
export async function depositList(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/financial/getStakeRecord`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*财务管理-押金记录-搜索*/
export async function depositListSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/financial/getStakeRecord`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*财务管理-押金记录-申请解冻*/
export async function depositListFrozen(params) {
  return request(`${apiAddress}/financial/applyThaw`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-提币申请-验证码*/
export async function withdrawApplyCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*财务管理-提币申请-提交*/
export async function withdrawApplySubmit(params) {
  return request(`${apiAddress}/financial/cashOutCoin`, {
    method: 'POST',
    data: params,
  });
}

/*消息中心-列表*/
export async function messageData(params) {
  return request(`${apiAddress}/message/messageList`, {
    method: 'POST',
    data: params,
  });
}

/*消息中心-详情页*/
export async function messageContent(params) {
  return request(`${apiAddress}/message/getMessageById`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-商户信息-获取手机验证码*/
export async function userBaseGetPhoneCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-商户信息-获取邮箱验证码*/
export async function userBaseGetEmailCode(params) {
  return request(`${apiAddress}/login/getEmailVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-商户信息-提交信息*/
export async function userBaseSubmit(params) {
  return request(`${apiAddress}/account/realNameAuthentication`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-更改LOGO*/
export async function userSafeModifyLogo(params) {
  return request(`${apiAddress}/account/modifyLogo`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-获取手机验证码*/
export async function userSafeGetPhoneCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-修改手机*/
export async function userSafeRevisePhone(params) {
  return request(`${apiAddress}/account/modifyTelephoneNumber`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-获取邮箱验证码*/
export async function userSafeGetEmailCode(params) {
  return request(`${apiAddress}/login/getEmailVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-修改邮箱*/
export async function userSafeReviseEmail(params) {
  return request(`${apiAddress}/account/modifyEmailAddress`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-修改交易密码*/
export async function userSafeReviseTP(params) {
  return request(`${apiAddress}/account/modifyTxPwd`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-忘记交易密码*/
export async function userSafeForgetTP(params) {
  return request(`${apiAddress}/login/paymentPwdReset`, {
    method: 'POST',
    data: params,
  });
}

/*账户管理-安全设置-修改登录密码*/
export async function userSafeReviseLP(params) {
  return request(`${apiAddress}/account/modifyLoginPwd`, {
    method: 'POST',
    data: params,
  });
}



