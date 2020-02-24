import { coldwalletGasList } from '@/services/api';


const Model = {
  namespace: 'coldwalletGasList',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(coldwalletGasList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
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
