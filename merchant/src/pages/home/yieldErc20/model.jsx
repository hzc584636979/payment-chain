import { getCoinInfo, homeYieldErc20 } from '@/services/api';

const Model = {
  namespace: 'yieldErc20',
  state: {
    currentUser: {},
  },
  effects: {
    *getCoinInfo({ payload }, { call, put }) {
      const response = yield call(getCoinInfo, payload);
      if(response.status != 1) {
        message.error(`获取用户信息出错，请刷新重试！`);
        return;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response.data ? {
          success_order_percent: response.data.success_order_percent,
          ...response.data.userInfo,
          gas: response.data.walletInfo[0] ? response.data.walletInfo[0].gas : 0,
          chu_gas_percent: response.data.walletInfo[0] ? response.data.walletInfo[0].chu_gas_percent : 0,
          ru_gas_percent: response.data.walletInfo[0] ? response.data.walletInfo[0].ru_gas_percent : 0,
          walletInfo: response.data.walletInfo[0] || {},
          erc20: response.data.walletInfo[0] || {},
          omni: response.data.walletInfo[1] || {},
        } : null,
      });
    },
    *yield({ payload }, { call, put }) {
      const response = yield call(homeYieldErc20, payload);
      return response;
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default Model;
