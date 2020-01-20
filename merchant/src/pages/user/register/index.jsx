import { Button, Col, Form, Input, Popover, Progress, Row, Select, message, Steps, Icon, Tabs } from 'antd';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './style.less';
import img_logon_empty from '../../../assets/img_logon_empty.png';

const { TabPane } = Tabs;
const { Step } = Steps;
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      强度：强
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      强度：中
    </div>
  ),
  poor: (
    <div className={styles.error}>
      强度：太短
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ userAndregister, loading }) => ({
  userAndregister,
  submitting: loading.effects['userAndregister/submit'],
}))
class Register extends Component {
  state = {
    count: 0,
    stepCurrent: 0,
    tabType: 'phone',
    params: {
      country: "china",
      prefix: '86',
    },
  };

  interval = undefined;

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleTab = tabType => {
    const { form } = this.props;
    form.resetFields();
    clearInterval(this.interval);
    let params = {
      country: "china",
      prefix: '86',
    };
    this.setState({
      tabType,
      params,
      count: null,
      stepCurrent: 0,
    })
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const { params, tabType } = this.state;
    let url = '';
    if(tabType == 'phone') {
      url = 'userAndregister/getPhoneCode'
      if(!params.phone || !regPhone(params.phone)) {
        message.error('请输入正确的手机号！');
        return;
      }
    }else {
      url = 'userAndregister/getEmailCode'
      if(!params.email || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(params.email))) {
        message.error('请输入正确的邮箱地址！');
        return;
      }
    }

    dispatch({
      type: url,
      payload: tabType == 'phone' ? {telephone_number: params.phone} : {email_address: params.email},
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      let count = 59;
      this.setState({
        count,
      });
      this.interval = window.setInterval(() => {
        count -= 1;
        this.setState({
          count,
        });

        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    })
  }

  hanldeCaptcha = e => {
    const { params } = this.state;
    this.setState({
      params: {
        ...params,
        code: e.target.value,
      }
    })
  }

  checkPassword = (rule, value, callback) => {
    console.log(value)
    if (value.length < 6 || value.length > 8) {
      callback('请输入6位~8位之间的密码');
    } else {
      const { form } = this.props;

      if (value) {
        form.validateFields(['confirm'], {
          force: true,
        });
      }

      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  }

  changePrefix = value => {
    const { params } = this.state;
    this.setState({
      params: {
        ...params,
        prefix: value,
      }
    });
  }

  hanldePhone = e => {
    const { params } = this.state;
    this.setState({
      params: {
        ...params,
        phone: e.target.value,
      }
    })
  }

  nextPhoneStep2 = () => {
    const { dispatch } = this.props;
    const { params } = this.state;
    if(!params.code) {
      message.error('请输入验证码');
      return;
    }
    dispatch({
      type: 'userAndregister/nextPhoneStep2',
      payload: {
        telephone_number: params.phone,
        telephone_verify_code: params.code,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      clearInterval(this.interval);
      this.setState({
        stepCurrent: 1,
        params: {
          ...params,
          code: params.code,
        }
      });
    })
  }

  subPhoneRegister = () => {
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          const { params } = this.state;
          dispatch({
            type: 'userAndregister/phoneSubmit',
            payload: {
              telephone_number: params.phone,
              login_pwd: values.password,
            },
          }).then(data => {
            if(data.status != 1) {
              message.error(data.msg);
              return;
            }
            this.setState({
              stepCurrent: 2,
            })
          })
        }
      },
    );
  }

