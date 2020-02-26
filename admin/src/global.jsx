import { Button, message, notification } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import defaultSettings from '../config/defaultSettings';
const { pwa } = defaultSettings; // if pwa is true

window.EXHIBITION = '/';
window.EXHIBITION2 = '--';
window.DEFAULTAVATAR = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

window.g_getLocalStorage = (key="paymentChain") => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
};

window.g_setLocalStorage = (params, key="paymentChain") => {
  return localStorage.setItem(key, JSON.stringify(params));
};

window.wei2USDT = (val) => {
  return Number(val) ? Number(val) / Math.pow(10, 6) : 0;
}

window.regPhone = phone => {
  return /^1\d{10}$/.test(phone);
};

window.regBankNumber = number => {
  return /^(\d{16,19})$/.test(number);
};

window.getDecimal = (number, wei) => {
  if(parseFloat(number) && number.toString().indexOf('.') > -1) {
    let int = number.toString().split('.')[0];
    let float = number.toString().split('.')[1];
    if(float.length > wei) {
      return int+'.'+float.substr(0, wei);
    }
  }
  return number;
}

const AliSmsError = {
  'isp.RAM_PERMISSION_DENY': '阿里短信服务提示：RAM权限DENY',
  'isv.OUT_OF_SERVICE': '业务停机',
  'isv.PRODUCT_UN_SUBSCRIPT': '未开通云通信产品的阿里云客户',
  'isv.PRODUCT_UNSUBSCRIBE': '产品未开通',
  'isv.ACCOUNT_NOT_EXISTS': '账户不存在',
  'isv.ACCOUNT_ABNORMAL': '账户异常',
  'isv.SMS_TEMPLATE_ILLEGAL': '短信模版不合法',
  'isv.SMS_SIGNATURE_ILLEGAL': '短信签名不合法',
  'isv.INVALID_PARAMETERS': '参数异常',
  'isp.SYSTEM_ERROR': '服务异常，请重试',
  'isv.MOBILE_NUMBER_ILLEGAL': '非法手机号',
  'isv.MOBILE_COUNT_OVER_LIMIT': '手机号码数量超过限制',
  'isv.TEMPLATE_MISSING_PARAMETERS': '模版缺少变量',
  'isv.BUSINESS_LIMIT_CONTROL': '服务控流，发送验证码失败，请稍后重试',
  'isv.INVALID_JSON_PARAM': 'JSON参数不合法，只接受字符串值',
  'isv.BLACK_KEY_CONTROL_LIMIT': '黑名单管控',
  'isv.PARAM_LENGTH_LIMIT': '参数超出长度限制',
  'isv.PARAM_NOT_SUPPORT_URL': '不支持URL',
  'isv.AMOUNT_NOT_ENOUGH': '账户余额不足',
  'isv.TEMPLATE_PARAMS_ILLEGAL': '模版变量里包含非法关键字',
  'SignatureDoesNotMatch': 'Signature加密错误',
  'InvalidTimeStamp.Expired': '时间戳错误',
  'SignatureNonceUsed': '唯一随机数重复',
  'InvalidVersion': '版本号错误，需要确认接口的版本号',
  'InvalidAction.NotFound': '接口名错误，需要确认接口地址和接口名',
}

window.captchaError = (msg) => {
  try {
    if(msg && typeof JSON.parse(msg) == 'object') {
      console.log(msg)
      if(JSON.parse(msg).name && 
        (AliSmsError[JSON.parse(msg).name] || AliSmsError[JSON.parse(msg).name.replace('Error', '')])) {
        return `阿里短信服务错误信息：${AliSmsError[JSON.parse(msg).name] || AliSmsError[JSON.parse(msg).name.replace('Error', '')]}`;
      }
      return msg;
    } 
    return msg;
  }catch(e) {
    console.log(e, msg)
    return msg;
  }
}

import weixin from '@/assets/icon_saoma_weixin.png';
import yinlian from '@/assets/icon_saoma_yinlian.png';
import zhifubao from '@/assets/icon_saoma_zhifubao.png';
window.payIcon = {
  1: yinlian,
  2: zhifubao,
  3: weixin,
}
window.payName = {
  1: '银联',
  2: '支付宝',
  3: '微信',
}
window.sellStatusType = {
  0: '全部',
  1: '待用户付款',
  2: '用户已付款',
  3: '承兑商已确认收款',
  4: '承兑商未收到款',
  5: '已过期',
  6: '订单异议中',
  7: '用户取消订单',
};
window.buyStatusType = {
  0: '全部',
  1: '待审核',
  2: '审核不通过',
  3: '待承兑商接单',
  4: '待承兑商转账',
  5: '承兑商已确认转账',
  6: '商户出金',
  7: '关闭订单',
  8: '已过期',
  9: '承兑商不接单',
};
window.coinType = {
  0: '全部',
  1: 'USDT',
}
window.coinType2 = {
  0: '全部',
  1: 'USDT(erc20)',
  2: 'USDT(omni)',
}
window.cashType = {
  0: '全部',
  1: 'CNY',
  2: 'USD',
}

if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(
      formatMessage({
        id: 'app.pwa.offline',
      }),
    );
  }); // Pop up a prompt on the page asking the user if they want to use the latest version

  window.addEventListener('sw.updated', event => {
    const e = event;

    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;

      if (!worker) {
        return true;
      } // Send skip-waiting event to waiting SW with MessageChannel

      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };

        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      }); // Refresh current page to use the updated HTML and other assets after SW has skiped waiting

      window.location.reload(true);
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {formatMessage({
          id: 'app.pwa.serviceworker.updated.ok',
        })}
      </Button>
    );
    notification.open({
      message: formatMessage({
        id: 'app.pwa.serviceworker.updated',
      }),
      description: formatMessage({
        id: 'app.pwa.serviceworker.updated.hint',
      }),
      btn,
      key,
      onClose: async () => {},
    });
  });
} else if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;

  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }

  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  }); // remove all caches

  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}
