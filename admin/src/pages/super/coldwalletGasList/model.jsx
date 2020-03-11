import { getWalletList, getPhoneVerifyCode, superWalletModify } from '@/services/api';


const Model = {
  namespace: 'coldwalletGasList',
  state: {
    wallet: null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getWalletList, payload);
      yield put({
        type: 'save',
        payload: {
          erc20: response.data.ethAccount.gasAccount,
          omni: response.data.omniAccount.gasAccount,
        },
      });
    },
    *getCaptcha({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(getPhoneVerifyCode, { ...payload, telephone_number });
      return response;
    },
    *modify({ payload }, { call, put, select }) {
      const telephone_number = yield select(state => state.user.currentUser.telephone_number);
      const response = yield call(superWalletModify, { ...payload, telephone_number });
      return response;
    },
    *clear({ payload }, { call, put }) {
      yield put({
        type: 'clearData',
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        wallet: action.payload,
      };
    },
    clearData(state, action) {
      return {
        wallet: null
      };
    }
  },
};
export default Model;
