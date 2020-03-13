import { profitList, profitListModify } from '@/services/api';

const Model = {
  namespace: 'profitList',
  state: {
    data: {
      list: [],
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const response = yield call(profitList, payload);
      let rows = response.data || {};
      let newRows = []; 
      rows && rows.length > 0 && rows.map(v => {
        newRows.push({...v, ratio: Number(v.ratio)})
      })
      const responseResult = { list: newRows };
      yield put({
        type: 'save',
        payload: responseResult,
      });
      return responseResult;
    },
    *modify({ payload }, { call, put }) {
      const response = yield call(profitListModify, payload);
      return response;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
export default Model;
