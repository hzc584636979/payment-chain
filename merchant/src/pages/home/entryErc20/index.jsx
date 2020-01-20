import { Button, Descriptions, Input, Select, Upload, Icon, message, Popover } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import QRCode  from 'qrcode.react';
import styles from './style.less';

@connect(({ user, entryErc20, loading }) => ({
  currentUser: user.currentUser,
  entryErc20,
  fetchLoading: loading.effects['entryErc20/fetch'],
}))
class EntryErc20 extends Component {
  state = {
    payType: 0,
    imageUrl: null,
    params: {},
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  submit = () => {
    const { currentUser } = this.props;
    const { payType, payment_amount } = this.state;
    const { payment_name } = this.state.params;
    let values = {};

    if(!Number(payment_amount) || payment_amount == 0) {
      message.error('请填写入金金额后提交');
      return;
    }

    if(!payment_name) {
      message.error('请填写付款人姓名后提交');
      return;
    }

    this.setState({
      submitLock: true,
    })
    
    const { dispatch } = this.props;
    dispatch({
      type: 'entryErc20/entry',
      payload: {
        payment_name,
        payment_amount,
        gas: currentUser.gas,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        submitLock: false,
      })
    })
  }

  handleUpKey = (e, key) => {
    this.setState({
      params: {
        ...this.state.params,
        [key]: e.target.value
      }
    })
  }

  handlePaymentAmount = e => {
    this.setState({
      payment_amount: e.target.value
    })
  } 

  changeType = payType => {
    this.setState({
      payType,
      params: {},
    })
  }

  render() {
    const { currentUser, fetchLoading } = this.props;
    const { submitLock, payType } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label={<span className={styles.itemLabel}>入金金额</span>} className={styles.textTop}>
              <Input placeholder="请输入出金金额" onChange={this.handlePaymentAmount} style={{width: 385, maxWidth: '100%'}} />
              <p style={{fontSize: 14, color: '#333'}}>
                <span>当前汇率：1USDT≈￥{ (1 * currentUser.token_price * currentUser.rate).toFixed(2) }</span>
              </p>
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>手续费</span>}>
              {currentUser.gas} USDT 
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>支付方式</span>}>
              <Button style={{marginRight: 20}} type={payType == 1 ? "primary" : null} onClick={() => this.changeType(1)}>银行卡</Button>
              <Button style={{marginRight: 20}} type={payType == 2 ? "primary" : null} onClick={() => this.changeType(2)}>支付宝</Button>
              <Button style={{marginRight: 20}} type={payType == 3 ? "primary" : null} onClick={() => this.changeType(3)}>微信</Button>
              <Button style={{marginRight: 20}} type={payType == 4 ? "primary" : null} onClick={() => this.changeType(4)}>VISA</Button>
              <Button type={payType == 5 ? "primary" : null} onClick={() => this.changeType(5)}>Paypal</Button>
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>付款人姓名</span>}>
              <Input placeholder="请输入付款人姓名" onChange={e => this.handleUpKey(e, 'payment_name')} style={{width: 385, maxWidth: '100%'}} />
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button type="primary" loading={submitLock} onClick={this.submit}>确定提交</Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to="/order/goldEntryOrder?history">返回</Link>
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default EntryErc20;
