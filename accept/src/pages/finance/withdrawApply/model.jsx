import { withdrawApplyCode, withdrawApplySubmit } from '@/services/api';
import {
  message,
} from 'antd';

const Model = {
  namespace: 'withdrawApply',
  state: {
    
  },
  effects: {
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
