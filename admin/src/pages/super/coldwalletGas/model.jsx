import { coldwalletGas, coldwalletGasAdd, coldwalletGasDelete } from '@/services/api';


const Model = {
  namespace: 'coldwalletGasList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const response = yield call(coldwalletGas, payload);
      let { list, total } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list, pagination: { total, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(coldwalletGasAdd, payload);
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(coldwalletGasDelete, payload);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
export default Model;
