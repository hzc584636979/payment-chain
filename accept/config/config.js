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
              redirect: '/order/sellOrder',
              authority: ['admin', 'user'],
            },
            {
              path: '/dissentOrder',
              redirect: '/dissentOrder/sellOrder',
              authority: ['admin', 'user'],
            },
            {
              path: '/finance',
              redirect: '/finance/settings',
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
              path: '/order',
              name: '订单管理',
              routes: [
                {
                  name: '出售订单管理',
                  icon: 'shopping-cart',
                  path: '/order/sellOrder',
                  component: './order/sellOrder',
                },
                {
                  name: '购买订单管理',
                  icon: 'shopping-cart',
                  path: '/order/buyOrder',
                  component: './order/buyOrder',
                },
                {
                  name: '申述',
                  path: '/order/sellOrder_appeal/:id',
                  component: './order/sellOrder_appeal',
                  hideInMenu: true,
                  expandPath: '/order/sellOrder',
                },
                {
                  name: '查看',
                  path: '/order/sellOrder_detail/:id',
                  component: './order/sellOrder_detail',
                  hideInMenu: true,
                  expandPath: '/order/sellOrder',
                },
                {
                  name: '申述',
                  path: '/order/buyOrder_appeal/:id',
                  component: './order/buyOrder_appeal',
                  hideInMenu: true,
                  expandPath: '/order/buyOrder',
                },
                {
                  name: '查看',
                  path: '/order/buyOrder_detail/:id',
                  component: './order/buyOrder_detail',
                  hideInMenu: true,
                  expandPath: '/order/buyOrder',
                },
              ],
            },
            {
              path: '/dissentOrder',
              name: '异议订单管理',
              routes: [
                {
                  name: '出售订单管理',
                  icon: 'file-exclamation',
                  path: '/dissentOrder/sellOrder',
                  component: './dissentOrder/sellOrder',
                },
                {
                  name: '购买订单管理',
                  icon: 'file-exclamation',
                  path: '/dissentOrder/buyOrder',
                  component: './dissentOrder/buyOrder',
                },
                {
                  name: '查看',
                  path: '/dissentOrder/sellOrder_detail/:id',
                  component: './dissentOrder/sellOrder_detail',
                  hideInMenu: true,
                  expandPath: '/dissentOrder/sellOrder',
                },
                {
                  name: '查看',
                  path: '/dissentOrder/buyOrder_detail/:id',
                  component: './dissentOrder/buyOrder_detail',
                  hideInMenu: true,
                  expandPath: '/dissentOrder/buyOrder',
                },
              ],
            },
            {
              path: '/finance',
              name: '财务管理',
              routes: [
                {
                  name: '收款设置',
                  icon: 'credit-card',
                  path: '/finance/settings',
                  component: './finance/settings',
                },
                {
                  name: '提币/充币记录',
                  icon: 'transaction',
                  path: '/finance/withdrawList',
                  component: './finance/withdrawList',
                },
                {
                  name: '押金记录',
                  icon: 'property-safety',
                  path: '/finance/depositList',
                  component: './finance/depositList',
                },
                {
                  name: '提币申请',
                  icon: 'red-envelope',
                  path: '/finance/withdrawApply',
                  component: './finance/withdrawApply',
                },
                {
                  name: '银行卡设置',
                  path: '/finance/settingsBank',
                  component: './finance/settingsBank',
                  hideInMenu: true,
                  expandPath: '/finance/settings',
                },
                {
                  name: '支付宝设置',
                  path: '/finance/settingsAlipay',
                  component: './finance/settingsAlipay',
                  hideInMenu: true,
                  expandPath: '/finance/settings',
                },
                {
                  name: 'VISA设置',
                  path: '/finance/settingsVisa',
                  component: './finance/settingsVisa',
                  hideInMenu: true,
                  expandPath: '/finance/settings',
                },
                {
                  name: 'Paypal设置',
                  path: '/finance/settingsPaypal',
                  component: './finance/settingsPaypal',
                  hideInMenu: true,
                  expandPath: '/finance/settings',
                },
                {
                  name: '微信设置',
                  path: '/finance/settingsWX',
                  component: './finance/settingsWX',
                  hideInMenu: true,
                  expandPath: '/finance/settings',
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
  "proxy": {
    "/server/api/": {
      "target": "http://usdt.usdtpay.net.cn",//"http://192.168.1.20:7002"
      "changeOrigin": true,
      pathRewrite: { '^/server': '/acceptance' },
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

