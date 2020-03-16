/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { PureComponent, Fragment, useEffect } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { connect, routerRedux } from 'dva';
import { Icon, Result, Button, Divider, notification } from 'antd';
import Authorized from '@/utils/Authorized';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo1.png';
import styles from './BasicLayout.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { ConfigProvider } from 'antd';
import { socketSubscribe, destroyWebSocket } from '@/utils/socketSubscribe-mqtt';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import notificationVoiceMP3 from '@/assets/voice_1.mp3';
import notificationVoiceWAV from '@/assets/voice_1.wav';
import notificationVoiceOGG from '@/assets/voice_1.ogg';

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

class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentDidMount() {
    !g_getLocalStorage() && this.props.dispatch(routerRedux.push('/user/login'));

    this.props.dispatch({
      type: 'user/getUserInfo',
    });
    //this.testNotification();
    socketSubscribe({
      subscribeList: `${window.g_getLocalStorage().id}order`,
      backList: (d) => {
        console.log(d)
        let msBody = JSON.parse(d.body);
        if(msBody.event == 'order') {
          this.openNotification('提醒', msBody.data)
        }
      }
    });
  }

  componentWillUnmount() {
    destroyWebSocket();
  }

  onLogoutClick = () => {
    this.props.dispatch({
      type: 'login/logout',
    });
  };

  newRoute = () => {
    let item = [];
    this.props.route.routes.map(data => {
      data.path != '/account' &&
        data.path != '/yield' &&
        data.path != '/entry' &&
        item.push(
          data.routes
            ? { name: data.name, path: data.path, component: data.routes[0].component }
            : data,
        );
    });

    return {
      ...this.props.route,
      routes: item,
      allRoutes: this.props.route.routes,
    };
  }

  openNotification = (message, data) => {
    const key = `open${Date.now()}`;
    const args = {
      message,
      description: <p>您有一笔状态为{data.order_type == 1 ? sellStatusType[data.order_state] : buyStatusType[data.order_state]}的{data.order_type == 1 ? '入金' : '出金'}订单，<a onClick={() => {
          router.push({
            pathname: data.order_type == 1 ? '/order/goldEntryOrder' : '/order/goldYieldOrder',
            query: {
              key,
            },
          });
          notification.close(key);
        }
      }>前往查看</a></p>,
      key,
      duration: 0,
    };
    notification.open(args);
    this.msgTipAudio && this.msgTipAudio.play();
  };

  testNotification = () => {
    setTimeout(() => this.openNotification(11,{order_type: 1, order_state: 1}),500);
    setTimeout(() => this.openNotification(11,{order_type: 1, order_state: 1}),1000);
    setTimeout(() => this.openNotification(11,{order_type: 1, order_state: 1}),1500);
    setTimeout(() => this.openNotification(11,{order_type: 1, order_state: 1}),2000);
  }

  render() {
    const {
      currentUser,
      dispatch,
      children,
      settings,
      location = {
        pathname: '/',
      },
    } = this.props;
    const authorized = getAuthorityFromRouter(this.props.route.routes, location.pathname || '/') || {
      authority: undefined,
    };
    const newProps = {
      ...this.props,
      route: this.newRoute()
    }

    return (
      <ConfigProvider locale={zh_CN}>
        <audio style={{display: 'none'}} ref={msgTipAudio => this.msgTipAudio = msgTipAudio} controls="controls">
          <source src={notificationVoiceMP3} />
          <source src={notificationVoiceWAV} />
          <source src={notificationVoiceOGG} />
        </audio>
        <div className={styles.topTitle}>
          <Link to="/account">{ currentUser && currentUser.user_name || '设置名称' }</Link>
          <Divider type="vertical" />
          <a onClick={this.onLogoutClick}>退出</a>
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
            if (this.props.location.pathname.indexOf(menuItemProps.path) > -1) {
              checked = true;
            }
            if (
              (this.props.location.pathname.indexOf('/yield/') > -1 ||
                this.props.location.pathname.indexOf('/entry/') > -1) &&
              menuItemProps.path == '/home'
            ) {
              checked = true;
            }
            return (
              <Link
                style={checked ? { borderBottom: '2px solid #1890ff', color: '#1890ff' } : {}}
                to={menuItemProps.path}
              >
                {defaultDom}
              </Link>
            );
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
      </ConfigProvider>
    );
  }
}

export default withRouter(connect(({ user, settings }) => ({
  currentUser: user.currentUser,
  settings,
}))(BasicLayout));
