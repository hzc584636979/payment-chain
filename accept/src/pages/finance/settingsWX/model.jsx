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
    *getCode({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(financeSettingsWXCode, {...payload, telephone_number});
      return response;
    },
    *submit({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(financeSettingsWXSubmit, {...payload, telephone_number});
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
