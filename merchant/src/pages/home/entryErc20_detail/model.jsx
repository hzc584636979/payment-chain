import { entryUSDT_detail, entryTransferUSDT, entryCancelUSDT } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'entryUSDT_detail',
  state: {

  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const match = pathToRegexp('/entry/entryUSDT/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(entryUSDT_detail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *transfer({ payload }, { select,call, put }) {
      const match = pathToRegexp('/entry/entryUSDT/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(entryTransferUSDT, payload1);
      return response;
    },
    *cancel({ payload }, { call, put }) {
      const match = pathToRegexp('/entry/entryUSDT/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1] };
      const response = yield call(entryCancelUSDT, payload1);
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default Model;
