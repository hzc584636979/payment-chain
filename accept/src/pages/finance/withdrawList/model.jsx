import { withdrawList, withdrawListSearchAll } from '@/services/api';

const Model = {
  namespace: 'withdrawList',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      let response = {};
      if(window.location.href.indexOf('?history') > -1){
        const his = yield select(state => state.withdrawList.data.history);
        payload = { ...his, page: his.page || payload.page, pageSize: his.pageSize || payload.pageSize };
        response = yield call(withdrawListSearchAll, payload);
      }else{
        response = yield call(withdrawList, payload);
      }
      let { list, total } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list, pagination: { total, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(withdrawListSearchAll, payload);
      let { list, total } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list, pagination: { total, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *export({ payload }, { call, put }) {
      const response = yield call(withdrawListSearchAll, payload);
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
