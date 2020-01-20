import { fakeHomeEntryErc20 } from '@/services/api';

const Model = {
  namespace: 'entryErc20',
  state: {

  },
  effects: {
    *entry({ payload }, { call, put }) {
      const response = yield call(fakeHomeEntryErc20, payload);
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
