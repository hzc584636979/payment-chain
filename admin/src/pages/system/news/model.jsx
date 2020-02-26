import { systemNewsSubmit } from '@/services/api';

const Model = {
  namespace: 'systemNews',
  state: {
    
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(systemNewsSubmit, payload);
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
