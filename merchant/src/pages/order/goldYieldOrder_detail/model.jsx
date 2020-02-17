import { queryGoldYieldOrderDetail, goldYieldOrderYield, goldYieldOrderWithdrawOrder } from '@/services/api';
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
        payload: response.data,
      });
      return response;
    },
    *yieldOrder({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderYield, payload);
      return response;
    },
    *withdrawOrder({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderWithdrawOrder, payload);
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
