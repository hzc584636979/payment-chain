import request from '@/utils/request';
import { formatMomentTime } from '@/utils/utils';

let apiAddress = '';
if(process.env.NODE_ENV == 'development') { //本地测试
  apiAddress = '/server/api';
}else if(process.env.BUILD_ENV == 'test') { //测试服务器
  apiAddress = 'http://usdt.usdtpay.net.cn/management/api';
}else { //正式服务器
  apiAddress = 'http://usdt.usdtpay.net.cn/management/api';
}
console.log(process.env.NODE_ENV, process.env.BUILD_ENV)

/*获取用户信息*/
export async function getUserInfo(params) {
  return request(`${apiAddress}/login/getUserInfo`, {
    method: 'POST',
    data: params,
  });
}

/*手机获取验证码*/
export async function getPhoneVerifyCode(params) {
  return request(`${apiAddress}/login/getPhoneVerifyCode`, {
    method: 'POST',
    data: params,
  });
}

/*手机登陆*/
export async function phoneAccountLogin(params) {
  return request(`${apiAddress}/login/login`, {
    method: 'POST',
    data: {
      telephone_number: params.userName,
      telephone_verify_code: params.login_pwd,
    },
  });
}

/*退出登录*/
export async function loginOut(params) {
  return request(`${apiAddress}/login/quitLogin`, {
    method: 'POST',
    data: params,
  });
  return null;
}

