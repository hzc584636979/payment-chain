import { buyOrder, buyOrderSearchAll, buyOrderTakeOrder, buyOrderReceipt, buyOrderChangeOrder } from '@/services/api';

const Model = {
  namespace: 'buyOrder',
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
      const his = yield select(state => state.buyOrder.data.history);
      if(window.location.href.indexOf('?history') > -1 && Object.keys(his).length != 0){
        payload = { ...his, page: his.page || payload.page, pageSize: his.pageSize || payload.pageSize };
        response = yield call(buyOrderSearchAll, payload);
      }else{
        response = yield call(buyOrder, payload);
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
      const response = yield call(buyOrderSearchAll, payload);
      let { rows, count } = response.data || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: rows, pagination: { total: count, current: page+1, pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *transfer({ payload }, { call, put }) {
      const response = yield call(buyOrderTakeOrder, payload);
      return response;
    },
    *changeTransfer({ payload }, { call, put }) {
      const response = yield call(buyOrderChangeOrder, payload);
      return response;
    },
    *receipt({ payload }, { call, put }) {
      const response = yield call(buyOrderReceipt, payload);
      return response;
    },
    *receiptFromMerchant({ payload }, { call, put }) {
      const response = yield call(buyOrderReceipt, payload);
      return response;
    },
    *export({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(buyOrderSearchAll, payload);
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
