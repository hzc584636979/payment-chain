import { getUserInfo } from '@/services/api';
import {
  message,
} from 'antd';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {
      walletInfo: {},
    },
  },
  effects: {
    *getUserInfo(_, { call, put }) {
      const response = yield call(getUserInfo);
      if(response.status != 1) {
        message.error('获取用户信息出错，请刷新重试！');
        return;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response.data ? {
          rate: response.data.rate,
          success_order_percent: response.data.success_order_percent,
          token_price: response.data.token_price,
          ...response.data.accountInfo,
          ...response.data.userInfo,
          walletInfo: response.data.walletInfo[0],
        } : null,
      });
      return response.data ? {
        ...response.data.accountInfo,
        ...response.data.userInfo,
        walletInfo: response.data.walletInfo[0],
      } : null
    },
    *changeWalletInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo);
      if(response.status != 1) {
        message.error('获取用户信息出错，请刷新重试！');
        return;
      }
      yield put({
        type: 'saveCurrentUser',
        payload: response.data ? {
          rate: response.data.rate,
          success_order_percent: response.data.success_order_percent,
          token_price: response.data.token_price,
          ...response.data.accountInfo,
          ...response.data.userInfo,
          walletInfo: response.data.walletInfo[payload.walletType],
        } : null,
      });
      return response;
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      g_setLocalStorage(action.payload);
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
