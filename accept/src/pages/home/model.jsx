import { homeGetTxInfo, homeBuyOnline, homeSellOnline, homeMortgage } from '@/services/api';

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
    *buyStatus({ payload }, { call, put }) {
      const response = yield call(homeBuyOnline, payload);
      return response;
    },
    *sellStatus({ payload }, { call, put }) {
      const response = yield call(homeSellOnline, payload);
      return response;
    },
    *mortgage({ payload }, { call, put }) {
      const response = yield call(homeMortgage, payload);
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
