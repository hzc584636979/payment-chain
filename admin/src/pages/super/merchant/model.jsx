import { superMerchant, superMerchantSearchAll, superMerchantAdd, superMerchantDelete, superMerchantModify } from '@/services/api';

const Model = {
  namespace: 'superMerchant',
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
      const his = yield select(state => state.superMerchant.data.history);
      if(window.location.href.indexOf('?history') > -1 && Object.keys(his).length != 0){
        payload = { ...his, page: his.page || payload.page, pageSize: his.pageSize || payload.pageSize };
        response = yield call(superMerchantSearchAll, payload);
      }else{
        response = yield call(superMerchant, payload);
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
      const response = yield call(superMerchantSearchAll, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(superMerchantAdd, payload);
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(superMerchantDelete, payload);
      return response;
    },
    *modify({ payload }, { call, put }) {
      const response = yield call(superMerchantModify, payload);
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
