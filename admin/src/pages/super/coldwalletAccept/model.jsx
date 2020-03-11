import { coldwalletAccept, coldwalletAcceptSearchAll } from '@/services/api';
import pathToRegexp from 'path-to-regexp';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'coldwalletAccept',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      const match = pathToRegexp('/super/coldwallet/coldwalletAccept/:id').exec(window.location.pathname);
      const address = getPageQuery(window.location).address;
      const payload1 = { ...payload, token_id: match[1], address };
      const response = yield call(coldwalletAccept, payload1);
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
      const match = pathToRegexp('/super/coldwallet/coldwalletAccept/:id').exec(window.location.pathname);
      const address = getPageQuery(window.location).address;
      const payload1 = { ...payload, token_id: match[1], address };
      const response = yield call(coldwalletAcceptSearchAll, payload1);
      let { list, total } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list, pagination: { total, current: page+1, pageSize }, history: { ...payload } };
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
