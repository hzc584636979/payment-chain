import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Form, Modal, } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';

const FormItem = Form.Item;

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG文件!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片超过2MB!');
    return false;
  }
  return true;
}

const CreatePhoneForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, count, onGetCaptcha } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  return (
    <Modal
      title="修改手机号"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="旧手机号">
          {form.getFieldDecorator('old_telephone_number', {
            rules: [{ required: true, pattern: /^1\d{10}$/, message: '请输入正确的手机号' }],
          })(<Input placeholder="请输入新手机号" maxLength={11} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新手机号">
          {form.getFieldDecorator('new_telephone_number', {
            rules: [{ required: true, pattern: /^1\d{10}$/, message: '请输入正确的手机号' }],
          })(<Input placeholder="请输入新手机号" maxLength={11} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="验证码">
          <Row gutter={8}>
            <Col span={16}>
              {form.getFieldDecorator('telephone_verify_code', {
                rules: [{ required: true, message: '请输入正确的验证码' }],
              })(<Input placeholder="请输入验证码" maxLength={6} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count}
                className={styles.getCaptcha}
                onClick={() => onGetCaptcha(form.getFieldValue('new_telephone_number'))}
                style={{
                  width: 140,
                  display: 'inline-block',
                  marginLeft: 20
                }}
              >
                {count
                  ? `${count} s`
                  : '获取手机验证码'}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  );
});

const CreateEmailForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, count, onGetCaptcha } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  return (
    <Modal
      title="修改邮箱"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="旧邮箱">
          {form.getFieldDecorator('old_email_address', {
            rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }],
          })(<Input placeholder="请输入旧邮箱" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新邮箱">
          {form.getFieldDecorator('new_email_address', {
            rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }],
          })(<Input placeholder="请输入新邮箱" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="验证码">
          <Row gutter={8}>
            <Col span={16}>
              {form.getFieldDecorator('email_verify_code', {
                rules: [{ required: true, message: '请输入正确的验证码' }],
              })(<Input placeholder="请输入验证码" maxLength={6} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count}
                className={styles.getCaptcha}
                onClick={() => onGetCaptcha(form.getFieldValue('new_email_address'))}
                style={{
                  width: 140,
                  display: 'inline-block',
                  marginLeft: 20
                }}
              >
                {count
                  ? `${count} s`
                  : '获取邮箱验证码'}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  );
});

const CreateTPForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }
  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['againPassword'], { force: true });
    }
    callback();
  }
  const confirmPassword = (rule,value,callback) => {
    if (value && value !== form.getFieldValue('new_payment_pwd')) {
      callback('您输入的两个密码不一致！');
    } else {
      callback();
    }
  }
  return (
    <Modal
      title="修改交易密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="旧密码">
          {form.getFieldDecorator('old_payment_pwd', {
            rules: [{ required: true, message: '请输入旧密码' },{ required: true, pattern: /\w{6,}$/, message: '旧密码最少为6位' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入旧密码" maxLength={8} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
          {form.getFieldDecorator('new_payment_pwd', {
            rules: [{ required: true, message: '请输入新密码' },{ required: true, pattern: /\w{6,}$/, message: '新密码最少为6位' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入新密码" maxLength={8} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('againPassword', {
            rules: [{ required: true, message: '请确认密码'},{validator: confirmPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请确认密码" maxLength={8} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

const CreateLPForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }
  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['againPassword'], { force: true });
    }
    callback();
  }
  const confirmPassword = (rule,value,callback) => {
    if (value && value !== form.getFieldValue('new_login_pwd')) {
      callback('您输入的两个密码不一致！');
    } else {
      callback();
    }
  }
  return (
    <Modal
      title="修改登录密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="旧密码">
          {form.getFieldDecorator('old_login_pwd', {
            rules: [{ required: true, message: '请输入旧密码' },{ required: true, pattern: /\w{6,}$/, message: '旧密码最少为6位' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入旧密码" maxLength={8} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
          {form.getFieldDecorator('new_login_pwd', {
            rules: [{ required: true, message: '请输入新密码' },{ required: true, pattern: /\w{6,}$/, message: '新密码最少为6位' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入新密码" maxLength={8} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('againPassword', {
            rules: [{ required: true, message: '请确认密码'},{validator: confirmPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请确认密码" maxLength={8} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ user, userSafe, loading }) => ({
  currentUser: user.currentUser,
  userSafe,
  fetchLoading: loading.effects['user/getUserInfo'],
}))
class UserSafe extends Component {
  state = {
    loading: false,
    count: 0,
    phoneVisible: false,
    emailVisible: false,
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/getUserInfo',
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleChange = file => {
    const { dispatch } = this.props;

    if(!beforeUpload(file)) return false;

    this.setState({
      loading: true,
    })

    getBase64(file, imageUrl =>
      dispatch({
        type: 'userSafe/modifyLogo',
        payload: {
          logo: imageUrl
        },
      }).then(data => {
        this.setState({
          loading: false,
        })
        if(data.status != 1) {
          message.error(data.msg);
          return;
        }else {
          message.success('操作成功');
        }
        dispatch({
          type: 'user/getUserInfo',
        })
      })
    );
    return false;
  }

  handleModalVisible = (type) => {
    this.setState({
      [type]: !this.state[type],
    })
  }

  onGetCaptcha = value => {
    const { dispatch } = this.props;
    const { phoneVisible, emailVisible } = this.state;

    if(phoneVisible && (!value || !regPhone(value))) {
      message.error('请输入正确的手机号！');
      return;
    }

    if(emailVisible && (!value || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)))) {
      message.error('请输入正确的邮箱地址！');
      return;
    }

    clearInterval(this.interval);

    let url = '';
    let params = {};

    if(phoneVisible) {
      url = 'userSafe/getPhoneCode';
      params = {
        telephone_number: value,
      }
    }else if(emailVisible) {
      url = 'userSafe/getEmailCode';
      params = {
        email_address: value,
      }
    }

    dispatch({
      type: url,
      payload: params,
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

  phoneOk = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userSafe/revisePhone',
      payload: fieldsValue,
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'user/getUserInfo',
      })
      this.setState({
        phoneVisible: false,
      })
    })
  }

  phoneCancel = () => {
    this.handleModalVisible('phoneVisible');
  }

  emailOk = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userSafe/reviseEmail',
      payload: fieldsValue,
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'user/getUserInfo',
      })
      this.setState({
        emailVisible: false,
      })
    })
  }

  emailCancel = () => {
    this.handleModalVisible('emailVisible');
  }

  TPOk = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userSafe/reviseTP',
      payload: fieldsValue,
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'user/getUserInfo',
      })
      this.setState({
        TPVisible: false,
      })
    })
  }

  TPCancel = () => {
    this.handleModalVisible('TPVisible');
  }

  LPOk = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userSafe/reviseLP',
      payload: fieldsValue,
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'user/getUserInfo',
      })
      this.setState({
        LPVisible: false,
      })
    })
  }

  LPCancel = () => {
    this.handleModalVisible('LPVisible');
  }

  handleToggleMD5 = () => {
    this.setState({
      toggleMD5: !this.state.toggleMD5
    })
  }

  render() {
    const { currentUser, fetchLoading } = this.props;
    const { count, phoneVisible, emailVisible, TPVisible, LPVisible, toggleMD5, loading, logo_path } = this.state;

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
      </div>
    );

    const phoneMethods = {
      submit: this.phoneOk,
      cancel: this.phoneCancel,
      onGetCaptcha: this.onGetCaptcha,
      count, 
    };

    const emailMethods = {
      submit: this.emailOk,
      cancel: this.emailCancel,
      onGetCaptcha: this.onGetCaptcha,
      count, 
    };

    const TPMethods = {
      submit: this.TPOk,
      cancel: this.TPCancel,
    };

    const LPMethods = {
      submit: this.LPOk,
      cancel: this.LPCancel,
    };

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label="承兑商logo" className={`${styles.textTop}`}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={this.handleChange}
                  disabled={loading}
                  accept={'.jpg,.jpeg,.png'}
                >
                  { currentUser.logo_path ? <img width="103" height="103" src={currentUser.logo_path} /> : uploadButton }
                </Upload>
                <div className={styles.upImgDesc}>图片上传限制:最大2MB</div>
              </Descriptions.Item>
              <Descriptions.Item label="绑定手机号">
                <Input disabled={true} style={{width: 385}} value={currentUser.telephone_number} />
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible('phoneVisible')}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  修改手机号
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="绑定邮箱">
                <Input disabled={true} style={{width: 385}} value={currentUser.email_address} />
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible('emailVisible')}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  修改邮箱
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="交易密码">
                <Input type="password" value={currentUser.payment_pwd} disabled={true} style={{width: 385}} />
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible('TPVisible')}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  修改交易密码
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="登录密码">
                <Input type="password" value={currentUser.login_pwd} disabled={true} style={{width: 385}} />
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible('LPVisible')}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  修改登录密码
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="appKey">
                {currentUser.app_key}
              </Descriptions.Item>
              <Descriptions.Item label="MD5Key">
                <Input type={ toggleMD5 ? 'input' : 'password' } value={currentUser.app_secret} disabled={true} style={{width: 385}} />
                <Button
                  type="primary"
                  onClick={this.handleToggleMD5}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  { toggleMD5 ? '隐藏' : '查看' }
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <CreatePhoneForm {...phoneMethods} modalVisible={ phoneVisible } />
        <CreateEmailForm {...emailMethods} modalVisible={ emailVisible } />
        <CreateTPForm {...TPMethods} modalVisible={ TPVisible } />
        <CreateLPForm {...LPMethods} modalVisible={ LPVisible } />
      </ContLayout>
    );
  }
}

export default UserSafe;
