import { fakeSellDissentOrder, fakeSellDissentOrderSearchAll, fakeSellDissentOrderReceipt } from '@/services/api';

const Model = {
  namespace: 'sellDissentOrder',
  state: {
    data: {
      list: [
        {
          _id: 0,
          time: 1,
          internalOrder: 1,
          externalOrder: 1,
          payName: 1,
          way: 1,
          customerNickname: 1,
          account: 1,
          status: 1,
        }
      ],
      pagination: {
        total: 500,
        current: 1,
        pageSize: 10
      },
      history: {},
    },
  },
  effects: {
    *fetch({ payload }, { select,call, put }) {
      let response = {};
      if(window.location.hash === "/dissentOrder/sellOrder?history"){
        const his = yield select(state => state.sellDissentOrder.data.history);
        payload = {};
        payload = { ...his };
        response = yield call(fakeSellDissentOrderSearchAll, payload);
      }else{
        response = yield call(fakeSellDissentOrder, payload);
      }
      let { data, total } = response.result || {};
      let page = payload && payload.page;
      let pageSize = payload && payload.pageSize;
      const responseResult = { list: data, pagination: { total, current: page+1, pageSize: pageSize }, history: {...payload} };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(fakeSellDissentOrderSearchAll, payload);
      let { data, total } = response.result || {};
      let responseResult ={ list: data, pagination: { total, current: payload.page+1, pageSize: payload.pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *receipt({ payload }, { call, put }) {
      const response = yield call(fakeSellDissentOrderReceipt, payload);
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
