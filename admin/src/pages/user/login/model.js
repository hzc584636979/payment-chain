import { routerRedux } from 'dva/router';
import { phoneAccountLogin, getPhoneVerifyCode } from '@/services/api';
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
          payload: response.data || null,
        });

        yield put(routerRedux.replace('/'));
      }else {
        /*notification.error({
          message: `登录失败，请重试`,
          description: response.msg,
        });*/
      }

      return response;
    },
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(getPhoneVerifyCode, payload);
      return response;
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      let authority = ['user'];
      if(payload.type == 1) {
        authority.push('super');
      }else if(payload.type == 2) {
        authority.push('accept');
      }else if(payload.type == 3) {
        authority.push('merchant');
      }
      setAuthority(authority);
      g_setLocalStorage(payload);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
