import { getPhoneCode, nextPhoneStep2, phoneRegister, getEmailCode, nextEmailStep2, emailRegister } from '@/services/api';

const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *getPhoneCode({ payload }, { call, put }) {
      const response = yield call(getPhoneCode, payload);
      return response;
    },
    *nextPhoneStep2({ payload }, { call, put }) {
      const response = yield call(nextPhoneStep2, payload);
      return response;
    },
    *phoneSubmit({ payload }, { call, put }) {
      const response = yield call(phoneRegister, payload);
      return response;
    },
    *getEmailCode({ payload }, { call, put }) {
      const response = yield call(getEmailCode, payload);
      return response;
    },
    *nextEmailStep2({ payload }, { call, put }) {
      const response = yield call(nextEmailStep2, payload);
      return response;
    },
    *emailSubmit({ payload }, { call, put }) {
      const response = yield call(emailRegister, payload);
      return response;
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
