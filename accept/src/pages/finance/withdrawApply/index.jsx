import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Select } from 'antd';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import BigNumber from 'bignumber.js';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

const { Option } = Select;

@connect(({ user, withdrawApply, loading }) => ({
  currentUser: user.currentUser,
  withdrawApply,
}))
class WithdrawApply extends Component {
  state = {
    token_id: null,
  };

  interval = undefined;

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.clearData();
  }

  clearData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'withdrawApply/clear',
    })
  }

  handleType = e => {
    this.setState({
      token_id: e,
      to_address: null,
      coin_number: null,
      telephone_verify_code: null,
    })
  }

  handleAddress = e => {
    this.setState({
      to_address: e.target.value
    })
  }

  handleCoin = e => {
    this.setState({
      coin_number: e.target.value
    })
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'withdrawApply/getCode',
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

  handleCaptcha = e => {
    this.setState({
      telephone_verify_code: e.target.value,
    })
  }

  submit = maxBalance => {
    const { withdrawApply } = this.props;
    const { 
      token_id, 
      to_address,
      coin_number,
      telephone_verify_code,
    } = this.state;

    if(!token_id) {
      message.error('请选择币种后提交');
      return;
    }else if(!to_address) {
      message.error('请填写提币地址后提交');
      return;
    }else if(!Number(coin_number) || coin_number == 0) {
      message.error('请填写提币数量后提交');
      return;
    }else if(!telephone_verify_code) {
      message.error('请填写手机验证码后提交');
      return;
    }

    if(coin_number <= 0) {
      message.error('金额不能小于0');
      return;
    }

    if(coin_number > maxBalance) {
      message.error('超过最大金额，可提金额为可用余额 减去 手续费');
      return;
    }

    this.setState({
      submitLoading: true,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'withdrawApply/submit',
      payload: {
        token_id, 
        to_address,
        coin_number,
        telephone_verify_code,
      },
    }).then(data => {
      this.setState({
        submitLoading: false,
      })
      if(data.status != 1){
        message.error(data.msg);
        return;
      }else {
        if(data.data.withdraw_without_audit) {
          message.success('提现成功');
        }else {
          message.success('提现申请已提交，请耐心等待管理员审核');
        }
      }
      this.handleType(token_id);
    })
  }

  onGetAll = maxBalance => {
    this.setState({
      coin_number: maxBalance
    })
  }

  render() {
    const { currentUser, withdrawApply, fetchLoading } = this.props;
    const { 
      to_address,
      coin_number,
      submitLoading,
      count,
      token_id,
      telephone_verify_code,
    } = this.state;
    const allBalance = currentUser.id ? new BigNumber(wei2USDT(currentUser.erc20.balance)).plus(new BigNumber(wei2USDT(currentUser.omni.balance, 'omni'))).toNumber() : 0;
    const allLockBalance = currentUser.id ? new BigNumber(wei2USDT(currentUser.erc20.lock_balance)).plus(new BigNumber(wei2USDT(currentUser.omni.lock_balance, 'omni'))).toNumber() : 0;
    const gas = currentUser.id
      ? currentUser.erc20.gas
      : 0;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>提币</span>}>
                <Select placeholder="选择币种" style={{width: 385}} onChange={this.handleType}>
                  {
                    Object.keys(coinType2).map((value, index) => {
                      if(index != 0) {
                        return <Option value={value} key={value}>{coinType2[value]}</Option>
                      }
                    })
                  }
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>提币地址</span>}>
                <Input value={to_address} onChange={this.handleAddress} style={{width: 385}} placeholder="输入提币地址" />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>提币数量</span>} className={styles.textTop}>
                <Input onChange={this.handleCoin} style={{width: 385}} placeholder="请输入提币数量" value={coin_number} />
                {
                  token_id && 
                  <Fragment>
                    <Button
                      onClick={() => this.onGetAll(new BigNumber(allBalance).minus(new BigNumber(allLockBalance)).minus(new BigNumber(gas)).toNumber())}
                      style={{
                        width: 140,
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      全部提币
                    </Button>
                    <p style={{fontSize: 14, color: '#333'}}>
                      {/*<span style={{paddingRight: 10}}>手续费:{ gas } USDT</span>*/}<span>可用余额:{ new BigNumber(allBalance)
                          .minus(new BigNumber(allLockBalance))
                          .toNumber() } USDT</span>
                    </p>
                  </Fragment>
                }
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input value={telephone_verify_code} onChange={this.handleCaptcha} style={{width: 385}} placeholder="输入手机验证码" maxLength={6} />
                <Button
                  disabled={!!count}
                  onClick={this.onGetCaptcha}
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
                <Button type="primary" loading={submitLoading} onClick={() => this.submit(new BigNumber(allBalance).minus(new BigNumber(allLockBalance)).minus(new BigNumber(gas)).toNumber())}>确定提交</Button>
                <Button
                  type="link"
                >
                  <Link to="/finance/withdrawList">提币/充币查询</Link>
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default WithdrawApply;
