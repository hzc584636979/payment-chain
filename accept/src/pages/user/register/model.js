import { fakeGetCode, fakeNextPhoneStep2, fakePhoneRegister, fakeNextEmailStep2, fakeEmailRegister } from '@/services/api';

const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *getCode({ payload }, { call, put }) {
      const response = yield call(fakeGetCode, payload);
      return response;
    },
    *nextPhoneStep2({ payload }, { call, put }) {
      const response = yield call(fakeNextPhoneStep2, payload);
      return response;
    },
    *phoneSubmit({ payload }, { call, put }) {
      const response = yield call(fakePhoneRegister, payload);
      return response;
    },
    *nextEmailStep2({ payload }, { call, put }) {
      const response = yield call(fakeNextEmailStep2, payload);
      return response;
    },
    *emailSubmit({ payload }, { call, put }) {
      const response = yield call(fakeEmailRegister, payload);
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