/*超级管理员-承兑商管理员-请求*/
export async function superAccept(params) {
  return request(`${apiAddress}/manager/accept/list`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-搜索*/
export async function superAcceptSearchAll(params) {
  return request(`${apiAddress}/manager/accept/list`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-添加*/
export async function superAcceptAdd(params) {
  return request(`${apiAddress}/manager/accept/add`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-删除*/
export async function superAcceptDelete(params) {
  return request(`${apiAddress}/manager/accept/delete`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-修改管理人数*/
export async function superAcceptModify(params) {
  return request(`${apiAddress}/manager/accept/update`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-成员-请求*/
export async function superAcceptMember(params) {
  return request(`${apiAddress}/manager/accept/detail`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-成员-搜索*/
export async function superAcceptMemberSearchAll(params) {
  return request(`${apiAddress}/manager/accept/detail`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-成员-添加*/
export async function superAcceptMemberAdd(params) {
  return request(`${apiAddress}/accept/member/add`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商管理员-成员-删除*/
export async function superAcceptMemberDelete(params) {
  return request(`${apiAddress}/accept/member/delete`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-请求*/
export async function superMerchant(params) {
  return request(`${apiAddress}/manager/merchant/list`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-搜索*/
export async function superMerchantSearchAll(params) {
  return request(`${apiAddress}/manager/merchant/list`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-添加*/
export async function superMerchantAdd(params) {
  return request(`${apiAddress}/manager/merchant/add`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-删除*/
export async function superMerchantDelete(params) {
  return request(`${apiAddress}/manager/merchant/delete`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-修改管理人数*/
export async function superMerchantModify(params) {
  return request(`${apiAddress}/manager/merchant/update`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-成员-请求*/
export async function superMerchantMember(params) {
  return request(`${apiAddress}/manager/merchant/detail`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-成员-搜索*/
export async function superMerchantMemberSearchAll(params) {
  return request(`${apiAddress}/manager/merchant/detail`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-成员-添加*/
export async function superMerchantMemberAdd(params) {
  return request(`${apiAddress}/merchant/member/add`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-商户管理员-成员-删除*/
export async function superMerchantMemberDelete(params) {
  return request(`${apiAddress}/merchant/member/delete`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-请求钱包信息*/
export async function getWalletList(params) {
  return request(`${apiAddress}/wallet/config/get`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-修改冷钱包信息*/
export async function superWalletModify(params) {
  return request(`${apiAddress}/wallet/config/cold/update`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-承兑商冷钱包-请求*/
export async function coldwalletAccept(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = parseInt(time[0] / 1000)+'';
  let end_time = parseInt(time[1] / 1000)+'';
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*超级管理员-承兑商冷钱包-搜索*/
export async function coldwalletAcceptSearchAll(params) {
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

/*超级管理员-商户余额冷钱包-请求*/
export async function coldwalletMerchant(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = parseInt(time[0] / 1000)+'';
  let end_time = parseInt(time[1] / 1000)+'';
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*超级管理员-商户余额冷钱包-搜索*/
export async function coldwalletMerchantSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = parseInt(time[0] / 1000)+'';
  let end_time = parseInt(time[1] / 1000)+'';
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*超级管理员-手续费冷钱包-添加钱包*/
export async function coldwalletGasAdd(params) {
  return request(`${apiAddress}/wallet/center/gas/add`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-手续费冷钱包-删除钱包*/
export async function coldwalletGasDelete(params) {
  return request(`${apiAddress}/wallet/center/gas/delete`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-手续费冷钱包-获取钱包余额*/
export async function coldwalletGasBalance(params) {
  return request(`${apiAddress}/wallet/center/chain/balance`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-中心化钱包-更换中心化钱包地址*/
export async function privateKeySubmit(params) {
  return request(`${apiAddress}/wallet/config/update`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-中心化钱包-提币*/
export async function centerWithdrawApplySubmit(params) {
  return request(`${apiAddress}/wallet/center/withdraw`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-充提币记录-请求*/
export async function withdrawList(params) {
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-充提币记录-搜索*/
export async function withdrawListSearchAll(params) {
  return request(`${apiAddress}/order/buyOrder`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-平台收益-请求*/
export async function profitChart(params) {
  return request(`${apiAddress}/wallet/center/profit/list`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-平台利润-请求*/
export async function profitList(params) {
  return request(`${apiAddress}/wallet/center/share/list`, {
    method: 'POST',
    data: params,
  });
}

/*超级管理员-平台利润-更新*/
export async function profitListModify(params) {
  return request(`${apiAddress}/wallet/center/share/update`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-信用评分-请求*/
export async function acceptCredit(params) {
  return request(`${apiAddress}/accept/credit/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-信用评分-搜索*/
export async function acceptCreditSearchAll(params) {
  return request(`${apiAddress}/accept/credit/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-信用评分-修改*/
export async function acceptCreditModify(params) {
  return request(`${apiAddress}/accept/credit/update`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-浮动费率-请求*/
export async function acceptRate(params) {
  return request(`${apiAddress}/accept/rate/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-浮动费率-搜索*/
export async function acceptRateSearchAll(params) {
  return request(`${apiAddress}/accept/rate/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-浮动费率-调整*/
export async function acceptRateModify(params) {
  return request(`${apiAddress}/accept/rate/update`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-押金管理-请求*/
export async function acceptDeposit(params) {
  return request(`${apiAddress}/accept/deposit/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-押金管理-搜索*/
export async function acceptDepositSearchAll(params) {
  return request(`${apiAddress}/accept/deposit/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-押金管理-退还*/
export async function acceptDepositAgree(params) {
  return request(`${apiAddress}/accept/deposit/agree`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-押金管理-拒绝*/
export async function acceptDepositRefuse(params) {
  return request(`${apiAddress}/accept/deposit/refuse`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-交易槽设置-请求*/
export async function acceptTradingSlot(params) {
  return request(`${apiAddress}/accept/slot/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-交易槽设置-搜索*/
export async function acceptTradingSlotSearchAll(params) {
  return request(`${apiAddress}/accept/slot/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-交易槽设置-修改*/
export async function acceptTradingSlotModify(params) {
  return request(`${apiAddress}/accept/slot/update`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-提币申请-请求*/
export async function acceptCoinWithdrawApply(params) {
  return request(`${apiAddress}/accept/withdrawal/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-提币申请-搜索*/
export async function acceptCoinWithdrawApplySearchAll(params) {
  return request(`${apiAddress}/accept/withdrawal/list`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-提币申请-同意*/
export async function acceptCoinWithdrawApplyAgree(params) {
  return request(`${apiAddress}/accept/withdrawal/agree`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-提币申请-拒绝*/
export async function acceptCoinWithdrawApplyRefuse(params) {
  return request(`${apiAddress}/accept/withdrawal/refuse`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-请求*/
export async function acceptSellDissentOrder(params) {
  return request(`${apiAddress}/accept/objection/sell`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-搜索*/
export async function acceptSellDissentOrderSearchAll(params) {
  return request(`${apiAddress}/accept/objection/sell`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-详情*/
export async function queryAcceptSellDissentOrderDetail(params) {
  return request(`${apiAddress}/accept/objection/detail`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-释放给承兑商*/
export async function acceptSellDissentOrderToAccept(params) {
  return request(`${apiAddress}/accept/objection/releaseAccept`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-释放给商户*/
export async function acceptSellDissentOrderToMerchant(params) {
  return request(`${apiAddress}/accept/objection/releaseMerchant`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-取消订单*/
export async function acceptSellDissentOrderClose(params) {
  return request(`${apiAddress}/accept/objection/cancelOrder`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-惩罚承兑商*/
export async function acceptSellDissentOrderPunishAccept(params) {
  return request(`${apiAddress}/accept/objection/punishAccept`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-惩罚商户*/
export async function acceptSellDissentOrderPunishMerchant(params) {
  return request(`${apiAddress}/accept/objection/punishMerchants`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-出售异议订单-和解*/
export async function acceptSellDissentOrderCompromise(params) {
  return request(`${apiAddress}/accept/objection/compromise`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-请求*/
export async function acceptBuyDissentOrder(params) {
  return request(`${apiAddress}/accept/objection/buy`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-搜索*/
export async function acceptBuyDissentOrderSearchAll(params) {
  return request(`${apiAddress}/accept/objection/buy`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-详情*/
export async function queryAcceptBuyDissentOrderDetail(params) {
  return request(`${apiAddress}/accept/objection/detail`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-释放给承兑商*/
export async function acceptBuyDissentOrderToAccept(params) {
  return request(`${apiAddress}/accept/objection/releaseAccept`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-释放给商户*/
export async function acceptBuyDissentOrderToMerchant(params) {
  return request(`${apiAddress}/accept/objection/releaseMerchant`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-取消订单*/
export async function acceptBuyDissentOrderClose(params) {
  return request(`${apiAddress}/accept/objection/cancelOrder`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-惩罚承兑商*/
export async function acceptBuyDissentOrderPunishAccept(params) {
  return request(`${apiAddress}/accept/objection/punishAccept`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-惩罚商户*/
export async function acceptBuyDissentOrderPunishMerchant(params) {
  return request(`${apiAddress}/accept/objection/punishMerchants`, {
    method: 'POST',
    data: params,
  });
}

/*承兑商管理员-购买异议订单-和解*/
export async function acceptBuyDissentOrderCompromise(params) {
  return request(`${apiAddress}/accept/objection/compromise`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-手续费设置-请求*/
export async function merchantBrokerage(params) {
  return request(`${apiAddress}/merchant/poundage/list`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-手续费设置-搜索*/
export async function merchantBrokerageSearchAll(params) {
  return request(`${apiAddress}/merchant/poundage/list`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-手续费设置-调整*/
export async function merchantBrokerageModify(params) {
  return request(`${apiAddress}/merchant/poundage/update`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-请求*/
export async function merchantSellDissentOrder(params) {
  return request(`${apiAddress}/merchant/objection/sell`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-搜索*/
export async function merchantSellDissentOrderSearchAll(params) {
  return request(`${apiAddress}/merchant/objection/sell`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-详情*/
export async function queryMerchantSellDissentOrderDetail(params) {
  return request(`${apiAddress}/merchant/objection/detail`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-释放给承兑商*/
export async function merchantSellDissentOrderToAccept(params) {
  return request(`${apiAddress}/merchant/objection/releaseAccept`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-释放给商户*/
export async function merchantSellDissentOrderToMerchant(params) {
  return request(`${apiAddress}/merchant/objection/releaseMerchant`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-取消订单*/
export async function merchantSellDissentOrderClose(params) {
  return request(`${apiAddress}/merchant/objection/cancelOrder`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-惩罚承兑商*/
export async function merchantSellDissentOrderPunishAccept(params) {
  return request(`${apiAddress}/merchant/objection/punishAccept`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-惩罚商户*/
export async function merchantSellDissentOrderPunishMerchant(params) {
  return request(`${apiAddress}/merchant/objection/punishMerchants`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-出金异议订单-和解*/
export async function merchantSellDissentOrderCompromise(params) {
  return request(`${apiAddress}/merchant/objection/compromise`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-请求*/
export async function merchantBuyDissentOrder(params) {
  return request(`${apiAddress}/merchant/objection/buy`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-搜索*/
export async function merchantBuyDissentOrderSearchAll(params) {
  return request(`${apiAddress}/merchant/objection/buy`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-详情*/
export async function queryMerchantBuyDissentOrderDetail(params) {
  return request(`${apiAddress}/merchant/objection/detail`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-释放给承兑商*/
export async function merchantBuyDissentOrderToAccept(params) {
  return request(`${apiAddress}/merchant/objection/releaseAccept`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-释放给商户*/
export async function merchantBuyDissentOrderToMerchant(params) {
  return request(`${apiAddress}/merchant/objection/releaseMerchant`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-取消订单*/
export async function merchantBuyDissentOrderClose(params) {
  return request(`${apiAddress}/merchant/objection/cancelOrder`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-惩罚承兑商*/
export async function merchantBuyDissentOrderPunishAccept(params) {
  return request(`${apiAddress}/merchant/objection/punishAccept`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-惩罚商户*/
export async function merchantBuyDissentOrderPunishMerchant(params) {
  return request(`${apiAddress}/merchant/objection/punishMerchants`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-入金异议订单-和解*/
export async function merchantBuyDissentOrderCompromise(params) {
  return request(`${apiAddress}/merchant/objection/compromise`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-提币申请-请求*/
export async function merchantCoinWithdrawApply(params) {
  return request(`${apiAddress}/merchant/withdrawal/list`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-提币申请-搜索*/
export async function merchantCoinWithdrawApplySearchAll(params) {
  return request(`${apiAddress}/merchant/withdrawal/list`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-提币申请-同意*/
export async function merchantCoinWithdrawApplyAgree(params) {
  return request(`${apiAddress}/merchant/withdrawal/agree`, {
    method: 'POST',
    data: params,
  });
}

/*商户管理员-提币申请-拒绝*/
export async function merchantCoinWithdrawApplyRefuse(params) {
  return request(`${apiAddress}/merchant/withdrawal/refuse`, {
    method: 'POST',
    data: params,
  });
}

/*系统管理-日志记录-请求*/
export async function systemLog(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/system/log/list`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*系统管理-日志记录-搜索*/
export async function systemLogSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/system/log/list`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*系统管理-发布消息-发布*/
export async function systemNewsSubmit(params) {
  return request(`${apiAddress}/system/message/publish`, {
    method: 'POST',
    data: params,
  });
}

/*系统管理-消息记录-请求*/
export async function systemMessage(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/system/message/list`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*系统管理-消息记录-搜索*/
export async function systemMessageSearchAll(params) {
  let time = params.time && formatMomentTime(params.time);
  let begin_time = time[0];
  let end_time = time[1];
  return request(`${apiAddress}/system/message/list`, {
    method: 'POST',
    data: {
      ...params,
      begin_time,
      end_time
    },
  });
}

/*系统管理-消息记录-删除*/
export async function systemMessageDelete(params) {
  return request(`${apiAddress}/system/message/delete`, {
    method: 'POST',
    data: params,
  });
}


/*系统管理-消息记录详情页-请求*/
export async function systemMessageDetail(params) {
  return request(`${apiAddress}/system/message/detail`, {
    method: 'POST',
    data: params,
  });
}



