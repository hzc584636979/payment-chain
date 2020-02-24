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

      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
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
