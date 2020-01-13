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
};
window.buyStatusType = {
  0: '全部',
  1: '待审核',
  2: '已通过',
  3: '审核不通过',
  4: '待承兑商接单',
  5: '待承兑商转账',
  6: '承兑商已确认转账',
  7: '商户出金',
  8: '关闭订单',
  9: '已过期',
};
window.coinType = {
  0: '全部',
  1: 'USDT(erc20)',
  /*2: 'USDT(omni)',*/
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
