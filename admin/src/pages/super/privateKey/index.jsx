import { Button, Descriptions, Input, Upload, Icon, message, Row, Col } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

@connect(({ user, privateKey }) => ({
  currentUser: user.currentUser,
  privateKey,
}))
class PrivateKey extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetPhoneCaptcha = () => {
    const { dispatch, currentUser } = this.props;
    const { telephone_number } = this.currentUser;

    dispatch({
      type: 'privateKey/getPhoneCode',
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
      this.interval = window.setInterval(() => {
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
      telephone_verify_code: e.target.value
    })
  }

  handlePrivate = e => {
    this.setState({
      privateKey: e.target.value
    })
  }

  submit = () => {
    const { dispatch, currentUser } = this.props;
    const { telephone_number } = this.currentUser;
    const { telephone_verify_code, privateKey } = this.state;

    this.setState({
      submitLoading: true,
    })

    dispatch({
      type: 'privateKey/submit',
      payload: {
        privateKey,
        telephone_verify_code,
        telephone_number,
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
    })
  }

  render() {
    const { privateKey } = this.props;
    const { phoneCount, submitLoading } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={'私钥地址'}>
                <Input disabled={true} style={{width: 305}} placeholder="1213121" />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input onChange={this.handlePhoneCaptcha} style={{width: 305}} placeholder="输入手机验证码" maxLength={6} />
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
              <Descriptions.Item label={<span className={styles.itemLabel}>新私钥地址</span>}>
                <Input onChange={this.handlePrivate} style={{width: 305}} placeholder="请输入新私钥地址" />
              </Descriptions.Item>
              <Descriptions.Item className={styles.noneBeforeIcon}>
                <Button type="primary" loading={submitLoading} onClick={this.submit}>确定提交</Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default PrivateKey;
