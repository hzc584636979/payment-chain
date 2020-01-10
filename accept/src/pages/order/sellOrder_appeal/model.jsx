import { sellOrderAppeal } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'sellOrderAppeal',
  state: {
    data: {},
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const match = pathToRegexp('/order/sellOrder_appeal/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(sellOrderAppeal, payload1);
      yield put({
        type: 'save',
        payload: response.result,
      });
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
