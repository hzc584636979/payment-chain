import { Button, Descriptions, Input, Upload, Icon, message, Row, Col } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import copy from 'copy-to-clipboard';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';
import img_zhengmian from '@/assets/img_zhengmian.png';
import img_fanmian from '@/assets/img_fanmian.png';

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

@connect(({ userBase, loading }) => ({
  userBase,
  fetchLoading: loading.effects['userBase/fetch'],
}))
class UserBase extends Component {
  state = {
    params: {}
  };

  interval1 = undefined;
  interval2 = undefined;

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/getUserInfo',
    }).then(data => {
      if(!data){
        return;
      }
      this.setState({
        params: {
          ...data
        }
      })
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval1);
    clearInterval(this.interval2);
  }

  handleChangeIdentityZ = file => {
    if(!beforeUpload(file)) return false;
    getBase64(file, imageUrl =>
      this.setState({
        params: {
          ...this.state.params,
          id_card_front_path: imageUrl
        },
        identityZloading: false,
      }),
    );
    return false;
  }

  handleChangeIdentityF = file => {
    if(!beforeUpload(file)) return false;
    getBase64(file, imageUrl =>
      this.setState({
        params: {
          ...this.state.params,
          id_card_back_path: imageUrl
        },
        identityFloading: false,
      }),
    );
    return false;
  }

  handleNickname = e => {
    this.setState({
      params: {
        ...this.state.params,
        user_name: e.target.value
      }
    })
  }

  handleName = e => {
    this.setState({
      params: {
        ...this.state.params,
        real_name: e.target.value
      }
    })
  }

  handleID = e => {
    this.setState({
      params: {
        ...this.state.params,
        id_number: e.target.value
      },
    })
  }

  handleTx = e => {
    this.setState({
      params: {
        ...this.state.params,
        payment_pwd: e.target.value
      },
    })
  }

  handlePhone = e => {
    this.setState({
      params: {
        ...this.state.params,
        telephone_number: e.target.value
      },
    })
  }

  onGetPhoneCaptcha = () => {
    const { dispatch } = this.props;
    const { telephone_number } = this.state.params;

    if(!telephone_number || !regPhone(telephone_number)) {
      message.error('请输入正确的手机号！');
      return;
    }

    dispatch({
      type: 'userBase/getPhoneCode',
      payload: {
        telephone_number
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      let count = 59;
      this.setState({
        phoneCount: count,
      });
      this.interval1 = window.setInterval(() => {
        count -= 1;
        this.setState({
          phoneCount: count,
        });

        if (count === 0) {
          clearInterval(this.interval1);
        }
      }, 1000);
    })
  }

  handlePhoneCaptcha = e => {
    this.setState({
      params: {
        ...this.state.params,
        telephone_verify_code: e.target.value
      },
    })
  }

  handleEmail = e => {
    this.setState({
      params: {
        ...this.state.params,
        email_address: e.target.value
      },
    })
  }

  onGetEmailCaptcha = () => {
    const { dispatch } = this.props;
    const { email_address } = this.state.params;

    if(!email_address || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email_address))) {
      message.error('请输入正确的邮箱地址！');
      return;
    }

    dispatch({
      type: 'userBase/getEmailCode',
      payload: {
        email_address,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      let count = 59;
      this.setState({
        emailCount: count,
      });
      this.interval2 = window.setInterval(() => {
        count -= 1;
        this.setState({
          emailCount: count,
        });

        if (count === 0) {
          clearInterval(this.interval2);
        }
      }, 1000);
    })
  }

  handleEmailCaptcha = e => {
    this.setState({
      params: {
        ...this.state.params,
        email_verify_code: e.target.value
      },
    })
  }

  handleQQ = e => {
    this.setState({
      params: {
        ...this.state.params,
        qq_number: e.target.value
      },
    })
  }

  handleWX = e => {
    this.setState({
      params: {
        ...this.state.params,
        wechat_number: e.target.value
      },
    })
  }

  handlePaymentLink = e => {
    this.setState({
      params: {
        ...this.state.params,
        payment_link: e.target.value
      },
    })
  }

  handleCopyLink = () => {
    if(copy(this.state.params.payment_link)){
      message.success('复制成功') 
    }else{
      message.error('复制失败，请重试') 
    }
  }

  submit = () => {
    const { 
      user_name, 
      real_name,
      id_number,
      id_card_front_path,
      id_card_back_path,
      payment_pwd,
      telephone_number,
      email_address,
      qq_number,
      wechat_number,
      // payment_link,
      telephone_verify_code,
      email_verify_code,
    } = this.state.params;

    if(!user_name) {
      message.error('请填写商户名称后提交');
      return;
    }else if(!real_name) {
      message.error('请填写真实姓名后提交');
      return;
    }else if(!id_number) {
      message.error('请填写身份证号后提交');
      return;
    }else if(!id_card_front_path) {
      message.error('请上传身份证人像面后提交');
      return;
    }else if(!id_card_back_path) {
      message.error('请上传身份证国徽面后提交');
      return;
    }else if(!payment_pwd) {
      message.error('请填写交易密码后提交');
      return;
    }else if(!telephone_number || !regPhone(telephone_number)) {
      message.error('请填写正确的绑定手机后提交');
      return;
    }else if(!email_address || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email_address))) {
      message.error('请填写正确的绑定邮箱后提交');
      return;
    }else if(!qq_number) {
      message.error('请填写绑定QQ后提交');
      return;
    }else if(!wechat_number) {
      message.error('请填写绑定微信后提交');
      return;
    }/*else if(!payment_link) {
      message.error('请填写收款链接后提交');
      return;
    }*/else if(!email_verify_code) {
      message.error('请填写邮箱验证码后提交');
      return;
    }else if(!telephone_verify_code) {
      message.error('请填写手机验证码后提交');
      return;
    }

    this.setState({
      submitLoading: true,
    })

    const { dispatch } = this.props;
    dispatch({
      type: 'userBase/submit',
      payload: {
        user_name, 
        real_name,
        id_number,
        id_card_front: id_card_front_path,
        id_card_back: id_card_back_path,
        payment_pwd,
        telephone_number,
        email_address,
        qq_number,
        wechat_number,
        // payment_link,
        telephone_verify_code,
        email_verify_code,
      },
    }).then(data => {
      this.setState({
        submitLoading: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'user/getUserInfo',
      }).then(data => {
        this.setState({
          params: {
            ...data
          }
        })
      })
    })
  }

  render() {
    const { userBase, fetchLoading } = this.props;
    const { submitLoading, loading, identityZloading, identityFloading, phoneCount, emailCount } = this.state;
    const { 
      user_name, 
      real_name_passed,
      real_name,
      id_number,
      id_card_front_path,
      id_card_back_path,
      payment_pwd,
      telephone_number,
      email_address,
      qq_number,
      wechat_number,
      payment_link,
      telephone_verify_code,
      email_verify_code,
    } = this.state.params;

    const disabled = real_name_passed || false;

    const uploadZButton = (
      <div>
        {
          identityZloading ?
          <Icon type='loading' />
          :
          <img src={img_zhengmian} />
        }
      </div>
    );
    const uploadFButton = (
      <div>
        {
          identityFloading ?
          <Icon type='loading' />
          :
          <img src={img_fanmian} />
        }
      </div>
    );

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          {
            !disabled && 
            <div className={styles.topTz}>平台为了用户资金安全，实行实名认证制度，用户必须通过商户信息审核后方可使用平台的功能。</div>
          }
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>商户名称</span>}>
                <Input disabled={disabled} onChange={this.handleNickname} style={{width: 385}} placeholder="输入名称" value={user_name} maxLength={30} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>真实姓名</span>}>
                <Input disabled={disabled} onChange={this.handleName} style={{width: 385}} placeholder="输入真实姓名" value={real_name} maxLength={50} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>身份证号</span>}>
                <Input disabled={disabled} onChange={this.handleID} style={{width: 385}} placeholder="输入身份证号" value={id_number} maxLength={30} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>上传身份证</span>} className={styles.textTop}>
                <Row gutter={12}>
                  <Col xl={12} md={24}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      beforeUpload={this.handleChangeIdentityZ}
                      disabled={disabled}
                      accept={'.jpg,.jpeg,.png'}
                    >
                      { id_card_front_path ? <img width="150" height="90" src={id_card_front_path} /> : uploadZButton }
                    </Upload>
                    <div className={styles.upImgDesc}>上传身份证 <span style={{color: '#2194FF'}}>人像面</span></div>
                  </Col>
                  <Col xl={12} md={24}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      beforeUpload={this.handleChangeIdentityF}
                      disabled={disabled}
                      accept={'.jpg,.jpeg,.png'}
                    >
                      { id_card_back_path ? <img width="150" height="90" src={id_card_back_path} /> : uploadFButton }
                    </Upload>
                    <div className={styles.upImgDesc}>上传身份证 <span style={{color: '#2194FF'}}>国徽面</span></div>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>交易密码</span>}>
                <Input disabled={disabled} onChange={this.handleTx} style={{width: 385}} placeholder="输入交易密码" maxLength={8} value={payment_pwd} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>绑定手机</span>}>
                <Input disabled={disabled} onChange={this.handlePhone} style={{width: 385}} placeholder="输入手机号" maxLength={11} value={telephone_number} />
              </Descriptions.Item>
              {
                !disabled && 
                <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                  <Input disabled={disabled} onChange={this.handlePhoneCaptcha} style={{width: 385}} placeholder="输入手机验证码" maxLength={6} />
                  <Button
                    disabled={!!phoneCount}
                    className={styles.getCaptcha}
                    onClick={this.onGetPhoneCaptcha}
                    style={{
                      width: 140,
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    {phoneCount
                      ? `${phoneCount} s`
                      : '获取手机验证码'}
                  </Button>
                </Descriptions.Item>
              }
              <Descriptions.Item label={<span className={styles.itemLabel}>绑定邮箱</span>}>
                <Input disabled={disabled} onChange={this.handleEmail} style={{width: 385}} placeholder="输入邮箱号" value={email_address} />
              </Descriptions.Item>
              {
                !disabled && 
                <Descriptions.Item label={<span className={styles.itemLabel}>邮箱验证码</span>}>
                  <Input disabled={disabled} onChange={this.handleEmailCaptcha} style={{width: 385}} placeholder="输入邮箱验证码" maxLength={6} />
                  <Button
                    disabled={!!emailCount}
                    className={styles.getCaptcha}
                    onClick={this.onGetEmailCaptcha}
                    style={{
                      width: 140,
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    {emailCount
                      ? `${emailCount} s`
                      : '获取邮箱验证码'}
                  </Button>
                </Descriptions.Item>
              }
              <Descriptions.Item label={<span className={styles.itemLabel}>绑定QQ</span>}>
                <Input disabled={disabled} onChange={this.handleQQ} style={{width: 385}} placeholder="输入QQ号" value={qq_number} maxLength={20} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>绑定微信</span>}>
                <Input disabled={disabled} onChange={this.handleWX} style={{width: 385}} placeholder="输入微信号" value={wechat_number} />
              </Descriptions.Item>
              {/*<Descriptions.Item label={<span className={styles.itemLabel}>收款链接</span>}>
                <Input disabled={disabled} onChange={this.handlePaymentLink} style={{width: 385}} placeholder="输入收款链接" value={payment_link} />
                {
                  disabled && 
                  <Button
                    onClick={this.handleCopyLink}
                    style={{
                      width: 140,
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    复制收款链接
                  </Button>
                }
              </Descriptions.Item>*/}
              {
                !disabled &&
                <Descriptions.Item className={styles.noneBeforeIcon}>
                  <Button type="primary" loading={submitLoading} onClick={this.submit}>确定提交</Button>
                </Descriptions.Item>
              }
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default UserBase;
