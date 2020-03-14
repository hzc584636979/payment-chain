import { queryBuyDissentOrderDetail, buyDissentOrderKF, buyDissentOrderClose } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'buyDissentOrderDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/buyOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(queryBuyDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *KF({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/buyOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(buyDissentOrderKF, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/buyOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(buyDissentOrderClose, payload1);
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
