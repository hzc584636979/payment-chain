import request from '@/utils/request';

/*手机登陆*/
export async function fakePhoneAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

/*邮箱登陆*/
export async function fakeEmailAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

/*手机注册-获取验证码*/
export async function fakeGetPhoneCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*手机注册-下一步2*/
export async function fakeNextPhoneStep2(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*手机注册-提交*/
export async function fakePhoneRegister(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*邮箱注册-获取验证码*/
export async function fakeGetEmailCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*邮箱注册-下一步2*/
export async function fakeNextEmailStep2(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*邮箱注册-提交*/
export async function fakeEmailRegister(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*首页-初始化数据*/
export async function fakeHomeData(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*订单管理-出售订单管理-请求*/
export async function fakeSellOrder(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*订单管理-出售订单管理-搜索*/
export async function fakeSellOrderSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*订单管理-出售订单管理-导出*/
export async function fakeSellOrderExport(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*订单管理-出售订单管理-确认收款*/
export async function fakeSellOrderReceipt(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*订单管理-出售订单管理详情*/
export async function querySellOrderDetail(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*订单管理-出售订单管理申述-提交问题*/
export async function sellOrderAppeal(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*订单管理-购买订单管理-请求*/
export async function fakeBuyOrder(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*订单管理-购买订单管理-搜索*/
export async function fakeBuyOrderSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*订单管理-购买订单管理-导出*/
export async function fakeBuyOrderExport(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*订单管理-购买订单管理-确认收款*/
export async function fakeBuyOrderReceipt(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*订单管理-购买订单管理详情*/
export async function queryBuyOrderDetail(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*订单管理-购买订单管理申述-提交问题*/
export async function buyOrderAppeal(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*异议订单管理-出售订单管理-请求*/
export async function fakeSellDissentOrder(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*异议订单管理-出售订单管理-搜索*/
export async function fakeSellDissentOrderSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*异议订单管理-出售订单管理-确认收款*/
export async function fakeSellDissentOrderReceipt(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*异议订单管理-出售订单管理详情*/
export async function querySellDissentOrderDetail(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*异议订单管理-购买订单管理-请求*/
export async function fakeBuyDissentOrder(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*异议订单管理-购买订单管理-搜索*/
export async function fakeBuyDissentOrderSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*异议订单管理-购买订单管理-确认收款*/
export async function fakeBuyDissentOrderReceipt(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*异议订单管理-购买订单管理详情*/
export async function queryBuyDissentOrderDetail(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-请求*/
export async function fakeFinanceSettings(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*财务管理-设置-保存金额*/
export async function fakeFinanceSettingsSaveCoin(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-禁用银行卡*/
export async function fakeFinanceSettingsBankDisabled(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-删除银行卡*/
export async function fakeFinanceSettingsBankDelete(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-禁用支付宝*/
export async function fakeFinanceSettingsAlipayDisabled(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-删除支付宝*/
export async function fakeFinanceSettingsAlipayDelete(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-禁用微信*/
export async function fakeFinanceSettingsWXDisabled(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-设置-删除微信*/
export async function fakeFinanceSettingsWXDelete(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-银行卡设置-请求*/
export async function fakeFinanceSettingsBank(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*财务管理-银行卡设置-验证码*/
export async function fakeFinanceSettingsBankCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-银行卡设置-提交*/
export async function fakeFinanceSettingsBankSubmit(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-支付宝设置-请求*/
export async function fakeFinanceSettingsAlipay(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*财务管理-支付宝设置-验证码*/
export async function fakeFinanceSettingsAlipayCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-支付宝设置-提交*/
export async function fakeFinanceSettingsAlipaySubmit(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-微信设置-请求*/
export async function fakeFinanceSettingsWX(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*财务管理-微信设置-验证码*/
export async function fakeFinanceSettingsWXCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-微信设置-提交*/
export async function fakeFinanceSettingsWXSubmit(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-提币记录-请求*/
export async function fakeWithdrawList(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*财务管理-提币记录-搜索*/
export async function fakeWithdrawListSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*财务管理-押金记录-请求*/
export async function fakeDepositList(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*财务管理-押金记录-搜索*/
export async function fakeDepositListSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*财务管理-押金记录-申请冻结*/
export async function fakeDepositListFrozen(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-银行流水-请求*/
export async function fakeContinualList(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*财务管理-银行流水-搜索*/
export async function fakeContinualListSearchAll(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return [];
}

/*财务管理-提币申请-验证码*/
export async function fakeWithdrawApplyCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*财务管理-提币申请-提交*/
export async function fakeWithdrawApplySubmit(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*消息中心-列表*/
export async function fakeMessageData(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*消息中心-详情页*/
export async function fakeMessageContent(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*账户管理-商户信息-获取手机验证码*/
export async function fakeUserBaseGetPhoneCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*账户管理-商户信息-获取邮箱验证码*/
export async function fakeUserBaseGetEmailCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*账户管理-商户信息-提交信息*/
export async function fakeUserBaseSubmit(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*账户管理-安全设置-获取手机验证码*/
export async function fakeUserSafeGetPhoneCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*账户管理-安全设置-修改手机*/
export async function fakeUserSafeRevisePhone(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*账户管理-安全设置-获取邮箱验证码*/
export async function fakeUserSafeGetEmailCode(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return true;
}

/*账户管理-安全设置-修改邮箱*/
export async function fakeUserSafeReviseEmail(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*账户管理-安全设置-修改交易密码*/
export async function fakeUserSafeReviseTP(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}

/*账户管理-安全设置-修改登录密码*/
export async function fakeUserSafeReviseLP(params) {
  /*return request('/api/login/account', {
    method: 'POST',
    data: params,
  });*/
  return {};
}



