import { Button, Descriptions, Input, Icon, message, Row, Col, Form, Modal, Popconfirm, Upload } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

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
          })(<Input placeholder="请输入新邮箱" />)}
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
                onClick={() => onGetCaptcha(form.getFieldValue('mobile'))}
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
          })(<Input type="password" placeholder="请输入旧密码" maxLength={24} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
          {form.getFieldDecorator('new_payment_pwd', {
            rules: [{ required: true, message: '请输入新密码' },{ required: true, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,24}$/, message: '新密码必须由大写字母，小写字母，数字且不含有特殊字符组成的6位~24位密码' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入新密码" maxLength={24} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('againPassword', {
            rules: [{ required: true, message: '请确认密码'},{validator: confirmPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请确认密码" maxLength={24} />)}
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
          })(<Input type="password" placeholder="请输入旧密码" maxLength={24} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
          {form.getFieldDecorator('new_login_pwd', {
            rules: [{ required: true, message: '请输入新密码' },{ required: true, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,24}$/, message: '新密码必须由大写字母，小写字母，数字且不含有特殊字符组成的6位~24位密码' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入新密码" maxLength={24} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('againPassword', {
            rules: [{ required: true, message: '请确认密码'},{validator: confirmPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请确认密码" maxLength={24} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

const CreateForgetTPForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, onGetCaptcha, count2, count3 } = props;
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
    if (value && value !== form.getFieldValue('payment_pwd')) {
      callback('您输入的两个密码不一致！');
    } else {
      callback();
    }
  }
  return (
    <Modal
      title="忘记交易密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
          {form.getFieldDecorator('payment_pwd', {
            rules: [{ required: true, message: '请输入新密码' },{ required: true, pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,24}$/, message: '新密码必须由大写字母，小写字母，数字且不含有特殊字符组成的6位~24位密码' },{validator: validateToNextPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请输入新密码" maxLength={24} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('againPassword', {
            rules: [{ required: true, message: '请确认密码'},{validator: confirmPassword},{whitespace: true, message: '不能有空格'}],
          })(<Input type="password" placeholder="请确认密码" maxLength={24} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机验证码">
          <Row gutter={8}>
            <Col span={16}>
              {form.getFieldDecorator('telephone_verify_code', {
                rules: [{ required: true, message: '请输入正确的验证码' }],
              })(<Input placeholder="请输入验证码" maxLength={6} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count2}
                className={styles.getCaptcha}
                onClick={() => onGetCaptcha('phone')}
                style={{
                  width: 140,
                  display: 'inline-block',
                  marginLeft: 20
                }}
              >
                {count2
                  ? `${count2} s`
                  : '获取手机验证码'}
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱验证码">
          <Row gutter={8}>
            <Col span={16}>
              {form.getFieldDecorator('email_verify_code', {
                rules: [{ required: true, message: '请输入正确的验证码' }],
              })(<Input placeholder="请输入验证码" maxLength={6} />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!!count3}
                className={styles.getCaptcha}
                onClick={() => onGetCaptcha('email')}
                style={{
                  width: 140,
                  display: 'inline-block',
                  marginLeft: 20
                }}
              >
                {count3
                  ? `${count3} s`
                  : '获取邮箱验证码'}
              </Button>
            </Col>
          </Row>
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
  interval2 = undefined;
  interval3 = undefined;

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/getUserInfo',
    }).then(data => {
      if(!data){
        return;
      }
      this.setState({
        IPList: data.ip_white_list
      })
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.interval2);
    clearInterval(this.interval3);
  }

  handleChange = file => {
    const { dispatch } = this.props;

    if(!beforeUpload(file)) return false;

    this.setState({
      loading: true,
    })

    getBase64(file, imageUrl => {
      if(!imageUrl) {
        this.setState({
          loading: false,
        })
        return;
      };
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
    });
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

    if(emailVisible && (!value || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email_address)))) {
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
        message.error(captchaError(data.msg));
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

  handleResetMD5 = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userSafe/resetMD5',
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
    })
  }

  handleIPList = e => {
    this.setState({
      IPList: e.target.value,
    })
  }

  handleIP = e => {
    const { dispatch } = this.props;
    const { IPList } = this.state;

    dispatch({
      type: 'userSafe/IP',
      payload: {
        ips: IPList.replace(/\n|\r/g, '')
      },
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
    })
  }

  forgetTPOk = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userSafe/forgetTP',
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
        forgetTPVisible: false,
      })
    })
  }

  forgetTPCancel = () => {
    this.handleModalVisible('forgetTPVisible');
  }

  forgetOnGetCaptcha = type => {
    const { currentUser, dispatch } = this.props;

    if(type == 'phone' && (!currentUser.telephone_number || !regPhone(currentUser.telephone_number))) {
      message.error('请输入正确的手机号！');
      return;
    }

    if(type == 'email' && (!currentUser.email_address || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(currentUser.email_address)))) {
      message.error('请输入正确的邮箱地址！');
      return;
    }

    if(type == 'phone') {
      clearInterval(this.interval2);
    }else {
      clearInterval(this.interval3);
    }
    
    let url = '';
    let params = {};

    if(type == 'phone') {
      url = 'userSafe/getPhoneCode';
      params = {
        telephone_number: currentUser.telephone_number,
      }
    }else if(type == 'email') {
      url = 'userSafe/getEmailCode';
      params = {
        email_address: currentUser.email_address,
      }
    }

    dispatch({
      type: url,
      payload: params,
    }).then(data => {
      if(data.status != 1) {
        message.error(captchaError(data.msg));
        return;
      }else {
        message.success('操作成功');
      }

      let count = 59;
      if(type == 'phone') {
        this.setState({
          count2: count,
        });
        this.interval2 = window.setInterval(() => {
          count -= 1;
          this.setState({
            count2: count,
          });

          if (count === 0) {
            clearInterval(this.interval2);
          }
        }, 1000);
      }else if(type == 'email') {
        this.setState({
          count3: count,
        });
        this.interval3 = window.setInterval(() => {
          count -= 1;
          this.setState({
            count3: count,
          });

          if (count === 0) {
            clearInterval(this.interval3);
          }
        }, 1000);
      }
    })
  }

  render() {
    const { currentUser, fetchLoading } = this.props;
    const { count, phoneVisible, emailVisible, TPVisible, LPVisible, toggleMD5, IPList, loading, logo_path, forgetTPVisible, count2, count3 } = this.state;

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

    const forgetTPMethods = {
      submit: this.forgetTPOk,
      cancel: this.forgetTPCancel,
      onGetCaptcha: this.forgetOnGetCaptcha,
      count2: count2, 
      count3: count3, 
    };

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label="商户logo" className={`${styles.textTop}`}>
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
                <div className={styles.upImgDesc}>图片上传限制:最大2M</div>
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
                <Button
                  type="primary"
                  onClick={() => this.handleModalVisible('forgetTPVisible')}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  忘记交易密码
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
              <Descriptions.Item label="appSecret">
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
                <Popconfirm title="是否要确认重置？" onConfirm={this.handleResetMD5}>
                  <Button
                    type="danger"
                    style={{
                      width: 140,
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    重置
                  </Button>
                </Popconfirm>
              </Descriptions.Item>
              {/*<Descriptions.Item label="谷歌验证器">
                <div style={{display: 'inline-block', width: 385}}>可用于账号登录时进行安全验证</div>
                <Popconfirm title="是否要确认开启谷歌验证器？" onConfirm={this.handleResetMD5}>
                  <Button
                    type="primary"
                    style={{
                      width: 140,
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    开启谷歌验证器
                  </Button>
                </Popconfirm>
              </Descriptions.Item>*/}
              <Descriptions.Item label={<span className={styles.itemLabel}>IP白名单</span>} className={styles.textTop}>
                <p><span style={{color: 'red'}}>设置后仅白名单内的外网IP可访问接口、其他外网IP将被拦截，</span>添加多个请以英文分号（ ; ）隔开</p>
                <p>本机外网IP：{ returnCitySN["cip"] }</p>
                <TextArea placeholder="添加多个请以英文分号（ ; ）隔开" onChange={this.handleIPList} value={IPList} style={{width: 385, height: 100, maxWidth: '100%'}} />
                <Popconfirm title="是否要确认保存？" onConfirm={this.handleIP}>
                  <Button
                    type="primary"
                    style={{
                      width: 140,
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    保存
                  </Button>
                </Popconfirm>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <CreatePhoneForm {...phoneMethods} modalVisible={ phoneVisible } />
        <CreateEmailForm {...emailMethods} modalVisible={ emailVisible } />
        <CreateTPForm {...TPMethods} modalVisible={ TPVisible } />
        <CreateLPForm {...LPMethods} modalVisible={ LPVisible } />
        <CreateForgetTPForm {...forgetTPMethods} modalVisible={ forgetTPVisible } />
      </ContLayout>
    );
  }
}

export default UserSafe;
