import { superMerchantMember, superMerchantMemberSearchAll, superMerchantMemberAdd, superMerchantMemberDelete } from '@/services/api';
import pathToRegexp from 'path-to-regexp';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'superMerchantMember',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select, call, put }) {
      let response = yield call(superMerchantMember, { ...payload });
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
      const response = yield call(superMerchantMemberSearchAll, { ...payload });
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
      const match = pathToRegexp('/super/merchant_add/:id').exec(window.location.pathname);
      const parent_name = getPageQuery(window.location).parent_name;
      const response = yield call(superMerchantMemberAdd, { ...payload, parent_id: match[1], parent_name: parent_name });
      return response;
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(superMerchantMemberDelete, { ...payload });
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
