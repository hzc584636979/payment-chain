import { financeSettingsPaypal, financeSettingsPaypalCode, financeSettingsPaypalSubmit } from '@/services/api';

const Model = {
  namespace: 'financeSettingsPaypal',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(financeSettingsPaypal, payload);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response.data;
    },
    *getCode({ payload }, { call, put }) {
      const response = yield call(financeSettingsPaypalCode, payload);
      return response;
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(financeSettingsPaypalSubmit, payload);
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
