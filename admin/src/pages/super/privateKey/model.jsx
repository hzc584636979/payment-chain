import { privateKeySubmit, getPhoneVerifyCode } from '@/services/api';

const Model = {
  namespace: 'privateKey',
  state: {
    
  },
  effects: {
    *submit({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(privateKeySubmit, { ...payload, telephone_number });
      return response;
    },
    *getCaptcha({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(getPhoneVerifyCode, { ...payload, telephone_number });
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
