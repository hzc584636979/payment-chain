import { getUserInfo, withdrawApplyCode, withdrawApplySubmit } from '@/services/api';
import {
  message,
} from 'antd';

const Model = {
  namespace: 'withdrawApply',
  state: {
    
  },
  effects: {
    *getCoinInfo({ payload }, { call, put, select }) {
      const response = yield call(getUserInfo);
      if(response.status != 1) {
        message.error('获取用户信息出错，请刷新重试！');
        return {};
      }
      yield put({
        type: 'save',
        payload: response.data ? {...response.data.walletInfo[payload.walletType], gas: response.data.walletInfo[0].gas, loading: true} : null,
      });
      return response;
    },
    *getCode({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(withdrawApplyCode, { telephone_number });
      return response;
    },
    *submit({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(withdrawApplySubmit, { ...payload, telephone_number });
      return response;
    },
    *clear(_, { call, put }) {
      yield put({
        type: 'clearData'
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearData() {
      return {};
    }
  },
};
export default Model;
