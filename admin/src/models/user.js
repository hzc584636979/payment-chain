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
        payload: response.data || null,
      });
      return response.data || null
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
