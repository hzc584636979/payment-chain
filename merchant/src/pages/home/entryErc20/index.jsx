import { Button, Descriptions, Input, Select, Upload, Icon, message, Popover } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect, routerRedux } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import QRCode from 'qrcode.react';
import BigNumber from 'bignumber.js';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';

@connect(({ entryErc20, loading }) => ({
  currentUser: entryErc20.currentUser,
  entryErc20,
  fetchLoading: loading.effects['entryErc20/fetch'],
}))
class EntryErc20 extends Component {
  state = {
    cashType: 1,
    payType: 1,
    params: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'entryErc20/getCoinInfo',
    });
  }

  componentWillUnmount() {}

  submit = () => {
    const { currentUser } = this.props;
    const { payType, payment_amount, cashType } = this.state;
    const {
      bank_name,
      bank_number,
      bank_real_name,
      ali_real_name,
      ali_number,
      we_real_name,
      we_number,
      paypal_real_name,
      visa_name,
      visa_number,
      visa_real_name,
      paypal_number,
      payment_pwd,
      telephone_number,
      id_number,
    } = this.state.params;
    let values = {};

    if (!Number(payment_amount) || payment_amount == 0) {
      message.error('请填写入金金额后提交');
      return;
    }else if(!id_number || !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_number))) {
      message.error('请填写正确的身份证号后提交');
      return;
    }else if(!telephone_number || !regPhone(telephone_number)) {
      message.error('请填写正确的绑定手机后提交');
      return;
    }

    if (payment_amount < 10) {
      message.error('最小入金金额为10元');
      return;
    }else if((payType == 2 || payType == 3) && payment_amount > 50000) {
      message.error('支付宝或微信最大交易金额为5万元');
      return;
    }else if(payment_amount > 1000000) {
      message.error('银行卡最大交易金额为100万元');
      return;
    }else if(payment_amount.toString().indexOf('.') > -1 && payment_amount.toString().split('.')[1].length > 2) {
      message.error('入金金额的小数不能多于2位');
      return;
    }

    if (payType == 1) {
      if (!bank_real_name) {
        message.error('请填写持卡人姓名后提交');
        return;
      } else if (!bank_number || !regBankNumber(bank_number)) {
        message.error('请填写正确的银行卡号后提交，银行卡位数为16位~19位');
        return;
      } else if (!bank_name) {
        message.error('请填写开户行后提交');
        return;
      }
      values = {
        pay_name: bank_real_name,
        pay_account: bank_number,
        account_bank_name: bank_name,
      };
    } else if (payType == 2) {
      if (!ali_real_name) {
        message.error('请填写姓名后提交');
        return;
      } else if (!ali_number) {
        message.error('请填写支付宝账号后提交');
        return;
      }
      values = {
        pay_name: ali_real_name,
        pay_account: ali_number,
        account_bank_name: null,
      };
    } else if (payType == 3) {
      if (!we_real_name) {
        message.error('请填写姓名后提交');
        return;
      } else if (!we_number) {
        message.error('请填写微信账号后提交');
        return;
      }
      values = {
        pay_name: we_real_name,
        pay_account: we_number,
        account_bank_name: null,
      };
    } else if (payType == 4) {
      if (!visa_real_name) {
        message.error('请填写持卡人姓名后提交');
        return;
      } else if (!visa_number || !regBankNumber(visa_number)) {
        message.error('请填写正确的银行卡号后提交，银行卡位数为16位~19位');
        return;
      } else if (!visa_name) {
        message.error('请填写开户行后提交');
        return;
      }
      values = {
        pay_name: visa_real_name,
        pay_account: visa_number,
        account_bank_name: visa_name,
      };
    } else if (payType == 5) {
      if (!paypal_real_name) {
        message.error('请填写姓名后提交');
        return;
      } else if (!paypal_number) {
        message.error('请填写Paypal账号后提交');
        return;
      }
      values = {
        pay_name: paypal_real_name,
        pay_account: paypal_number,
        account_bank_name: null,
      };
    }

    if (!payment_pwd) {
      message.error('请填写交易密码后提交');
      return;
    }

    this.setState({
      submitLock: true,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'entryErc20/entry',
      payload: {
        ...values,
        pay_type: payType,
        pay_amount: Number(payment_amount),
        payment_pwd,
        currency_type: cashType,
        id_number,
        telephone_number,
      },
    }).then(data => {
      this.setState({
        submitLock: false,
      });
      if (data.status != 1) {
        message.error(data.msg);
      } else {
        /*message.success('操作成功');*/
        dispatch(routerRedux.push(`/entry/entryUSDT/${data.data.order_id}`));
      }
    });
  };

  handleUpKey = (e, key) => {
    this.setState({
      params: {
        ...this.state.params,
        [key]: e.target.value,
      },
    });
  };

  handlePaymentAmount = e => {
    let payment_amount = e.target.value;
    const { payType } = this.state;
    if(!Number(payment_amount) && payment_amount != 0) {
      this.setState({
        payment_amount_errmsg: '请输入数字的入金金额'
      })
    }else if(payment_amount <= 0) {
      this.setState({
        payment_amount_errmsg: '入金金额最小金额为10元'
      })
    }else if((payType == 2 || payType == 3) && payment_amount > 50000) {
      payment_amount = 50000;
    }else if((payType == 1 || payType == 4 || payType == 5) && payment_amount > 1000000) {
      payment_amount = 1000000;
    }else {
      this.setState({
        payment_amount_errmsg: null,
      });
    }

    if(parseFloat(payment_amount) && payment_amount.toString().indexOf('.') > -1) {
      let int = payment_amount.toString().split('.')[0];
      let float = payment_amount.toString().split('.')[1];
      if(float.length > 2) {
        payment_amount = int+'.'+float.substr(0, 2);
      }
    }
    this.setState({
      payment_amount,
    });
  };

  changeType = payType => {
    const { payment_amount } = this.state;
    if(Number(payment_amount)) {
      if((payType == 2 || payType == 3) && payment_amount > 50000) {
        this.setState({
          payment_amount: 50000
        })
      }else if((payType == 1 || payType == 4 || payType == 5) && payment_amount > 1000000) {
        this.setState({
          payment_amount: 1000000
        })
      }
    }
    this.setState({
      payType,
      imageUrl: null,
      params: {},
    });
  };

  changeCashType = cashType => {
    this.setState({
      cashType,
      payType: cashType == 1 ? 1 : 4,
      imageUrl: null,
      params: {},
    });
  };

  render() {
    const { currentUser, fetchLoading } = this.props;
    const { submitLock, payType, payment_amount, cashType, payment_amount_errmsg } = this.state;
    const {
      bank_name,
      bank_number,
      bank_real_name,
      ali_real_name,
      ali_number,
      we_real_name,
      we_number,
      paypal_real_name,
      visa_name,
      visa_number,
      visa_real_name,
      paypal_number,
      payment_pwd,
      telephone_number,
      id_number,
    } = this.state.params;
    const cashToCoin = 
      cashType == 1 ?
      new BigNumber(payment_amount || 0)
      .dividedBy(new BigNumber(currentUser.token_price))
      .dividedBy(new BigNumber(currentUser.rate))
      .toNumber()
      :
      new BigNumber(payment_amount || 0)
      .dividedBy(new BigNumber(currentUser.token_price))
      .toNumber();
    const gas = new BigNumber(cashToCoin)
      .multipliedBy(new BigNumber(currentUser.ru_gas_percent))
      .toNumber();

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label={<span className={styles.itemLabel}>现金类型</span>}>
              <Button
                style={{ marginRight: 20 }}
                type={cashType == 1 ? 'primary' : null}
                onClick={() => this.changeCashType(1)}
              >
                CNY
              </Button>
              <Button
                style={{ marginRight: 20 }}
                type={cashType == 2 ? 'primary' : null}
                onClick={() => this.changeCashType(2)}
              >
                USD
              </Button>
            </Descriptions.Item>
            {cashType == 1 ? (
              <Descriptions.Item label={<span className={styles.itemLabel}>支付方式</span>}>
                <Button
                  style={{ marginRight: 20 }}
                  type={payType == 1 ? 'primary' : null}
                  onClick={() => this.changeType(1)}
                >
                  银行卡
                </Button>
                <Button
                  style={{ marginRight: 20 }}
                  type={payType == 2 ? 'primary' : null}
                  onClick={() => this.changeType(2)}
                >
                  支付宝
                </Button>
                <Button
                  style={{ marginRight: 20 }}
                  type={payType == 3 ? 'primary' : null}
                  onClick={() => this.changeType(3)}
                >
                  微信
                </Button>
              </Descriptions.Item>
            ) : (
              <Descriptions.Item label={<span className={styles.itemLabel}>支付方式</span>}>
                <Button
                  style={{ marginRight: 20 }}
                  type={payType == 4 ? 'primary' : null}
                  onClick={() => this.changeType(4)}
                >
                  VISA
                </Button>
                <Button type={payType == 5 ? 'primary' : null} onClick={() => this.changeType(5)}>
                  Paypal
                </Button>
              </Descriptions.Item>
            )}
            <Descriptions.Item
              label={<span className={styles.itemLabel}>当前汇率(USDT:CNY)</span>}
              className={styles.textTop}
            >
              <span style={{verticalAlign: 'middle'}}>{`1:${(1 * currentUser.token_price * currentUser.rate).toFixed(2)}`}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={styles.itemLabel}>入金金额</span>}
              className={styles.textTop}
            >
              <Input
                placeholder="请输入入金金额"
                onChange={this.handlePaymentAmount}
                style={{ width: 385, maxWidth: '100%' }}
                value={payment_amount}
              />
              <span style={{position: 'relative', right: 43, top: 0, color: '#999'}}>{
                cashType == 1 ? 'CNY' : 'USD'
              }</span>
              <p style={{ fontSize: 14, color: '#333' }}>
                {
                  payment_amount_errmsg &&
                  <Fragment>
                    <span style={{color: '#ff4141'}}>{payment_amount_errmsg}</span>
                    <br/>
                  </Fragment>
                }
                <span>
                  当前入金代币：{cashToCoin} USDT <span style={{color: '#ff4141'}}>(汇率实时变动，具体金额以订单为准)</span>
                </span>
                <br/>
                <span>
                  手续费：
                  {
                    `${new BigNumber(payment_amount || 0)
                              .multipliedBy(new BigNumber(currentUser.ru_gas_percent))
                              .toNumber()} ${cashType == 1 ? 'CNY' : 'USD'}`
                  } ≈ {gas || 0} USDT
                </span>
                <br/>
                <span>
                  限额：
                  {
                    (payType == 1 || payType == 4 || payType == 5) ?
                    100
                    :
                    5
                  } 
                  万
                </span>
              </p>
            </Descriptions.Item>

            {payType == 1 && (
              <Fragment>
                <Descriptions.Item label={<span className={styles.itemLabel}>持卡人姓名</span>}>
                  <Input
                    value={bank_real_name}
                    placeholder="请输入持卡人姓名"
                    onChange={e => this.handleUpKey(e, 'bank_real_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={30}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>银行卡号</span>}>
                  <Input
                    value={bank_number}
                    placeholder="请输入银行卡号"
                    onChange={e => this.handleUpKey(e, 'bank_number')}
                    style={{ width: 385, maxWidth: '100%' }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>开户行</span>}>
                  <Input
                    value={bank_name}
                    placeholder="请输入开户行"
                    onChange={e => this.handleUpKey(e, 'bank_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                  />
                </Descriptions.Item>
              </Fragment>
            )}

            {payType == 2 && (
              <Fragment>
                <Descriptions.Item label={<span className={styles.itemLabel}>姓名</span>}>
                  <Input
                    value={ali_real_name}
                    placeholder="请输入姓名"
                    onChange={e => this.handleUpKey(e, 'ali_real_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={30}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>支付宝账号</span>}>
                  <Input
                    value={ali_number}
                    placeholder="请输入支付宝账号"
                    onChange={e => this.handleUpKey(e, 'ali_number')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={60}
                  />
                </Descriptions.Item>
              </Fragment>
            )}

            {payType == 3 && (
              <Fragment>
                <Descriptions.Item label={<span className={styles.itemLabel}>姓名</span>}>
                  <Input
                    value={we_real_name}
                    placeholder="请输入姓名"
                    onChange={e => this.handleUpKey(e, 'we_real_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={30}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>微信账号</span>}>
                  <Input
                    value={we_number}
                    placeholder="请输入微信账号"
                    onChange={e => this.handleUpKey(e, 'we_number')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={60}
                  />
                </Descriptions.Item>
              </Fragment>
            )}

            {payType == 4 && (
              <Fragment>
                <Descriptions.Item label={<span className={styles.itemLabel}>持卡人姓名</span>}>
                  <Input
                    value={visa_real_name}
                    placeholder="请输入持卡人姓名"
                    onChange={e => this.handleUpKey(e, 'visa_real_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={30}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>银行卡号</span>}>
                  <Input
                    value={visa_number}
                    placeholder="请输入银行卡号"
                    onChange={e => this.handleUpKey(e, 'visa_number')}
                    style={{ width: 385, maxWidth: '100%' }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>开户行</span>}>
                  <Input
                    value={visa_name}
                    placeholder="请输入开户行"
                    onChange={e => this.handleUpKey(e, 'visa_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                  />
                </Descriptions.Item>
              </Fragment>
            )}

            {payType == 5 && (
              <Fragment>
                <Descriptions.Item label={<span className={styles.itemLabel}>姓名</span>}>
                  <Input
                    value={paypal_real_name}
                    placeholder="请输入姓名"
                    onChange={e => this.handleUpKey(e, 'paypal_real_name')}
                    style={{ width: 385, maxWidth: '100%' }}
                    maxLength={30}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>Paypal账号</span>}>
                  <Input
                    value={paypal_number}
                    placeholder="请输入Paypal账号"
                    onChange={e => this.handleUpKey(e, 'paypal_number')}
                    style={{ width: 385, maxWidth: '100%' }}
                  />
                </Descriptions.Item>
              </Fragment>
            )}

            <Descriptions.Item label={<span className={styles.itemLabel}>交易密码</span>}>
              <Input
                value={payment_pwd}
                placeholder="请输入交易密码"
                onChange={e => this.handleUpKey(e, 'payment_pwd')}
                style={{ width: 385, maxWidth: '100%' }}
                maxLength={24}
                type="password"
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={styles.itemLabel}>付款款人手机号</span>}
              className={styles.textTop}
            >
              <Input
                value={telephone_number}
                placeholder="请输入付款款人手机号"
                onChange={e => this.handleUpKey(e, 'telephone_number')}
                style={{ width: 385, maxWidth: '100%' }}
                maxLength={11}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={<span className={styles.itemLabel}>付款人身份证</span>}
              className={styles.textTop}
            >
              <Input
                value={id_number}
                placeholder="请输入付款人身份证"
                onChange={e => this.handleUpKey(e, 'id_number')}
                style={{ width: 385, maxWidth: '100%' }}
                maxLength={18}
              />
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button type="primary" loading={submitLock} onClick={this.submit}>
                确定提交
              </Button>
              <span style={{ display: 'inline-block', width: '10px' }}></span>
              <Button>
                <Link to="/order/goldEntryOrder">返回</Link>
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default EntryErc20;
