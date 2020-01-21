import { routerRedux } from 'dva/router';
import { phoneAccountLogin, emailAccountLogin } from '@/services/api';
import { getPageQuery, setAuthority } from './utils/utils';
import { notification } from 'antd';

const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
  },
  effects: {
    *phoneLogin({ payload }, { call, put }) {
      const response = yield call(phoneAccountLogin, payload);

      if (response.status == 1 && response) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put({
          type: 'changeLoginStatus',
          payload: response.data ? {
            ...response.data.accountInfo,
            ...response.data.userInfo,
            gas: response.data.walletInfo[0].gas,
            walletInfo: response.data.walletInfo,
            erc20: response.data.walletInfo[0],
            omni: response.data.walletInfo[1],
          } : null,
        });

        yield put(routerRedux.replace(redirect || '/'));
      }else {
        /*notification.error({
          message: `登录失败，请重试`,
          description: response.msg,
        });*/
      }

      return response;
    },
    *emailLogin({ payload }, { call, put }) {
      const response = yield call(emailAccountLogin, payload);
      
      if (response.status == 1) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put({
          type: 'changeLoginStatus',
          payload: response.data ? {
            ...response.data.accountInfo,
            ...response.data.userInfo,
            walletInfo: response.data.walletInfo,
            erc20: response.data.walletInfo[0],
            omni: response.data.walletInfo[1],
          } : null,
        });
        
        yield put(routerRedux.replace(redirect || '/'));
      }else {
        /*notification.error({
          message: `登录失败，请重试`,
          description: response.msg,
        });*/
      }

      return response;
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      g_setLocalStorage(payload);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
