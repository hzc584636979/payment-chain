import { goldYieldDissentOrder, goldYieldDissentOrderSearchAll } from '@/services/api';

const Model = {
  namespace: 'goldYieldDissentOrder',
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
      const his = yield select(state => state.goldYieldDissentOrder.data.history);
      if(window.location.href.indexOf('?history') > -1 && Object.keys(his).length != 0){
        payload = { ...his, page: his.page || payload.page, pageSize: his.pageSize || payload.pageSize };
        response = yield call(goldYieldDissentOrderSearchAll, payload);
      }else{
        response = yield call(goldYieldDissentOrder, payload);
      }
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(goldYieldDissentOrderSearchAll, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *export({ payload }, { call, put }) {
      const response = yield call(goldYieldDissentOrderSearchAll, payload);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
export default Model;
