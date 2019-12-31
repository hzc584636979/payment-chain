import { queryBuyDissentOrderDetail, fakeBuyDissentOrderReceipt } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'buyDissentOrderDetail',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/buyOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(queryBuyDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.result,
      });
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/buyOrder_detail/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(fakeBuyDissentOrderReceipt, payload1);
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