  phoneRenderFrom = () => {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const { stepCurrent, params, count } = this.state;
    let renderJsx = '';
    if(stepCurrent == 0) {
      renderJsx = (
        <Form style={{width: '80%', margin: '0 auto'}} {...formItemLayout}>
          {/*<FormItem label="国籍/地区">
            {getFieldDecorator('country', {
              initialValue: params.country,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select style={{ width: 120 }}>
                <Option value="china">中国大陆</Option>
              </Select>,
            )}
          </FormItem>*/}
          <FormItem label="手机号码">
            <InputGroup compact>
              {/*<Select
                size="large"
                value={params.prefix}
                onChange={this.changePrefix}
                style={{
                  width: 100,
                  marginRight: 20
                }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>*/}
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ],
              })(
                <Input
                  size="large"
                  style={{
                    width: 560,
                  }}
                  maxLength={11}
                  placeholder={'手机号'}
                  onKeyUp={this.hanldePhone}
                />,
              )}
            </InputGroup>
          </FormItem>
          <FormItem label="短信验证码">
            {getFieldDecorator('captcha', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(
              <Input
                size="large"
                style={{
                  width: 156,
                }}
                maxLength={6}
                placeholder={'验证码'}
                onKeyUp={ this.hanldeCaptcha }
              />,
            )}
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={this.onGetCaptcha}
              style={{
                width: 140,
                display: 'inline-block',
                marginLeft: 20
              }}
            >
              {count
                ? `${count} s`
                : '获取验证码'}
            </Button>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.nextPhoneStep2}
            >
              下一步
            </Button>
          </FormItem>
        </Form>
      )
    }else if(stepCurrent == 1) {
      renderJsx = (
        <Form style={{width: '80%', margin: '0 auto'}} {...formItemLayout}>
          <FormItem label="设置密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  validator: this.checkPassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                maxLength={8}
                style={{
                  width: 360
                }}
                placeholder={`请设置登录密码`}
              />,
            )}
          </FormItem>
          <FormItem label="确认密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                maxLength={8}
                style={{
                  width: 360
                }}
                placeholder={`请重新输入登录密码`}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.subPhoneRegister}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      )
    }else if(stepCurrent == 2) {
      renderJsx = (
        <div className={styles.phoneSuccessImg}>
          <img src={img_logon_empty} />
          <div className={styles.txt}>您已成功注册，赶快去<Link to="/user/login" style={{color: '#1890ff'}}>登录~</Link></div>
        </div>
      )
    }

    return renderJsx;
  }

  hanldeEmail = e => {
    const { params } = this.state;
    this.setState({
      params: {
        ...params,
        email: e.target.value,
      }
    })
  }

  nextEmailStep2 = () => {
    const { dispatch } = this.props;
    const { params } = this.state;
    if(!params.code) {
      message.error('请输入验证码');
      return;
    }
    dispatch({
      type: 'userAndregister/nextEmailStep2',
      payload: {
        email_address: params.email,
        email_verify_code: params.code,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      clearInterval(this.interval);
      this.setState({
        stepCurrent: 1,
        params: {
          ...params,
          code: params.code,
        }
      });
    })
  }

  subEmailRegister = () => {
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          const { params } = this.state;
          dispatch({
            type: 'userAndregister/emailSubmit',
            payload: {
              email_address: params.email,
              login_pwd: values.password,
            },
          }).then(data => {
            if(data.status != 1) {
              message.error(data.msg);
              return;
            }
            this.setState({
              stepCurrent: 2,
            })
          })
        }
      },
    );
  }

  emailRenderFrom = () => {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const { stepCurrent, params, count } = this.state;
    let renderJsx = '';
    if(stepCurrent == 0) {
      renderJsx = (
        <Form style={{width: '80%', margin: '0 auto'}} {...formItemLayout}>
          <FormItem label="邮箱">
            {getFieldDecorator('mail', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱地址！',
                },
                {
                  type: 'email',
                  message: `邮箱地址格式错误！`,
                },
              ],
            })(
              <Input
                size="large"
                placeholder={'邮箱'}
                onKeyUp={this.hanldeEmail}
              />,
            )}
          </FormItem>
          <FormItem label="邮箱验证码">
            {getFieldDecorator('captcha', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(
              <Input
                size="large"
                style={{
                  width: 156,
                }}
                maxLength={6}
                placeholder={'验证码'}
                onKeyUp={ this.hanldeCaptcha }
              />,
            )}
            <Button
              size="large"
              disabled={!!count}
              className={styles.getCaptcha}
              onClick={this.onGetCaptcha}
              style={{
                width: 140,
                display: 'inline-block',
                marginLeft: 20
              }}
            >
              {count
                ? `${count} s`
                : '获取验证码'}
            </Button>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.nextEmailStep2}
            >
              下一步
            </Button>
          </FormItem>
        </Form>
      )
    }else if(stepCurrent == 1) {
      renderJsx = (
        <Form style={{width: '80%', margin: '0 auto'}} {...formItemLayout}>
          <FormItem label="设置密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  validator: this.checkPassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                maxLength={8}
                style={{
                  width: 360
                }}
                placeholder={`请设置登录密码`}
              />,
            )}
          </FormItem>
          <FormItem label="确认密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                maxLength={8}
                style={{
                  width: 360
                }}
                placeholder={`请重新输入登录密码`}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.subEmailRegister}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      )
    }else if(stepCurrent == 2) {
      renderJsx = (
        <div className={styles.phoneSuccessImg}>
          <img src={img_logon_empty} />
          <div className={styles.txt}>您已成功注册，赶快去<Link to="/user/login" style={{color: '#1890ff'}}>登录~</Link></div>
        </div>
      )
    }

    return renderJsx;
  }

  renderSteps = () => {
    const { tabType, stepCurrent } = this.state;
    let jsx = '';

    jsx = (
      <Steps labelPlacement="vertical" className={styles.stepWrap}>
        {
          stepCurrent == 0 ?
          <Step status="process" className={`${styles.stepOn}`} title="创建账号" />
          :
          <Step status="finish" className={`${styles.stepOn}`} title="创建账号" />
        }
        {
          stepCurrent == 1 ?
          <Step status="process" className={`${styles.stepOn}`} title="设置密码" />
          :
          stepCurrent < 1 ? 
          <Step title="设置密码" />
          :
          <Step status="finish" className={`${styles.stepOn}`} title="设置密码" />
        }
        {
          stepCurrent == 2 ?
          <Step status="process" className={`${styles.stepOn}`} title="成功" />
          :
          stepCurrent < 2 ? 
          <Step title="成功" />
          :
          <Step status="finish" className={`${styles.stepOn}`} title="成功" />
        }
      </Steps>
    );

    return jsx;
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { tabType } = this.state;
    return (
      <div className={styles.main}>
        {this.renderSteps()}
        <div className={styles.cardContainer}>
          <div className={styles.tabs}>
            <div className={`${styles.button} ${tabType == 'phone' && styles.on}`} onClick={() => this.handleTab('phone')}>手机注册</div>
            <div className={`${styles.button} ${tabType == 'email' && styles.on}`} onClick={() => this.handleTab('email')}>邮箱注册</div>
          </div>
          <div className={styles.tabBox}>
            {
              tabType == 'phone' ? 
              this.phoneRenderFrom()
              :
              this.emailRenderFrom()
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(Register);
