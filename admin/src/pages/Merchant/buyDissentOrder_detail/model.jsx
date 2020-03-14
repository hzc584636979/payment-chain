import { 
  queryMerchantBuyDissentOrderDetail,
  merchantBuyDissentOrderToAccept,
  merchantBuyDissentOrderToMerchant,
  merchantBuyDissentOrderClose,
  merchantBuyDissentOrderPunishAccept,
  merchantBuyDissentOrderPunishMerchant,
  merchantBuyDissentOrderCompromise,  
} from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'merchantBuyDissentOrderDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(queryMerchantBuyDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
      return response;
    },
    *toAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(merchantBuyDissentOrderToAccept, payload1);
      return response;
    },
    *toMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(merchantBuyDissentOrderToMerchant, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(merchantBuyDissentOrderClose, payload1);
      return response;
    },
    *punishAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(merchantBuyDissentOrderPunishAccept, payload1);
      return response;
    },
    *punishMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 2 };
      const response = yield call(merchantBuyDissentOrderPunishMerchant, payload1);
      return response;
    },
    *compromise({ payload }, { call, put }) {
      const match = pathToRegexp('/Merchant/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 2 };
      const response = yield call(merchantBuyDissentOrderCompromise, payload1);
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
