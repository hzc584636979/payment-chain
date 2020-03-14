import { queryGoldYieldOrderDetail, goldYieldOrderYield, goldYieldOrderWithdrawOrder, goldYieldOrderNoTransfer } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'goldYieldOrderDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/order/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(queryGoldYieldOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *yieldOrder({ payload }, { call, put }) {
      const match = pathToRegexp('/order/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1] };
      const response = yield call(goldYieldOrderYield, payload1);
      return response;
    },
    *withdrawOrder({ payload }, { call, put }) {
      const match = pathToRegexp('/order/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(goldYieldOrderWithdrawOrder, payload1);
      return response;
    },
    *noTransfer({ payload }, { call, put }) {
      const match = pathToRegexp('/order/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(goldYieldOrderNoTransfer, payload1);
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
