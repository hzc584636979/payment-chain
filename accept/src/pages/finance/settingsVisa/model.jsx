import { financeSettingsVisa, financeSettingsVisaCode, financeSettingsVisaSubmit } from '@/services/api';

const Model = {
  namespace: 'financeSettingsVisa',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(financeSettingsVisa, payload);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response.data;
    },
    *getCode({ payload }, { call, put }) {
      const response = yield call(financeSettingsVisaCode, payload);
      return response;
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(financeSettingsVisaSubmit, payload);
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
