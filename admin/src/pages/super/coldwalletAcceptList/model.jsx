import { coldwalletAcceptList } from '@/services/api';


const Model = {
  namespace: 'coldwalletAcceptList',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(coldwalletAcceptList, payload);
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
