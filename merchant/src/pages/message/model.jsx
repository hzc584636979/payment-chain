import { messageData } from '@/services/api';

const Model = {
  namespace: 'message',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      if(window.location.href.indexOf('?history') > -1){
        const his = yield select(state => state.message.data.history);
        payload = { ...his, page: his.page || payload.page, pageSize: his.pageSize || payload.pageSize };
      }
      
      const response = yield call(messageData, payload);
      
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { call, put, select }) {
      const response = yield call(messageData, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
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
