import { queryCoinOrderDetail } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'coinOrderDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/order/coinOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(queryCoinOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data[0],
      });
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
