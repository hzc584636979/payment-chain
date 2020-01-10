import { financeSettingsAlipay, financeSettingsAlipayCode, financeSettingsAlipaySubmit } from '@/services/api';

const Model = {
  namespace: 'financeSettingsAlipay',
  state: {
    data: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(financeSettingsAlipay, payload);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response.data;
    },
    *getCode({ payload }, { call, put }) {
      const response = yield call(financeSettingsAlipayCode, payload);
      return response;
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(financeSettingsAlipaySubmit, payload);
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
