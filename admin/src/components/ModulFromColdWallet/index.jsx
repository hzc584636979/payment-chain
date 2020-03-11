import { Button, Descriptions, Input, Icon, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './style.less';

class ModulFromColdWallet extends Component {
  state = {
    editState: false,
  };

  interval = null;

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  modify = () => {
    this.setState({
      editState: true,
    })
  }

  cancel = () => {
    this.setState({
      editState: false,
      address: null,
      captcha: null,
    })
    clearInterval(this.interval);
  }

  _onGetCaptcha = () => {
    this.props.coldwalletInfo.onGetCaptcha().then(data => {
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

  handlePhoneCaptcha = e => {
    this.setState({
      captcha: e.target.value
    })
  }

  handleAddress = e => {
    this.setState({
      address: e.target.value
    })
  }

  _submit = () => {
    const { captcha, address } = this.state;
    this.props.coldwalletInfo.submit({
      chain: this.props.coldwalletInfo.chain,
      address: address,
      telephone_verify_code: captcha,
    }, this.cancel);
  }

  render() {
    const { coldwalletInfo } = this.props;
    const { count, editState, captcha, address } = this.state;
    const { 
      walletType, 
      walletAddress, 
      chain, 
      loading, 
      onGetCaptcha,
      submit 
    } = coldwalletInfo;

    return (
      <Descriptions column={1} className={styles.wrap}>
        <Descriptions.Item label={'钱包类型'}><span style={{color: '#308AFF'}}>{ walletType }</span></Descriptions.Item>
        {
          !editState &&
          <Descriptions.Item label={'冷钱包地址'}>
            <Input disabled={true} style={{width: 315}} value={walletAddress} />
            <Button 
              style={{
                width: 140,
                display: 'inline-block',
                marginLeft: 20
              }}
              onClick={this.modify}
            >
              修改地址
            </Button>
          </Descriptions.Item>
        }
        {
          editState && 
          <Fragment>
            <Descriptions.Item label={<span className={styles.itemLabel}>冷钱包地址</span>}>
              <Input onChange={this.handleAddress} style={{width: 315}} value={address} />
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
              <Input value={captcha} onChange={this.handlePhoneCaptcha} style={{width: 315}} placeholder="输入手机验证码" maxLength={6} />
              <Button
                disabled={!!count}
                className={styles.getCaptcha}
                onClick={this._onGetCaptcha}
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
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button type="primary" loading={loading} onClick={this._submit}>确定提交</Button>
              <span style={{ display: 'inline-block', width: '10px' }}></span>
              <Button onClick={this.cancel}>取消</Button>
            </Descriptions.Item>
          </Fragment>
        }
      </Descriptions>
    );
  }
}

export default ModulFromColdWallet;
