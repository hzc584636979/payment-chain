import { messageContent } from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'messageDetail',
  state: {
    data: '',
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/Message/detail/:id').exec(window.location.pathname);
      const payload1 = { message_id: match[1] };
      const response = yield call(messageContent, payload1);
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
        data: action.payload,
      };
    },
  },
};
export default Model;
