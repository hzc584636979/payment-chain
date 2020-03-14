import { 
  queryAcceptSellDissentOrderDetail,
  acceptSellDissentOrderToAccept,
  acceptSellDissentOrderToMerchant,
  acceptSellDissentOrderClose,
  acceptSellDissentOrderPunishAccept,
  acceptSellDissentOrderPunishMerchant,
  acceptSellDissentOrderCompromise, 
} from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'acceptSellDissentOrderDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(queryAcceptSellDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *toAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(acceptSellDissentOrderToAccept, payload1);
      return response;
    },
    *toMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(acceptSellDissentOrderToMerchant, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(acceptSellDissentOrderClose, payload1);
      return response;
    },
    *punishAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(acceptSellDissentOrderPunishAccept, payload1);
      return response;
    },
    *punishMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(acceptSellDissentOrderPunishMerchant, payload1);
      return response;
    },
    *compromise({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(acceptSellDissentOrderCompromise, payload1);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return action.payload;
    },
  },
};
export default Model;
