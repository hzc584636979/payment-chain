import { 
  queryMerchantBuyDissentOrderDetail,
  merchantBuyDissentOrderToAccept,
  merchantBuyDissentOrderToMerchant,
  merchantBuyDissentOrderClose 
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
        payload: response.data,
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
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Model;
