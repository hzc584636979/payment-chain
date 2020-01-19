import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React, { Fragment } from 'react';
import { Divider } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    formatMessage,
    ...props,
  });
  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={`${styles.container} ${location.pathname == '/user/login' && styles.containerLoginBg}`}>
        <div className={styles.topTitle}>
          <Link to="/user/login">登录</Link>
          <Divider type="vertical" />
          <Link to="/user/register">注册</Link>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </Fragment>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
