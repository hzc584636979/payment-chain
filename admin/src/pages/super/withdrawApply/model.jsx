import { getPhoneVerifyCode, centerWithdrawApplySubmit } from '@/services/api';
import { message } from 'antd';

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
      const response = yield call(centerWithdrawApplySubmit, { ...payload, telephone_number });
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        address: payload,
      };
    },
  },
};
export default Model;
