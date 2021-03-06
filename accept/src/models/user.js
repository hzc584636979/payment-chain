import { getUserInfo, sendUserHeart } from '@/services/api';
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
          ...response.data.accountInfo,
          ...response.data.userInfo,
          gas: response.data.walletInfo[0] ? response.data.walletInfo[0].gas : 0,
          walletInfo: response.data.walletInfo[0] || {},
          erc20: response.data.walletInfo[0] || {},
          omni: response.data.walletInfo[1] || {},
        } : null,
      });
      return response.data ? {
        ...response.data.accountInfo,
        ...response.data.userInfo,
        walletInfo: response.data.walletInfo[0] || {},
        erc20: response.data.walletInfo[0] || {},
        omni: response.data.walletInfo[1] || {},
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
          ...response.data.accountInfo,
          ...response.data.userInfo,
          gas: response.data.walletInfo[0] ? response.data.walletInfo[0].gas : 0,
          walletInfo: response.data.walletInfo[payload.walletType] || {},
          erc20: response.data.walletInfo[0] || {},
          omni: response.data.walletInfo[1] || {},
        } : null,
      });
      return response;
    },
    *heart({ payload }, { call, put }) {
      const response = yield call(sendUserHeart);
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      g_setLocalStorage({...action.payload, token: g_getLocalStorage() ? g_getLocalStorage().token : null});
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
