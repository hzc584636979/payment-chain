/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { JSEncrypt } from 'encryptlong';
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

const privLongkey = 
`-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCrOrIgkdMo82Tx1Y+NoHEevlJp7Obkuj8DSlvFWGH3xvaJEo6/
i2eGrMdTcIEP9OVsjcPhvXT7VKBhFkkRnTlXc5rpMcgBWYF2OAxeWo7x2h/3Yl4w
Y0Ndr4y0mAAPoaP7Ysfho9vndMYXzrlP4ATvRNEbYK8aPGWSRwic2LGedQIDAQAB
AoGARIlh8xdrZeDGbuYEZ7Pok12qrytb4AGMZ0zEHuGZlQvWclczPAgYkBdoUUWe
4zwq+KBl311uDYt6BmJdLOe5o1fO/POGyjugLEQJ1XPcLAIuDZV8y7RWAwcWdXpw
o3hRSdnbuRQkEn89ONJA6ZLNTG1xaOjtVZldBThkY7475aECQQDSOLeoYChTHa8U
Ib4eKKaTet1o63UtQFA3hoRuzAneAoyprrD0ZRAoPbthbtGtkPaCUUjjASOYU2ZD
gmOO6zwXAkEA0IRDx/u9NSG6w4PyKBW5c9QueRLYthy+pNLFlUYn32DEaoDDipBO
U8vQrp7uHe5RqF24eE9GmZVs/tMBwMLVUwJAU+ZnBkA6V9HFClfdNNQshzfGHhW7
EnBUk5SQTlgIqB6EXURnQ2MCa80Xd+9up8LvX1tpp4/Q0P6YFeF4MpYXyQJANHwW
U5AZ3/XNfMkJeu188JrH19HWmoBBvFsRQLGX97HzvpsKnSYVkSIMNOfsJ7yE8Uwl
0qKhsqbZ+IpENrDT4QJAV0KDiI3HJktnuqdoa4cNQy0Syax5TrpWdhEwYQ17w4X6
89QA4rIe/ytpWZO6XLNGrz+9zmuc+5kVQO+ikhrTdw==
-----END RSA PRIVATE KEY-----`;

let decryptLongor = new JSEncrypt();
decryptLongor.setPrivateKey(privLongkey);
function rsaDecryptLong(content) {
  try {
    //console.log(`原始数据:${content.data}`)
    let decryptLonData = decryptLongor.decryptLong(content.data);
    let decodedata = decodeURI(decryptLonData);
    //console.log(decodedata)
    let newdata = JSON.parse(decodedata);
    //console.log(newdata)
    let decrypted = {
      ...content,
      data: newdata
    };
    return decrypted;
  }catch(err) {
    notification.error({
      message: `数据异常`,
      description: '接口请求返回数据异常JSON解析报错，请刷新重试',
    });
    return null;
  }
}

/**
 * 异常处理程序
 */
let loginOutStatus = false;

const loginOut = () => {
  loginOutStatus = true;
  window.g_app._store.dispatch({
    type: 'login/logout',
  }).then(data => {
    setTimeout(() => {
      loginOutStatus = false;
    }, 2000) 
  })
}

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
      loginOut();
    }
  } else if (!response) {
    if(loginOutStatus) return;
    loginOut();
    notification.error({
      description: '未接收到服务器返回数据',
      message: '发生异常',
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
        ip: returnCitySN["cip"],
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
    if(data.status == 2) {//白名单拦截
      if(loginOutStatus) return;
      loginOut();
      notification.error({
        message: data.msg,
      });
    }else if(data.status == 50012 || data.status == 50008) {//登陆过期拦截
      if(loginOutStatus) return;
      loginOut();
      notification.error({
        message: data.msg,
      });
    }
    /*try {
      const replaceUrl = process.env.NODE_ENV == 'development' ? response.url.replace(window.location.origin+'/server/api/', baseApi+'/merchant/api/') : response.url;
      //console.log(replaceUrl);
      if(replaceUrl == baseApi+'/merchant/api/login/login' 
        || replaceUrl == baseApi+'/merchant/api/home/getUserInfo'
        || replaceUrl == baseApi+'/merchant/api/home/getSimpleUserInfo') {
        let newdata = rsaDecryptLong(data); 
        //console.info(newdata);
        return newdata;
      }
    }catch(err) {
      return response;
    }*/
  }

  return response;
})

export default request;
