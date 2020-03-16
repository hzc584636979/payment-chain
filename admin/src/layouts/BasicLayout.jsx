/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { Fragment, useEffect } from 'react';
import Link from 'umi/link';
import { connect, routerRedux } from 'dva';
import { Icon, Result, Button, Divider, Row, Col } from 'antd';
import Authorized from '@/utils/Authorized';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import styles from './BasicLayout.less';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

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

  return (
    <ConfigProvider locale={zh_CN}>
      <div className={styles.topTitle}>
        <Row
          type="flex"
          justify="space-between"
        >
          <Col>
            <div className={styles.Leftlogo}>支付链管理员后台</div>
          </Col>
          <Col>
            <span style={{color: '#fff'}}>{ currentUser && currentUser.telephone_number }</span>
            <Divider type="vertical" />
            <a onClick={onLogoutClick}>退出</a>
          </Col>
        </Row>
      </div>
      <ProLayout
        {...settings}
      >
        {children}
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({ user, settings }) => ({
  currentUser: user.currentUser,
  settings,
}))(BasicLayout);
