import { 
  userSafeGetPhoneCode, 
  userSafeGetEmailCode, 
  userSafeRevisePhone, 
  userSafeReviseEmail, 
  userSafeReviseTP, 
  userSafeForgetTP,
  userSafeReviseLP,
  userSafeResetMD5, 
  userSafeIP,
  userSafeModifyLogo,
} from '@/services/api';

const Model = {
  namespace: 'userSafe',
  state: {
    data: {},
  },
  effects: {
    *modifyLogo({ payload }, { call, put }) {
      const response = yield call(userSafeModifyLogo, payload);
      return response;
    },
    *getPhoneCode({ payload }, { call, put }) {
      const response = yield call(userSafeGetPhoneCode, payload);
      return response;
    },
    *revisePhone({ payload }, { call, put }) {
      const response = yield call(userSafeRevisePhone, payload);
      return response;
    },
    *getEmailCode({ payload }, { call, put }) {
      const response = yield call(userSafeGetEmailCode, payload);
      return response;
    },
    *reviseEmail({ payload }, { call, put }) {
      const response = yield call(userSafeReviseEmail, payload);
      return response;
    },
    *reviseTP({ payload }, { call, put }) {
      const response = yield call(userSafeReviseTP, payload);
      return response;
    },
    *forgetTP({ payload }, { call, put }) {
      const response = yield call(userSafeForgetTP, payload);
      return response;
    },
    *reviseLP({ payload }, { call, put }) {
      const response = yield call(userSafeReviseLP, payload);
      return response;
    },
    *resetMD5({ payload }, { call, put }) {
      const response = yield call(userSafeResetMD5, payload);
      return response;
    },
    *IP({ payload }, { call, put }) {
      const response = yield call(userSafeIP, payload);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
export default Model;
