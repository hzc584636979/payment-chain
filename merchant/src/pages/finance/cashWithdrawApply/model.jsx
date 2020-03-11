import { withdrawApplyCode, withdrawApplySubmit } from '@/services/api';

const Model = {
  namespace: 'withdrawApply',
  state: {
    data: {},
  },
  effects: {
    *getCode({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(withdrawApplyCode, { telephone_number });
      return response;
    },
    *submit({ payload }, { call, put }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(withdrawApplySubmit, { ...payload, telephone_number });
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
export default Model;
