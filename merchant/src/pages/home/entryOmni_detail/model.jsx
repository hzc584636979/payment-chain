import { fakeEntryUSDT_detail, fakeEntryTransferUSDT, fakeEntryCancelUSDT } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'entryOmni_detail',
  state: {

  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const match = pathToRegexp('/entry/entryOmni/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(fakeEntryUSDT_detail, payload1);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *transfer({ payload }, { select,call, put }) {
      const match = pathToRegexp('/entry/entryOmni/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(fakeEntryTransferUSDT, payload1);
      return response;
    },
    *cancel({ payload }, { call, put }) {
      const match = pathToRegexp('/entry/entryOmni/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(fakeEntryCancelUSDT, payload1);
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
