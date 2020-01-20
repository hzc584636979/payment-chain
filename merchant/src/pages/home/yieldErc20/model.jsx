import { homeYieldErc20 } from '@/services/api';

const Model = {
  namespace: 'yieldErc20',
  state: {

  },
  effects: {
    *yield({ payload }, { call, put }) {
      const response = yield call(homeYieldErc20, payload);
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default Model;
