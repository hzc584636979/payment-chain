import { 
  queryAcceptBuyDissentOrderDetail,
  acceptBuyDissentOrderToAccept,
  acceptBuyDissentOrderToMerchant,
  acceptBuyDissentOrderClose,
  acceptBuyDissentOrderPunishAccept,
  acceptBuyDissentOrderPunishMerchant,
  acceptBuyDissentOrderCompromise,  
} from '@/services/api';
import pathToRegexp from 'path-to-regexp';

const Model = {
  namespace: 'acceptBuyDissentOrderDetail',
  state: {
    
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(queryAcceptBuyDissentOrderDetail, payload1);
      yield put({
        type: 'save',
        payload: response.data,
      });
      return response;
    },
    *toAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(acceptBuyDissentOrderToAccept, payload1);
      return response;
    },
    *toMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(acceptBuyDissentOrderToMerchant, payload1);
      return response;
    },
    *close({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(acceptBuyDissentOrderClose, payload1);
      return response;
    },
    *punishAccept({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 1 };
      const response = yield call(acceptBuyDissentOrderPunishAccept, payload1);
      return response;
    },
    *punishMerchant({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { ...payload, order_id: match[1], order_type: 1 };
      const response = yield call(acceptBuyDissentOrderPunishMerchant, payload1);
      return response;
    },
    *compromise({ payload }, { call, put }) {
      const match = pathToRegexp('/accept/buyDissentOrder_detail/:id').exec(window.location.pathname);
      const payload1 = { order_id: match[1], order_type: 1 };
      const response = yield call(acceptBuyDissentOrderCompromise, payload1);
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
