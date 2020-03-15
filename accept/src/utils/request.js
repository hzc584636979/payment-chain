/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { JSEncrypt } from 'jsencrypt';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '服务器异常，请重新登陆稍后再试。',
};

// let decrypt = new JSEncrypt();
// const public1 = await Common.readFile("/Users/lijiachai/Documents/dinglian/accpectment/app/public/rsa_1024_priv.pem");
// decrypt.setPrivateKey(public1);
// let uncrypted = decrypt.decrypt(data);
// return uncrypted;
const publicKey = 
`-----BEGIN RSA PUBLIC KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
-----END RSA PUBLIC KEY----- `;

const encrypt = new JSEncrypt();

/**
 * 异常处理程序
 */
let loginOutStatus = false;
const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
    if(status == 504 && !loginOutStatus) {
      loginOutStatus = true;
      window.g_app._store.dispatch({
        type: 'login/logout',
      }).then(data => {
        setTimeout(() => {
          loginOutStatus = false;
        }, 1000) 
      })
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,// 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => {
  const user_id = g_getLocalStorage() ? {user_id: g_getLocalStorage().id} : {};

  return {
    url,
    options: { 
      ...options,
      headers: {
        ...options.headers,
        token: g_getLocalStorage() ? (g_getLocalStorage().token || '') : '',
      },
      data: {
        ...(options.data || {}),
        ...user_id,
      }
    },
  };
});

request.interceptors.response.use(async (response) => {
  if(response.status == 200) {
    const data = await response.clone().json();
    if(data.status == 50012 || data.status == 50008) {//登陆过期拦截
      notification.error({
        message: data.msg,
      });
      if(!loginOutStatus) {
        loginOutStatus = true;
        window.g_app._store.dispatch({
          type: 'login/logout',
        }).then(data => {
          setTimeout(() => {
            loginOutStatus = false;
          }, 1000) 
        })
      }
    }
    /*if(response.url == 'http://localhost:8000/server/api/xxx') {
      encrypt.setPublicKey(publicKey);
      let newdata= encrypt.encrypt(data); 
      console.info(newdata);
    }
    return data;*/
  }
  return response;
})

export default request;
