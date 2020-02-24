import { Alert, Checkbox, Icon, message } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Submit, Captcha } = LoginComponents;

@connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/phoneLogin'],
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
      userName: values.phoneUsername,
      login_pwd: values.phonePassword,
    };

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userAndlogin/phoneLogin',
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

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const { phoneUsername } = this.loginForm.getFieldsValue();
    if(!(/^1\d{10}$/.test(phoneUsername))) {
      message.error('请输入正确的手机号')
      return false;
    }
    return dispatch({
      type: 'userAndlogin/getCaptcha',
      payload: {
        telephone_number: phoneUsername
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return false;
      }else {
        message.success('操作成功');
        return true;
      }
    })
  }

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
        <div className={styles.top}>管理员登录<p>支付链开启支付的新时代</p></div>
        <LoginComponents
          className={styles.LoginComponentsBg}
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div style={{padding: '40px 40px 0 40px'}}>
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
            <Captcha
              name="phonePassword"
              placeholder={`请输入验证码`}
              getCaptchaButtonText={`获取验证码`}
              getCaptchaSecondText={`秒`}
              maxLength={6}
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={this.onGetCaptcha}
            />
          </div>
          <div className={`${styles.other} clearfix`}>
            <Submit loading={submitting} >
              登录
            </Submit>
          </div>
        </LoginComponents>
        { loginErrorStatus && this.renderLoginError(loginErrorMsg) }
      </div>
    );
  }
}

export default Login;
