import { getWalletList, coldwalletGasAdd, coldwalletGasDelete, coldwalletGasBalance } from '@/services/api';


const Model = {
  namespace: 'coldwalletGasList',
  state: {
    data: {
      
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const response = yield call(getWalletList, payload);
      yield put({
        type: 'save',
        payload: {
          erc20: response.data.ethAccount.gasAccount,
          omni: response.data.omniAccount.gasAccount,
        },
      });
      return {
        erc20: response.data.ethAccount.gasAccount,
        omni: response.data.omniAccount.gasAccount,
      };
    },
    *getBalance({ payload }, { call, put }) {
      const response = yield call(coldwalletGasBalance, payload);
      yield put({
        type: 'saveBanlance',
        payload: {
          data: response.data,
          ...payload,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(coldwalletGasAdd, payload);
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(coldwalletGasDelete, payload);
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
    saveBanlance(state, action) {
      let { data, token_id, index } = action.payload;
      let newData = {};
      let list = token_id == -1 ? JSON.parse(JSON.stringify(state.data.erc20)) : JSON.parse(JSON.stringify(state.data.omni));
      if(token_id == -1) {
        list[index].balance = data.balance
        console.log(list)
        newData = {
          erc20: list
        }
      }else {
        list[index].balance = data.balance
        newData = {
          omni: list
        }
      }
      return {
        ...state,
        data: {
          ...state.data,
          ...newData
        }
      };
    },
  },
};
export default Model;
