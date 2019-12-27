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

/*手机注册-获取短信验证码*/
export async function fakeGetCode(params) {
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



