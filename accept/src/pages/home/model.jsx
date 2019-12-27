import { fakeHomeData } from '@/services/api';

const Model = {
  namespace: 'home',
  state: {

  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeHomeData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
