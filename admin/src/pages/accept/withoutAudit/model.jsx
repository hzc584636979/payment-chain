import { superAcceptMember, superAcceptMemberSearchAll, acceptWithoutAudit } from '@/services/api';
import pathToRegexp from 'path-to-regexp';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'withoutAudit',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select, call, put }) {
      let response = yield call(superAcceptMember, { ...payload  });
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { select, call, put }) {
      const response = yield call(superAcceptMemberSearchAll, { ...payload });
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *modify({ payload }, { select, call, put }) {
      const response = yield call(acceptWithoutAudit, { ...payload });
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
