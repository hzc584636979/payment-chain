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
import styles from './style.less';
import { getAuthority } from '@/utils/authority';

const { SubMenu, Item } = Menu;

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
    this.getMenuKey();
    this.setState({
      path: this.path,
      hash: this.hashRoutes(),
    })
  }

  componentWillUnmount() {
    
  }

  hashRoutes = (routes=config.routes[0].routes[1].routes, parent, index) => {
    routes.map((v, index) => {
      this.hash[v.path] = {...v, parent, index}
      if(v.routes){
        this.hashRoutes(v.routes, v, index)
      }
    })
  }

  matchBreadcrumb = () => {
    let matchPath = [];
    if(!this.hash || !this.path) return;

    let splitArr = this.path.split('/');
    let newSplitArr = splitArr.slice(0, splitArr.length-1).join('/')+'/:id';

    let newPath = this.hash[this.path] ? this.hash[this.path] : this.hash[newSplitArr];
    if(!newPath) return [];

    if(newPath.parent && newPath.parent.path && this.hash[newPath.parent.path] && this.hash[newPath.parent.path].parent) {
      matchPath.push(this.hash[newPath.parent.path].parent)
    }
    newPath.parent && matchPath.push(newPath.parent);
    newPath.expandPath && matchPath.push(this.hash[newPath.expandPath]);
    newPath && matchPath.push(newPath);
    return matchPath;
  }

  getBreadcrumb = () => {
    let breadcrumb = this.matchBreadcrumb();
    let renderJsx = [];

    breadcrumb && breadcrumb.map((v, index, arr) => {
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

  checkAuthority = authority => {
    let myAuthority = {};
    getAuthority().map(v => myAuthority[v] = 1);

    let check = false;
    if(Object.prototype.toString.call(authority) === '[object String]') {
      myAuthority[authority] ? check = true : null;
    }else if(Object.prototype.toString.call(authority) === '[object Array]') {
      authority.map(v => {
        myAuthority[v] ? check = true : null;
      })
    }else if(Object.prototype.toString.call(authority) === '[object Object]') {
      Object.keys(authority).map(k => {
        myAuthority[k] ? check = true : null;
      })
    }

    return check;
  }

  getMenuData = (routes=config.routes[0].routes[1].routes, parent) => {
    let jsx = [];

    routes.map((v, index) => {
      if((parent && !this.checkAuthority(parent.authority)) || (v.authority && !this.checkAuthority(v.authority))) return jsx;
      if(!v.redirect && !v.hideInMenu) { 
        if(v.routes) {
          jsx.push(
            <SubMenu 
              key={v.name}
              title={
                <span>
                  {
                    v.icon &&
                    <Icon type={v.icon} />
                  }
                  <span>{v.name}</span>
                </span>
              }
            >
              { this.getMenuData(v.routes, v) }
            </SubMenu>
          )
        }else {
          jsx.push(
            <Item key={`${parent && parent.name}${index}`} path={v.path}>
              { v.icon && <Icon type={v.icon} /> }
              <span>{v.name}</span>
            </Item>
          )
        }
      }
    })
    return jsx;
  }

  getMenuKey = () => {
    if(!this.hash || !this.path) return;

    let splitArr = this.path.split('/');
    let newSplitArr = splitArr.slice(0, splitArr.length-1).join('/')+'/:id';

    let newPath = this.hash[this.path] ? (this.hash[this.path].expandPath ? this.hash[this.hash[this.path].expandPath] : this.hash[this.path]) : this.hash[this.hash[newSplitArr].expandPath];
    if(!newPath) return '';
    let openKeys = [];
    if(newPath.parent && newPath.parent.path && this.hash[newPath.parent.path] && this.hash[newPath.parent.path].parent) {
      openKeys = [this.hash[newPath.parent.path].parent.name]
    }
    if(newPath.parent) {
      openKeys = [...openKeys, newPath.parent.name];
    }
    this.setState({
      openKeys,
      selectedKeys: newPath.parent ? `${newPath.parent.name}${newPath.index}` : newPath.index
    })
  }

  handleMenuClick = e => {
    if(e.item.props.path == this.path) return;
    this.props.dispatch(routerRedux.push(e.item.props.path))
  }

  handleSubMenuClick = e => {
    this.setState({
      openKeys: e,
    })
  }

  render() {
    const { children, loading } = this.props;
    const getBreadcrumb = this.getBreadcrumb();

    return (
      <Spin spinning={!!loading}>
        <GridContent className={styles.wrap}>
          <Row>
            <Col xs={5}>
              <div className={styles.menuWrap}>
                <h1>管理员后台</h1>
                <Menu
                  onClick={this.handleMenuClick}
                  onOpenChange={this.handleSubMenuClick}
                  style={{ width: '100%' }}
                  openKeys={this.state.openKeys || []}
                  selectedKeys={this.state.selectedKeys}
                  mode="inline"
                >
                  { this.getMenuData() }
                </Menu>
              </div>
            </Col>
            <Col xs={19}>
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
