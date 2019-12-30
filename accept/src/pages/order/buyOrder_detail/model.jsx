import { queryBuyOrderDetail, fakeBuyOrderReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'buyOrderDetail',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/order/buyOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(queryBuyOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.result,
      });
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/order/buyOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(fakeBuyOrderReceipt, payload1);
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
