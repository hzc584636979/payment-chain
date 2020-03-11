import { profitList, profitListAdd, profitListDelete, profitListModify } from '@/services/api';

const Model = {
  namespace: 'profitList',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const response = yield call(profitList, payload);
      let { 
        rows = [
          {
            id: 1,
            user_name: '1',
            address: '1',
            profit: '0.01'
          },
          {
            id: 2,
            user_name: '2',
            address: '2',
            profit: '0.01'
          },
          {
            id: 3,
            user_name: '3',
            address: '3',
            profit: '0.01'
          },
          {
            id: 4,
            user_name: '4',
            address: '4',
            profit: '0.01'
          },
          {
            id: 5,
            user_name: '5',
            address: '5',
            profit: '0.01'
          }
        ],
        count 
      } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      let newRows = []; 
      rows.map(v => {
        newRows.push({...v, profit: Number(v.profit)})
      })
      console.log(newRows)
      const responseResult = { list: newRows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(profitListAdd, payload);
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(profitListDelete, payload);
      return response;
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
