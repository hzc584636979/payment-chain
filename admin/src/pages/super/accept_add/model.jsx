import { superAcceptMember, superAcceptMemberSearchAll, superAcceptMemberAdd, superAcceptMemberDelete } from '@/services/api';
import pathToRegexp from 'path-to-regexp';
import { getPageQuery } from '@/utils/utils';

const match = pathToRegexp('/super/accept_add/:id').exec(window.location.pathname);
const parent_name = getPageQuery(window.location).parent_name;

const Model = {
  namespace: 'superAcceptMember',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select, call, put }) {
      let response = yield call(superAcceptMember, { ...payload });
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
    *add({ payload }, { call, put }) {
      const response = yield call(superAcceptMemberAdd, { ...payload, parent_id: match[1], parent_name: parent_name });
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(superAcceptMemberDelete, { ...payload });
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
