import { privateKeySubmit, getPhoneVerifyCode } from '@/services/api';

const Model = {
  namespace: 'privateKey',
  state: {
    
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(systemNewsSubmit, payload);
      return response;
    },
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(getPhoneVerifyCode, payload);
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
