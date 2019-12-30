import { buyOrderAppeal } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'buyOrderAppeal',
  state: {
    data: {},
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const match = pathToRegexp('/order/buyOrder_appeal/:id').exec(window.location.hash);
      const payload1 = { id: match[1] };
      const response = yield call(buyOrderAppeal, payload1);
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
