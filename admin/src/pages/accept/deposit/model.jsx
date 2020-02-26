import { acceptDeposit, acceptDepositSearchAll, acceptDepositAgree, acceptDepositRefuse } from '@/services/api';

const Model = {
  namespace: 'acceptDeposit',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(acceptDeposit, payload);
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
      const response = yield call(acceptDepositSearchAll, payload);
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
      const response = yield call(acceptDepositAgree, payload);
      return response;
    },
    *refuse({ payload }, { call, put }) {
      const response = yield call(acceptDepositRefuse, payload);
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
