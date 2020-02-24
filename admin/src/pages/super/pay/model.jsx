import {  } from '@/services/api';

const Model = {
  namespace: 'centerWalletPay',
  state: {
    
  },
  effects: {

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
