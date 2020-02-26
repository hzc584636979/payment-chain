import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: false,
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  //非根目录配置
  /*base: '/payment/',
  publicPath: '/payment/',*/
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['user'],
          routes: [
            {
              path: '/super',
              redirect: '/super/accept',
            },
            {
              path: '/accept',
              redirect: '/accept/credit',
            },
            {
              path: '/Merchant',
              redirect: '/Merchant/brokerage',
            },
            {
              path: '/system',
              redirect: '/system/log',
            },
            {
              path: '/super',
              icon: 'usergroup-add',
              name: '超级管理员',
              authority: ['super'],
              routes: [
                {
                  name: '承兑商管理员',
                  path: '/super/accept',
                  component: './super/accept',
                },
                {
                  name: '商户管理员',
                  path: '/super/merchant',
                  component: './super/merchant',
                },
                /*{
                  name: '冷钱包',
                  path: '/super/coldwallet',
                  authority: ['super'],
                  routes: [
                    {
                      name: '承兑商余额冷钱包',
                      path: '/super/coldwallet/coldwalletAccept',
                      component: './super/coldwalletAcceptList',
                    },
                    {
                      name: '商户余额冷钱包',
                      path: '/super/coldwallet/coldwalletMerchant',
                      component: './super/coldwalletMerchantList',
                    },
                    {
                      name: '手续费冷钱包',
                      path: '/super/coldwallet/coldwalletGas',
                      component: './super/coldwalletGasList',
                    },
                    {
                      name: 'erc20查账',
                      path: '/super/coldwallet/coldwalletAccept/erc20',
                      component: './super/coldwalletAccept',
                      hideInMenu: true,
                      expandPath: '/super/coldwallet/coldwalletAccept',
                    },
                    {
                      name: 'omni查账',
                      path: '/super/coldwallet/coldwalletAccept/omni',
                      component: './super/coldwalletAccept',
                      hideInMenu: true,
                      expandPath: '/super/coldwallet/coldwalletAccept',
                    },
                    {
                      name: 'erc20查账',
                      path: '/super/coldwallet/coldwalletMerchant/erc20',
                      component: './super/coldwalletMerchant',
                      hideInMenu: true,
                      expandPath: '/super/coldwallet/coldwalletMerchant',
                    },
                    {
                      name: 'omni查账',
                      path: '/super/coldwallet/coldwalletMerchant/omni',
                      component: './super/coldwalletMerchant',
                      hideInMenu: true,
                      expandPath: '/super/coldwallet/coldwalletMerchant',
                    },
                    {
                      name: 'erc20查账',
                      path: '/super/coldwallet/coldwalletGas/erc20',
                      component: './super/coldwalletGas',
                      hideInMenu: true,
                      expandPath: '/super/coldwallet/coldwalletGas',
                    },
                    {
                      name: 'omni查账',
                      path: '/super/coldwallet/coldwalletGas/omni',
                      component: './super/coldwalletGas',
                      hideInMenu: true,
                      expandPath: '/super/coldwallet/coldwalletGas',
                    },

                  ]
                },
                {
                  name: '中心化钱包',
                  path: '/super/centerWallet',
                  authority: ['super'],
                  routes: [
                    {
                      name: '更换私钥设置',
                      path: '/super/centerWallet/privateKey',
                      component: './super/privateKey',
                    },
                    {
                      name: '充币',
                      path: '/super/centerWallet/pay',
                      component: './super/pay',
                    },
                    {
                      name: '提币',
                      path: '/super/centerWallet/withdrawApply',
                      component: './super/withdrawApply',
                    },
                    {
                      name: '转出转入记录',
                      path: '/super/centerWallet/withdrawList',
                      component: './super/withdrawList',
                    },
                  ]
                },*/
                {
                  name: '承兑商成员',
                  path: '/super/accept_add/:id',
                  component: './super/accept_add',
                  hideInMenu: true,
                  expandPath: '/super/accept',
                },
                {
                  name: '商户成员',
                  path: '/super/merchant_add/:id',
                  component: './super/merchant_add',
                  hideInMenu: true,
                  expandPath: '/super/merchant',
                },
              ],
            },
            {
              path: '/accept',
              icon: 'user',
              name: '承兑商管理',
              authority: ['super', 'accept'],
              routes: [
                {
                  name: '信用评分管理',
                  path: '/accept/credit',
                  component: './accept/credit',
                },
                {
                  name: '浮动汇率设置',
                  path: '/accept/rate',
                  component: './accept/rate',
                },
                {
                  name: '押金管理',
                  path: '/accept/deposit',
                  component: './accept/deposit',
                },
                {
                  name: '交易槽设置',
                  path: '/accept/tradingSlot',
                  component: './accept/tradingSlot',
                },
                {
                  name: '区块链提币管理',
                  path: '/accept/coinWithdrawApply',
                  component: './accept/coinWithdrawApply',
                },
                {
                  name: '出售异议订单处理',
                  path: '/accept/sellDissentOrder',
                  component: './accept/sellDissentOrder',
                },
                {
                  name: '购买异议订单处理',
                  path: '/accept/buyDissentOrder',
                  component: './accept/buyDissentOrder',
                },
                {
                  name: '查看',
                  path: '/accept/sellDissentOrder_detail/:id',
                  component: './accept/sellDissentOrder_detail',
                  hideInMenu: true,
                  expandPath: '/accept/sellDissentOrder',
                },
                {
                  name: '查看',
                  path: '/accept/buyDissentOrder_detail/:id',
                  component: './accept/buyDissentOrder_detail',
                  hideInMenu: true,
                  expandPath: '/accept/buyDissentOrder',
                },
              ],
            },
            {
              path: '/Merchant',
              icon: 'user',
              name: '商户管理',
              authority: ['super', 'merchant'],
              routes: [
                {
                  name: '手续费设置',
                  path: '/Merchant/brokerage',
                  component: './Merchant/brokerage',
                },
                {
                  name: '区块链提币管理',
                  path: '/Merchant/coinWithdrawApply',
                  component: './Merchant/coinWithdrawApply',
                },
                {
                  name: '出金异议订单处理',
                  path: '/Merchant/sellDissentOrder',
                  component: './Merchant/sellDissentOrder',
                },
                {
                  name: '入金异议订单处理',
                  path: '/Merchant/buyDissentOrder',
                  component: './Merchant/buyDissentOrder',
                },
                {
                  name: '查看',
                  path: '/Merchant/sellDissentOrder_detail/:id',
                  component: './Merchant/sellDissentOrder_detail',
                  hideInMenu: true,
                  expandPath: '/Merchant/sellDissentOrder',
                },
                {
                  name: '查看',
                  path: '/Merchant/buyDissentOrder_detail/:id',
                  component: './Merchant/buyDissentOrder_detail',
                  hideInMenu: true,
                  expandPath: '/Merchant/buyDissentOrder',
                },
              ],
            },
            /*{
              path: '/system',
              icon: 'setting',
              name: '系统管理',
              authority: ['super'],
              routes: [
                {
                  name: '日志记录',
                  path: '/system/log',
                  component: './system/log',
                },
                {
                  name: '发布消息',
                  path: '/system/news',
                  component: './system/news',
                },
                {
                  name: '消息记录',
                  path: '/system/message',
                  component: './system/message',
                },
                {
                  name: '查看',
                  path: '/system/message_detail/:id',
                  component: './system/message/detail',
                  hideInMenu: true,
                  expandPath: '/system/message',
                },
              ],
            },*/
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  }, 
  "proxy": {
    "/server/api/": {
      "target": "http://www.boq.hk",//"http://192.168.1.20:7002"
      "changeOrigin": true,
      pathRewrite: { '^/server': '/management' },
    }
  },
  // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
};

