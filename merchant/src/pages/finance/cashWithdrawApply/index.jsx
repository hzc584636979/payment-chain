import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Select, } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

const { Option } = Select;
const statusType = {
  0: 'USDT',
};

@connect(({ user, withdrawApply, loading }) => ({
  currentUser: user.currentUser,
  withdrawApply,
  fetchLoading: loading.effects['withdrawApply/fetch'],
}))
class WithdrawApply extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleType = e => {
    this.setState({
      coin_type: e
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

  submit = () => {
    const { 
      coin_type, 
      to_address,
      coin_number,
      telephone_verify_code,
      payType,
    } = this.state;

    if(!payType) {
      message.error('请选择币种后提交');
      return;
    }else if(!coin_type) {
      message.error('请选择币种后提交');
      return;
    }else if(!to_address) {
      message.error('请填写提币地址后提交');
      return;
    }else if(!coin_number || coin_number == 0) {
      message.error('请填写提币数量后提交');
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
      type: 'withdrawApply/submit',
      payload: {
        coin_type, 
        to_address,
        coin_number,
        telephone_verify_code,
      },
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
      }
      this.setState({
        submitLoading: false,
      })
    })
  }

  onGetAll = () => {
    this.setState({
      coin_number: 777856.56
    })
  }

  onCheckItem = payType => {
    this.setState({
      payType
    })
  }

  getWithdrawItem = () => {
    const { currentUser } = this.props;
    const { payType } = this.state;
    let renderStr = <Link to="/account/receiptSettings">尚未设置收款方式，请前往点击设置</Link>;
    if(currentUser) {
      renderStr = (
        <Fragment>
          <Button
            type={payType == 'bank' ? "primary" : ""}
            onClick={() => this.onCheckItem('bank')}
            style={{
              marginRight: 20
            }}
          >
            银行卡
          </Button>
          <Button
            type={payType == 'ali' ? "primary" : ""}
            onClick={() => this.onCheckItem('ali')}
            style={{
              marginRight: 20
            }}
          >
            支付宝
          </Button>
          <Button
            type={payType == 'wx' ? "primary" : ""}
            onClick={() => this.onCheckItem('wx')}
            style={{
              marginRight: 20
            }}
          >
            微信
          </Button>
        </Fragment>
      )
    }
    return renderStr;
  }

  render() {
    const { fetchLoading } = this.props;
    const { 
      coin_number,
      submitLoading,
      count,
    } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>提现金额(元)</span>} className={styles.textTop}>
                <Input onChange={this.handleAddress} style={{width: 385}} placeholder="可提现金额0元" />
                <Button
                  type="primary"
                  onClick={this.onGetAll}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  全部提现
                </Button>
                <p style={{fontSize: 14, color: '#999'}}>
                  <span>≈0 USDT</span>
                </p>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>收款方式</span>}>
                {this.getWithdrawItem()}
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input onChange={this.handleCaptcha} style={{width: 385}} placeholder="输入手机验证码" />
                <Button
                  disabled={!!count}
                  type="primary"
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
                <Button type="primary" loading={submitLoading} onClick={this.submit}>确定提交</Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default WithdrawApply;
