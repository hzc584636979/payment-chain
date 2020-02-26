import { systemMessageDetail, systemMessageDelete } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'systemMessageDetail',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/system/message_detail/:id').exec(window.location.pathname);
      const payload1 = { message_id: match[1] };
      const response = yield call(systemMessageDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(systemMessageDelete, payload);
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
