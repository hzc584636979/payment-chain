import { 
  queryMerchantSellDissentOrderDetail,
  merchantSellDissentOrderToAccept,
  merchantSellDissentOrderToMerchant,
  merchantSellDissentOrderClose,
  merchantSellDissentOrderPunishAccept,
  merchantSellDissentOrderPunishMerchant,
  merchantSellDissentOrderCompromise,   
} from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'merchantSellDissentOrderDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(queryMerchantSellDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *toAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(merchantSellDissentOrderToAccept, payload1);
      return response;
    },
    *toMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(merchantSellDissentOrderToMerchant, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(merchantSellDissentOrderClose, payload1);
      return response;
    },
    *punishAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 1 };
      const response = yield call(merchantSellDissentOrderPunishAccept, payload1);
      return response;
    },
    *punishMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 1 };
      const response = yield call(merchantSellDissentOrderPunishMerchant, payload1);
      return response;
    },
    *compromise({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/sellDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(merchantSellDissentOrderCompromise, payload1);
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
