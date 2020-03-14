import { querySellDissentOrderDetail, sellDissentOrderKF, sellDissentOrderClose, sellOrderReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'sellDissentOrderDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(querySellDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *KF({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(sellDissentOrderKF, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(sellDissentOrderClose, payload1);
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/sellOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(sellOrderReceipt, payload1);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return action.payload;
    },
  },
};
export default Model;
