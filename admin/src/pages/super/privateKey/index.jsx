import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

const { Option } = Select;

@connect(({ privateKey }) => ({
  privateKey,
}))
class PrivateKey extends Component {
  state = {
    token_id: null,
  };

  interval = undefined;

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleType = e => {
    this.setState({
      token_id: e,
      address: null,
      erc20Private: null,
      telephone_verify_code: null,
    });
  };

  onGetPhoneCaptcha = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'privateKey/getCaptcha',
    }).then(data => {
      if(data.status != 1) {
        message.error(captchaError(data.msg));
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

  handleAddress = e => {
    this.setState({
      address: e.target.value
    })
  }

  handlePhoneCaptcha = e => {
    this.setState({
      telephone_verify_code: e.target.value
    })
  }

  handleErc20Private = e => {
    this.setState({
      erc20Private: e.target.value
    })
  }

  submit = () => {
    const { dispatch } = this.props;
    const { telephone_verify_code, erc20Private, address, token_id } = this.state;

    this.setState({
      submitLoading: true,
    })

    dispatch({
      type: 'privateKey/submit',
      payload: {
        chain: token_id == 1 ? 'eth': 'omni',
        address,
        private_key: erc20Private,
        telephone_verify_code,
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
      this.setState({
        erc20Private: null, 
        address: null, 
        telephone_verify_code: null,
      })
    })
  }

  render() {
    const { privateKey } = this.props;
    const { phoneCount, submitLoading, token_id, erc20Private, address, telephone_verify_code } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>钱包类型</span>}>
                <Select disabled={submitLoading} style={{ width: 305 }} onChange={this.handleType} placeholder="请选择钱包类型">
                  {Object.keys(coinType2).map((value, index) => {
                    if (index != 0) {
                      return (
                        <Option value={value} key={value}>
                          {coinType2[value]}
                        </Option>
                      );
                    }
                  })}
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>钱包地址</span>}>
                <Input value={address} onChange={this.handleAddress} style={{width: 305}} placeholder="请输入钱包地址" />
              </Descriptions.Item>
              {
                token_id == 1 &&
                <Descriptions.Item label={<span className={styles.itemLabel}>erc20私钥</span>}>
                  <Input value={erc20Private} onChange={this.handleErc20Private} style={{width: 305}} placeholder="请输入erc20私钥" />
                </Descriptions.Item>
              }
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input value={telephone_verify_code} onChange={this.handlePhoneCaptcha} style={{width: 305}} placeholder="输入手机验证码" maxLength={6} />
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
