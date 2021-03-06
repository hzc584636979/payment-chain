import { profitChart } from '@/services/api';
import moment from 'moment';

const Model = {
  namespace: 'profitChart',
  state: {
    data: {
      list: [],
      history: {},
      total_gas: 0,
      total_profit: 0,
      total_share: 0,
    },
  },
  effects: {
    *fetch({ payload }, { select, call, put }) {
      let begin_time = moment(payload.time).startOf('month').local().format('x');
      let end_time = moment(payload.time).endOf('month').local().format('x');
      const response = yield call(profitChart, {...payload, begin_time, end_time});
      const responseResult = { ...response.data, history: { ...payload } };
      yield put({
        type: 'save',
        payload: responseResult,
      });
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
