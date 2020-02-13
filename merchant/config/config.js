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
  publicPath: '/',
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
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              name: 'forget',
              icon: 'smile',
              path: '/user/forget',
              component: './user/forget',
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
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/home',
              authority: ['admin', 'user'],
            },
            {
              path: '/order',
              redirect: '/order/goldYieldOrder',
              authority: ['admin', 'user'],
            },
            {
              path: '/dissentOrder',
              redirect: '/dissentOrder/goldYieldOrder',
              authority: ['admin', 'user'],
            },
            {
              path: '/finance',
              redirect: '/finance/coinWithdrawApply',
              authority: ['admin', 'user'],
            },
            {
              path: '/callback',
              redirect: '/callback/callbackList',
              authority: ['admin', 'user'],
            },
            {
              path: '/Message',
              redirect: '/Message/list',
              authority: ['admin', 'user'],
            },
            {
              path: '/account',
              redirect: '/account/center',
              authority: ['admin', 'user'],
            },
            {
              path: '/home',
              name: '首页',
              component: './home',
            },
            {
              path: '/yield',
              name: '模拟用户端出金',
              routes: [
                {
                  name: '模拟用户端USDT出金',
                  icon: 'shopping-cart',
                  path: '/yield/yieldErc20',
                  component: './home/yieldErc20',
                },
                /*{
                  name: 'omni出金',
                  icon: 'shopping-cart',
                  path: '/yield/yieldOmni',
                  component: './home/yieldOmni',
                },*/
              ],
            },
            {
              path: '/entry',
              name: '模拟用户端入金',
              routes: [
                {
                  name: '模拟用户端USDT入金',
                  icon: 'shopping-cart',
                  path: '/entry/entryErc20',
                  component: './home/entryErc20',
                },
                /*{
                  name: 'omni入金',
                  icon: 'shopping-cart',
                  path: '/entry/entryOmni',
                  component: './home/entryOmni',
                },*/
                {
                  name: '详情页',
                  path: '/entry/entryUSDT/:id',
                  component: './home/entryErc20_detail',
                  hideInMenu: true,
                  expandPath: '/entry/entryErc20',
                },
                /*{
                  name: '详情页',
                  path: '/entry/entryOmni/:id',
                  component: './home/entryOmni_detail',
                  hideInMenu: true,
                  expandPath: '/entry/entryOmni',
                },*/
              ],
            },
            {
              path: '/order',
              name: '订单管理',
              routes: [
                {
                  name: '出金订单',
                  icon: 'shopping-cart',
                  path: '/order/goldYieldOrder',
                  component: './order/goldYieldOrder',
                },
                {
                  name: '入金订单',
                  icon: 'shopping-cart',
                  path: '/order/goldEntryOrder',
                  component: './order/goldEntryOrder',
                },
                {
                  name: '提币/充币订单',
                  icon: 'transaction',
                  path: '/order/coinOrder',
                  component: './order/coinOrder',
                },
                {
                  name: '申述',
                  path: '/order/goldYieldOrder_appeal/:id',
                  component: './order/goldYieldOrder_appeal',
                  hideInMenu: true,
                  expandPath: '/order/goldYieldOrder',
                },
                {
                  name: '申述',
                  path: '/order/goldEntryOrder_appeal/:id',
                  component: './order/goldEntryOrder_appeal',
                  hideInMenu: true,
                  expandPath: '/order/goldEntryOrder',
                },
                {
                  name: '查看',
                  path: '/order/coinOrder_detail/:id',
                  component: './order/coinOrder_detail',
                  hideInMenu: true,
                  expandPath: '/order/coinOrder',
                },
                {
                  name: '查看',
                  path: '/order/goldYieldOrder_detail/:id',
                  component: './order/goldYieldOrder_detail',
                  hideInMenu: true,
                  expandPath: '/order/goldYieldOrder',
                },
                {
                  name: '查看',
                  path: '/order/goldEntryOrder_detail/:id',
                  component: './order/goldEntryOrder_detail',
                  hideInMenu: true,
                  expandPath: '/order/goldEntryOrder',
                },
              ],
            },
            {
              path: '/dissentOrder',
              name: '异议订单管理',
              routes: [
                {
                  name: '出金异议',
                  icon: 'file-exclamation',
                  path: '/dissentOrder/goldYieldOrder',
                  component: './dissentOrder/goldYieldOrder',
                },
                {
                  name: '入金异议',
                  icon: 'file-exclamation',
                  path: '/dissentOrder/goldEntryOrder',
                  component: './dissentOrder/goldEntryOrder',
                },
                {
                  name: '查看',
                  path: '/dissentOrder/goldYieldOrder_detail/:id',
                  component: './dissentOrder/goldYieldOrder_detail',
                  hideInMenu: true,
                  expandPath: '/dissentOrder/goldYieldOrder',
                },
                {
                  name: '查看',
                  path: '/dissentOrder/goldEntryOrder_detail/:id',
                  component: './dissentOrder/goldEntryOrder_detail',
                  hideInMenu: true,
                  expandPath: '/dissentOrder/goldEntryOrder',
                },
              ],
            },
            {
              path: '/finance',
              name: '财务管理',
              routes: [
                /*{
                  name: '账户流水',
                  icon: 'pay-circle',
                  path: '/finance/accountFlow',
                  component: './finance/accountFlow',
                },*/
                /*{
                  name: '申请提现',
                  icon: 'transaction',
                  path: '/finance/cashWithdrawApply',
                  component: './finance/cashWithdrawApply',
                },*/
                {
                  name: '申请提币',
                  icon: 'red-envelope',
                  path: '/finance/coinWithdrawApply',
                  component: './finance/coinWithdrawApply',
                },
                /*{
                  name: '提现记录',
                  icon: 'property-safety',
                  path: '/finance/withdrawList',
                  component: './finance/withdrawList',
                },
                {
                  name: '查看',
                  path: '/finance/accountFlow_detail/:id',
                  component: './finance/accountFlow_detail',
                  hideInMenu: true,
                  expandPath: '/finance/accountFlow',
                },
                {
                  name: '查看',
                  path: '/finance/withdrawList_detail/:id',
                  component: './finance/withdrawList_detail',
                  hideInMenu: true,
                  expandPath: '/finance/withdrawList',
                },*/
              ],
            },
            {
              path: '/callback',
              name: '回调列表',
              routes: [
                {
                  name: '回调列表',
                  icon: 'transaction',
                  path: '/callback/callbackList',
                  component: './callback/callbackList',
                },
                {
                  name: '查看',
                  path: '/callback/callbackList_detail/:id',
                  component: './callback/callbackList_detail',
                  hideInMenu: true,
                  expandPath: '/callback/callbackList',
                },
              ],
            },
            {
              path: '/Message',
              name: '消息中心',
              routes: [
                {
                  name: '消息列表',
                  icon: 'shopping-cart',
                  path: '/Message/list',
                  component: './Message',
                },
                {
                  name: '消息详情',
                  path: '/Message/detail/:id',
                  component: './Message/detail',
                  hideInMenu: true,
                  expandPath: '/Message/list',
                },
              ],
            },
            {
              name: '账户管理',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  name: '个人信息',
                  icon: 'solution',
                  path: '/account/center',
                  component: './account/center',
                },
                {
                  name: '安全设置',
                  icon: 'safety',
                  path: '/account/settings',
                  component: './account/settings',
                },
                /*{
                  name: '收款设置',
                  icon: 'credit-card',
                  path: '/account/receiptSettings',
                  component: './account/receiptSettings',
                },
                {
                  name: '银行卡设置',
                  path: '/account/settingsBank',
                  component: './account/settingsBank',
                  hideInMenu: true,
                  expandPath: '/account/receiptSettings',
                },
                {
                  name: '支付宝设置',
                  path: '/account/settingsAlipay',
                  component: './account/settingsAlipay',
                  hideInMenu: true,
                  expandPath: '/account/receiptSettings',
                },
                {
                  name: '微信设置',
                  path: '/account/settingsWX',
                  component: './account/settingsWX',
                  hideInMenu: true,
                  expandPath: '/account/receiptSettings',
                },
                */
              ],
            },
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
  proxy: {
    '/server/api/': {
      target: 'http://www.boq.hk', //"http://192.168.1.20:7003"
      changeOrigin: true,
      pathRewrite: { '^/server': '/merchant' },
    },
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
