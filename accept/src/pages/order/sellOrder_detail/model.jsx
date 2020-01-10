import { querySellOrderDetail, sellOrderReceipt, sellOrderNoReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'sellOrderDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/order/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(querySellOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/order/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(sellOrderReceipt, payload1);
      return response;
    },
    *noReceipt({ payload }, { call, put }) {
      const match = pathToRegexp('/order/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(sellOrderNoReceipt, payload1);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Model;
