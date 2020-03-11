import { getWalletList } from '@/services/api';

const Model = {
  namespace: 'centerWalletPay',
  state: {
    address: null
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getWalletList, payload);
      yield put({
        type: 'save',
        payload: {
          erc20: response.data.ethAccount.centerAccount.address,
          omni: response.data.omniAccount.centerAccount.address,
        },
      });
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
        address: action.payload
      };
    },
    clearData(state, action) {
      return {
        address: null
      };
    }
  },
};
export default Model;
