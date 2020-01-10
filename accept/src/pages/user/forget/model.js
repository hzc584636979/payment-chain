import { forgetPhoneCode, forgetNextPhoneStep2, phoneForget, forgetEmailCode, forgetNextEmailStep2, emailForget } from '@/services/api';

const Model = {
  namespace: 'userForget',
  state: {
    status: undefined,
  },
  effects: {
    *getPhoneCode({ payload }, { call, put }) {
      const response = yield call(forgetPhoneCode, payload);
      console.log(response)
      return response;
    },
    *nextPhoneStep2({ payload }, { call, put }) {
      const response = yield call(forgetNextPhoneStep2, payload);
      return response;
    },
    *phoneSubmit({ payload }, { call, put }) {
      const response = yield call(phoneForget, payload);
      return response;
    },
    *getEmailCode({ payload }, { call, put }) {
      const response = yield call(forgetEmailCode, payload);
      return response;
    },
    *nextEmailStep2({ payload }, { call, put }) {
      const response = yield call(forgetNextEmailStep2, payload);
      return response;
    },
    *emailSubmit({ payload }, { call, put }) {
      const response = yield call(emailForget, payload);
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
