import { querySellDissentOrderDetail, fakeSellDissentOrderReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'sellDissentOrderDetail',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/sellOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(querySellDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.result,
      });
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/sellOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(fakeSellDissentOrderReceipt, payload1);
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
