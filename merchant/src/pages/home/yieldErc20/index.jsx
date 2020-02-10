import { Button, Descriptions, Input, Select, Upload, Icon, message, Popover } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import QRCode from 'qrcode.react';
import BigNumber from 'bignumber.js';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';

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

@connect(({ user, yieldErc20, loading }) => ({
  currentUser: user.currentUser,
  yieldErc20,
  fetchLoading: loading.effects['yieldErc20/fetch'],
}))
class YieldErc20 extends Component {
  state = {
    cashType: 1,
    payType: 1,
    imageUrl: null,
    params: {},
  };

  componentDidMount() {}

  componentWillUnmount() {}

  submit = maxBalance => {
    const { currentUser } = this.props;
    const { payType, imageUrl, payment_amount } = this.state;
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
    } = this.state.params;
    let values = {};

    if (!Number(payment_amount) || payment_amount == 0) {
      message.error('请填写出金金额后提交');
      return;
    }

    if (payment_amount > maxBalance) {
      message.error('超过最大可出金金额，可提金额为可出金金额 减去 手续费');
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
      } else if (!imageUrl) {
        message.error('请上传支付宝收款码后提交');
        return;
      }
      values = {
        pay_name: ali_real_name,
        pay_account: ali_number,
        pay_code_url: imageUrl,
      };
    } else if (payType == 3) {
      if (!we_real_name) {
        message.error('请填写姓名后提交');
        return;
      } else if (!we_number) {
        message.error('请填写微信账号后提交');
        return;
      } else if (!imageUrl) {
        message.error('请上传微信收款码后提交');
        return;
      }
      values = {
        pay_name: we_real_name,
        pay_account: we_number,
        pay_code_url: imageUrl,
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
      type: 'yieldErc20/yield',
      payload: {
        ...values,
        pay_type: payType,
        pay_amount: payment_amount,
      },
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
      } else {
        message.success('操作成功');
      }
      this.setState({
        submitLock: false,
      });
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
    this.setState({
      payment_amount: e.target.value,
    });
  };

  changeType = payType => {
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

  handleImgChange = file => {
    if (!beforeUpload(file)) return false;
    getBase64(file, imageUrl => {
      this.setState({
        imageUrl,
        imageUrlLoading: false,
      });
    });
    return false;
  };

  render() {
    const { currentUser, fetchLoading } = this.props;
    const { submitLock, payType, imageUrl, imageUrlLoading, payment_amount, cashType } = this.state;
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
    } = this.state.params;
    const gas = new BigNumber(payment_amount)
      .multipliedBy(new BigNumber(currentUser.gas_percent))
      .toNumber();
    const allBalance = currentUser.id
      ? new BigNumber(wei2USDT(currentUser.erc20.balance))
          .plus(new BigNumber(wei2USDT(currentUser.omni.balance, 'omni')))
          .toNumber()
      : 0;
    const allLockBalance = currentUser.id
      ? new BigNumber(wei2USDT(currentUser.erc20.lock_balance))
          .plus(new BigNumber(wei2USDT(currentUser.omni.lock_balance, 'omni')))
          .toNumber()
      : 0;

    const uploadButton = (
      <div>{imageUrlLoading ? <Icon type="loading" /> : <Icon type="plus" />}</div>
    );

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={<span className={styles.itemLabel}>出金金额</span>}
              className={styles.textTop}
            >
              <Input
                placeholder="请输入出金金额"
                onChange={this.handlePaymentAmount}
                style={{ width: 385, maxWidth: '100%' }}
              />
              <p style={{ fontSize: 14, color: '#333' }}>
                <span>可出金余额:{allBalance - allLockBalance} USDT</span>
                <br />
                <span>
                  当前汇率：1USDT≈￥{(1 * currentUser.token_price * currentUser.rate).toFixed(2)}
                </span>
              </p>
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>手续费</span>}>
              {gas || 0} USDT
            </Descriptions.Item>
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
                <Descriptions.Item
                  label={<span className={styles.itemLabel}>支付宝收款码</span>}
                  className={styles.textTop}
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={this.handleImgChange}
                    accept={'.jpg,.jpeg,.png'}
                  >
                    {imageUrl ? <img width="90" height="90" src={imageUrl} /> : uploadButton}
                  </Upload>
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
                <Descriptions.Item
                  label={<span className={styles.itemLabel}>微信收款码</span>}
                  className={styles.textTop}
                >
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={this.handleImgChange}
                    accept={'.jpg,.jpeg,.png'}
                  >
                    {imageUrl ? <img width="90" height="90" src={imageUrl} /> : uploadButton}
                  </Upload>
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
                maxLength={8}
              />
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button
                type="primary"
                loading={submitLock}
                onClick={() => this.submit(allBalance - allLockBalance - gas)}
              >
                确定提交
              </Button>
              <span style={{ display: 'inline-block', width: '10px' }}></span>
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

export default YieldErc20;
