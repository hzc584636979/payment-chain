import { queryGoldYieldDissentOrderDetail, goldYieldDissentOrderKF, goldYieldDissentOrderClose } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'goldYieldDissentOrderDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(queryGoldYieldDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *KF({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(goldYieldDissentOrderKF, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/dissentOrder/goldYieldOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(goldYieldDissentOrderClose, payload1);
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
