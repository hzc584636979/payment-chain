import { coldwalletGasDetail, coldwalletGasDetailFrozen } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'coldwalletGasDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/super/coldwallet/coldwalletGas_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(coldwalletGasDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *frozen({ payload }, { call, put }) {
      const match = pathToRegexp('/super/coldwallet/coldwalletGas_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(coldwalletGasDetailFrozen, payload1);
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
