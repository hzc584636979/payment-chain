import { queryCallbackDetail } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'callbackDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/callback/callbackList_detail/:id').exec(window.location.pathname);
      const payload1 = { id: match[1] };
      const response = yield call(queryCallbackDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
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
