import { querySellOrderDetail, fakeSellOrderReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'sellOrderDetail',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/order/sellOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(querySellOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.result,
      });
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/order/sellOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(fakeSellOrderReceipt, payload1);
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
