import { userBaseGetPhoneCode, userBaseGetEmailCode, userBaseSubmit } from '@/services/api';

const Model = {
  namespace: 'userBase',
  state: {
    
  },
  effects: {
    *getPhoneCode({ payload }, { call, put }) {
      const response = yield call(userBaseGetPhoneCode, payload);
      return response;
    },
    *getEmailCode({ payload }, { call, put }) {
      const response = yield call(userBaseGetEmailCode, payload);
      return response;
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(userBaseSubmit, payload);
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
