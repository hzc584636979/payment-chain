import {
  Icon,
  Menu,
  Row,
  Col,
  Spin,
} from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { connect, routerRedux } from 'dva';
import config from '../../../config/config.js';
import { getRealNamePassed } from '@/utils/utils';
import styles from './style.less';

const { Item } = Menu;

@connect(({ router: { location } }) => ({
  location,
}))
class ContLayout extends Component {
  constructor(props) {
    super(props);
  
    this.state = {

    };
    this.hash = {};
  }

  componentDidMount() {
    this.path = this.props.location.pathname;
    this.hashRoutes();
    this.path != '/account/center' && !getRealNamePassed() && this.props.dispatch(routerRedux.push('/account'));
  }

  componentWillUnmount() {
    
  }

  hashRoutes = (routes=config.routes[0].routes[1].routes, parent, index) => {
    routes.map((v, index) => {
      v.routes ? this.hashRoutes(v.routes, v, index) : this.hash[v.path] = {...v, parent, index}
    })
  }

  matchBreadcrumb = () => {
    let matchPath = [];
    if(!this.hash || !this.path) return;

    let splitArr = this.path.split('/');
    let newSplitArr = splitArr.slice(0, splitArr.length-1).join('/')+'/:id';

    let newPath = this.hash[this.path] ? this.hash[this.path] : this.hash[newSplitArr];
    if(!newPath) return [];

    newPath.parent && matchPath.push(newPath.parent);
    newPath.expandPath && matchPath.push(this.hash[newPath.expandPath]);
    newPath && matchPath.push(newPath);

    return matchPath;
  }

  getBreadcrumb = () => {
    let breadcrumb = this.matchBreadcrumb();
    let renderJsx = [];

    breadcrumb && breadcrumb.unshift(this.hash['/home']) && breadcrumb.map((v, index, arr) => {
      renderJsx.push(
        v.component ? 
        (arr.length - 1 != index ? <Link style={{color: '#999'}} key={index} to={v.path+'?history'}>{v.name}</Link> 
          : 
        <Link key={index} to={v.path}>{v.name}</Link>) : <span key={index}>{v.name}</span>
      );
      arr.length - 1 != index && renderJsx.push(' - ');
    })
    return renderJsx;
  }

  getMenuData = () => {
    let breadcrumb = this.matchBreadcrumb();
    let jsx = [];
    breadcrumb && breadcrumb[0] && breadcrumb[0].routes && breadcrumb[0].routes.map((v, index) => {
      !v.hideInMenu && 
      jsx.push(
        <Item key={index} path={v.path}>
          <Icon type={v.icon} />
          <span>{v.name}</span>
        </Item>
      )
    })
    return jsx;
  }

  getMenuKey = () => {
    if(!this.hash || !this.path) return;

    let splitArr = this.path.split('/');
    let newSplitArr = splitArr.slice(0, splitArr.length-1).join('/')+'/:id';

    let newPath = this.hash[this.path] ? (this.hash[this.path].expandPath ? this.hash[this.hash[this.path].expandPath] : this.hash[this.path]) : this.hash[this.hash[newSplitArr].expandPath];
    if(!newPath) return '';

    return newPath.index + '';
  }

  handleMenuClick = e => {
    if(e.item.props.path == this.path) return;
    this.props.dispatch(routerRedux.push(e.item.props.path))
  }

  render() {
    const { children, loading } = this.props;
    const getBreadcrumb = this.getBreadcrumb();
    const isMessagePage = this.props.location.pathname.indexOf('/Message/') > -1;

    return (
      <Spin spinning={!!loading}>
        <GridContent className={styles.wrap}>
          <Row>
            {
              !isMessagePage &&
              <Col xs={4}>
                <div className={styles.menuWrap}>
                  <h1>{ getBreadcrumb.length > 0 && getBreadcrumb[2] }</h1>
                  <Menu
                    onClick={this.handleMenuClick}
                    style={{ width: '100%' }}
                    selectedKeys={this.getMenuKey()}
                    mode="inline"
                  >
                    { this.getMenuData() }
                  </Menu>
                </div>
              </Col>
            }
            <Col xs={!isMessagePage ? 20 : 24}>
              <div className={styles.PageWrap}>
                <div className={styles.breadcrumb}>
                  { getBreadcrumb }
                </div>
                { children }
              </div>
            </Col>
          </Row>
        </GridContent>
      </Spin>
    );
  }
}

export default ContLayout;
