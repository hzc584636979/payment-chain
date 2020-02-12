import { Alert, Checkbox, Icon } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Submit } = LoginComponents;

@connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'mobile',
    loginErrorStatus: false,
    loginErrorMsg: null,
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    let payload = {
      userName: type == 'mobile' ? values.phoneUsername : values.emailUsername,
      login_pwd: type == 'mobile' ? values.phonePassword : values.emailPassword,
    };

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: type == 'mobile' ? 'userAndlogin/phoneLogin' : 'userAndlogin/emailLogin',
        payload,
      }).then(data => {
        if(data.status != 1) {
          this.setState({
            loginErrorMsg: data.msg,
            loginErrorStatus: true,
          })
        }
      })
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  onClose = e => {
    this.setState({
      loginErrorMsg: null,
      loginErrorStatus: false,
    })
  };

  renderLoginError = content => (
    <Alert
      message="登录失败，请重试"
      description={content || '登录失败'}
      type="error"
      closable
      onClose={this.onClose}
      showIcon
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999
      }}
    />
  );

  render() {
    const { userAndlogin, submitting } = this.props;
    const { status, type: loginType } = userAndlogin;
    const { type, loginErrorStatus, loginErrorMsg } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.top}>支付链开启支付的新时代<p>承兑商登录</p></div>
        <LoginComponents
          className={styles.LoginComponentsBg}
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="mobile"
            tab="手机登录"
          >
            {status == 0 &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile
              name="phoneUsername"
              placeholder={'请输入手机号'}
              maxLength={11}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <Password
              name="phonePassword"
              placeholder={`请输入登录密码`}
              maxLength={24}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Tab
            key="account"
            tab="邮箱登录"
          >
            {status == 0 &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName
              name="emailUsername"
              placeholder={`请输入邮箱`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
                {
                  type: 'email',
                  message: `邮箱地址格式错误！`,
                },
              ]}
            />
            <Password
              name="emailPassword"
              placeholder={`请输入登录密码`}
              maxLength={24}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <div className={`${styles.other} clearfix`}>
            <Submit loading={submitting} >
              登录
            </Submit>
            <Link className={styles.forget} to="/user/forget">
              忘记密码？
            </Link>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </LoginComponents>
        { loginErrorStatus && this.renderLoginError(loginErrorMsg) }
      </div>
    );
  }
}

export default Login;
