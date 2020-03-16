import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import Link from 'umi/link';
import React, { Fragment } from 'react';
import { Divider, Row, Col } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
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
          <Row
            type="flex"
            justify="space-between"
          >
            <Col>
              <div className={styles.Leftlogo}>支付链管理员后台</div>
            </Col>
          </Row>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </Fragment>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
