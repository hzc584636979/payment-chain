import { queryBuyOrderDetail, buyOrderTakeOrder, buyOrderReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'buyOrderDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/order/buyOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(queryBuyOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *transfer({ payload }, { call, put }) {
      const match = pathToRegexp('/order/buyOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1] };
      const response = yield call(buyOrderTakeOrder, payload1);
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/order/buyOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1] };
      const response = yield call(buyOrderReceipt, payload1);
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
