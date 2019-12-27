import { fakebuyOrder, fakeBuyOrderSearchAll, fakeBuyOrderReceipt } from '@/services/api';

const Model = {
  namespace: 'buyOrder',
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
      if(window.location.hash === "/order/sellOrder?history"){
        const his = yield select(state => state.sellOrder.data.history);
        payload = {};
        payload = { ...his };
        response = yield call(fakeBuyOrderSearchAll, payload);
      }else{
        response = yield call(fakebuyOrder, payload);
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
      const response = yield call(fakeBuyOrderSearchAll, payload);
      let { data, total } = response.result || {};
      let responseResult ={ list: data, pagination: { total, current: payload.page+1, pageSize: payload.pageSize }, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
    },
    *receipt({ payload }, { call, put }) {
      const response = yield call(fakeBuyOrderReceipt, payload);
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
