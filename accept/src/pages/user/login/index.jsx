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
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    let payload = {
      userName: type == 'mobile' ? values.phoneUsername : values.emailUsername,
      password: type == 'mobile' ? values.phonePassword : values.emailPassword,
      type,
    };

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: type == 'mobile' ? 'userAndlogin/phoneLogin' : 'userAndlogin/emailLogin',
        payload,
      });
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

  render() {
    const { userAndlogin, submitting } = this.props;
    const { status, type: loginType } = userAndlogin;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.top}>支付链开启支付的新时代</div>
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
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile
              name="phoneUsername"
              placeholder={'手机号'}
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
              placeholder={`密码: ant`}
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
            {status === 'error' &&
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
              placeholder={`密码: ant`}
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
      </div>
    );
  }
}

export default Login;
