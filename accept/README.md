# 开发屏蔽逻辑，上线需开启


pages/home/index

```
!getRealNamePassed() &&
<div className={styles.passedLayer}>用户必须通过实名认证后方可使用平台的功能 <span onClick={this.checkUserAuth} style={{color: '#EA0000', cursor: 'pointer'}}>去认证</span></div>
```

components/ContLayout

```
componentDidMount() {
	this.path = this.props.location.pathname;
	this.hashRoutes();
	this.path != '/account/center' && !getRealNamePassed() && this.props.dispatch(routerRedux.push('/account'));
}
```

layouts/BasicLayout

```
!g_getLocalStorage() && dispatch(routerRedux.push('/user/login'));
```

utils/request

```
if(status == 504) {
  window.g_app._store.dispatch({
    type: 'login/logout',
  });
}
```

# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).