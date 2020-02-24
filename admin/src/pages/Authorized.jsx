import React from 'react';
import Redirect from 'umi/redirect';
import { connect, routerRedux } from 'dva';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';

const AuthComponent = ({
  children,
  dispatch,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { currentUser } = user;
  const { routes = [] } = route;
  const isLogin = currentUser && currentUser.id;

  let currentUser_type = currentUser.type;
  if(location.pathname == '/') {
    if(currentUser_type == 1) {
      dispatch(routerRedux.push('/super'))
    }else if(currentUser_type == 2) {
      dispatch(routerRedux.push('/accept'))
    }else if(currentUser_type == 2) {
      dispatch(routerRedux.push('/merchant'))
    }
  }
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/404" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }) => ({
  user,
}))(AuthComponent);
