import { acceptCoinWithdrawApply, acceptCoinWithdrawApplySearchAll, acceptCoinWithdrawApplyAgree, acceptCoinWithdrawApplyRefuse } from '@/services/api';

const Model = {
  namespace: 'acceptCoinWithdrawApply',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(acceptCoinWithdrawApply, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(acceptCoinWithdrawApplySearchAll, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *agree({ payload }, { call, put }) {
      const response = yield call(acceptCoinWithdrawApplyAgree, payload);
      return response;
    },
    *refuse({ payload }, { call, put }) {
      const response = yield call(acceptCoinWithdrawApplyRefuse, payload);
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
