import { financeSettingsBank, financeSettingsBankCode, financeSettingsBankSubmit } from '@/services/api';

const Model = {
  namespace: 'financeSettingsBank',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(financeSettingsBank, payload);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response.data;
    },
    *getCode({ payload }, { call, put }) {
      const response = yield call(financeSettingsBankCode, payload);
      return response;
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(financeSettingsBankSubmit, payload);
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
