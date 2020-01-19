import { homeGetTxInfo, homeWithdrawApplyErc20, homeWithdrawApplyOmni, withdrawApplyCode } from '@/services/api';

const Model = {
  namespace: 'home',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(homeGetTxInfo, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *getCode({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(withdrawApplyCode, { telephone_number });
      return response;
    },
    *withdrawApplyErc20({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(homeWithdrawApplyErc20, { ...payload, token_id: 1, telephone_number});
      return response;
    },
    *withdrawApplyOmni({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(homeWithdrawApplyOmni, { ...payload, token_id: 2, telephone_number});
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
