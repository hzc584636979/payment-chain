import { getWalletList, coldwalletGasAdd, coldwalletGasDelete, coldwalletGasBanlance } from '@/services/api';


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
    *getBanlance({ payload }, { call, put }) {
      const response = yield call(coldwalletGasBanlance, payload);
      yield put({
        type: 'saveBanlance',
        payload: {
          data: response.data,
          token_id: payload.token_id
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
      let { data, token_id } = action.payload;
      let newData = {};
      let list = token_id == -1 ? JSON.parse(JSON.stringify(state.data.erc20)) : JSON.parse(JSON.stringify(state.data.omni));
      if(token_id == -1) {
        list.map((v, i) => {
          if(v.address == data.address) {
            list[v].banlance = data.banlance;
          }
        })
        newData = {
          erc20: list
        }
      }else {
        list.map((v, i) => {
          if(v.address == data.address) {
            list[v].banlance = data.banlance;
          }
        })
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
