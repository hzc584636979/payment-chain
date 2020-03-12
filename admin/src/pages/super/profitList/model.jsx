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
      let { 
        rows = [
          {
            remark: '1',
            address: '1',
            ratio: '2300'
          },
          {
            remark: '2',
            address: '2',
            ratio: '1200'
          },
          {
            remark: '3',
            address: '3',
            ratio: '100'
          },
          {
            remark: '4',
            address: '4',
            ratio: '40'
          },
          {
            remark: '5',
            address: '5',
            ratio: '60'
          }
        ],
        count 
      } = response.data || {};
      let newRows = []; 
      rows.map(v => {
        newRows.push({...v, ratio: Number(v.ratio)})
      })
      console.log(newRows)
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
