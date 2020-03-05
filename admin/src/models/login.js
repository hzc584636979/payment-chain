import { stringify } from 'querystring';
import router from 'umi/router';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { loginOut } from '@/services/api';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *logout({ payload }, { call, put }) {
      const response = yield call(loginOut);
      yield put({
        type: 'changeLoginStatus',
        payload: {},
      });

      if (window.location.pathname !== '/user/login') {
        router.replace({
          pathname: '/user/login',
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('guest');
      g_setLocalStorage(null);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
