/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { Fragment, useEffect } from 'react';
import Link from 'umi/link';
import { connect, routerRedux } from 'dva';
import { Icon, Result, Button, Divider, notification } from 'antd';
import Authorized from '@/utils/Authorized';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo1.png';
import styles from './BasicLayout.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 蚂蚁金服体验技术部出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender = () => {
  /*if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <Fragment>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </Fragment>
  );*/
  return '';
};

const openNotification = (message, description) => {
  const args = {
    message,
    description,
    duration: 0,
  };
  notification.open(args);
  if(window.newWebSocketRadius && props.location.pathname.indexOf('/order/') < 0) {
    window.newWebSocketRadius.style.display = 'block';
  }
};

//openNotification('提醒', <p>订单发生变化，<a onClick={() => window.g_app._store.dispatch(routerRedux.push('/order'))}>前往查看</a></p>);

const BasicLayout = props => {
  const {
    currentUser,
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  !g_getLocalStorage() && dispatch(routerRedux.push('/user/login'));

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/getUserInfo',
      });
    }
  }, []);

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const onLogoutClick = function(){
    dispatch({
      type: 'login/logout',
    });
  };

  const newRoute = () => {
    let item = [];
    props.route.routes.map(data => {
      data.path != '/account' && item.push(data.routes ? {name: data.name, path: data.path, component: data.routes[0].component} : data)
    })

    return {
      ...props.route,
      routes: item,
      allRoutes: props.route.routes,
    };
  }

  const newProps = {
    ...props,
    route: newRoute()
  }

  return (
    <ConfigProvider locale={zh_CN}>
      <div className={styles.topTitle}>
        <Link to="/account">{ currentUser && currentUser.user_name || '设置名称' }</Link>
        <Divider type="vertical" />
        <a onClick={onLogoutClick}>退出</a>
      </div>
      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        menuItemRender={(menuItemProps, defaultDom) => {
          let checked = false;
          if(props.location.pathname.indexOf(menuItemProps.path) > -1) {
            checked = true;
          }
          if(menuItemProps.path == '/order') {
            return <Link to={menuItemProps.path}>{defaultDom}<span ref={newWebSocket => window.newWebSocketRadius = newWebSocket} style={{position: 'absolute', right: 10, top: 32, display: 'inline-block', width: 10 , height: 10, borderRadius: '50%', background: 'red', display: 'none'}}></span></Link>
          }
          if(props.location.pathname.indexOf('/order/') > -1 && window.newWebSocketRadius) {
            window.newWebSocketRadius.style.display = 'none';
          }
          return <Link style={checked ? {borderBottom: '2px solid #1890ff', color: '#1890ff'} : {}} to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        {...newProps}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      {/*<SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />*/}
    </ConfigProvider>
  );
};

export default connect(({ user, settings }) => ({
  currentUser: user.currentUser,
  settings,
}))(BasicLayout);
