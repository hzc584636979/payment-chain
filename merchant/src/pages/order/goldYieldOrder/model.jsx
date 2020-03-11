import {
  goldYieldOrder,
  goldYieldOrderSearchAll,
  goldYieldOrderYield,
  goldYieldOrderWithdrawOrder,
  goldYieldOrderAuditOrder,
  goldYieldOrderNoTransfer,
} from '@/services/api';

const Model = {
  namespace: 'goldYieldOrder',
  state: {
    data: {
      list: [],
      pagination: {},
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select, call, put }) {
      let response = {};
      const his = yield select(state => state.goldYieldOrder.data.history);
      if (window.location.href.indexOf('?history') > -1 && Object.keys(his).length != 0) {
        payload = {
          ...his,
          page: his.page || payload.page,
          pageSize: his.pageSize || payload.pageSize,
        };
        response = yield call(goldYieldOrderSearchAll, payload);
      } else {
        response = yield call(goldYieldOrder, payload);
      }
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = {
        list: rows,
        pagination: { total: count, current: page + 1, pageSize },
        history: { ...payload },
      };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderSearchAll, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = {
        list: rows,
        pagination: { total: count, current: page + 1, pageSize },
        history: { ...payload },
      };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *export({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderSearchAll, payload);
      return response;
    },
    *yieldOrder({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(goldYieldOrderYield, payload);
      return response;
    },
    *withdrawOrder({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderWithdrawOrder, payload);
      return response;
    },
    *auditOrder({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderAuditOrder, payload);
      return response;
    },
    *noTransfer({ payload }, { call, put }) {
      const response = yield call(goldYieldOrderNoTransfer, payload);
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
