import { financeSettingsWX, financeSettingsWXCode, financeSettingsWXSubmit } from '@/services/api';

const Model = {
  namespace: 'financeSettingsWX',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(financeSettingsWX, payload);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response.data;
    },
    *getCode({ payload }, { call, put }) {
      const response = yield call(financeSettingsWXCode, payload);
      return response;
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(financeSettingsWXSubmit, payload);
      yield put({
        type: 'save',
        payload: response,
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
