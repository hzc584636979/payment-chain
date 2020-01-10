import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Select, } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

const { Option } = Select;

@connect(({ withdrawApply, loading }) => ({
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
    this.clearData();
  }

  clearData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'withdrawApply/clear',
    })
  }

  handleType = e => {
    const { dispatch } = this.props;

    dispatch({
      type: 'withdrawApply/getCoinInfo',
      payload: {
        walletType: Number(e) - 1,
      }
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        token_id: e
      })
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
        message.error(data.msg);
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
    const { withdrawApply } = this.props;
    const { 
      token_id, 
      to_address,
      coin_number,
      telephone_verify_code,
    } = this.state;
    if(!token_id || !to_address || !coin_number || coin_number == 0 || !telephone_verify_code){
      message.error('请填写完整信息后提交');
      return;
    }

    if(coin_number > withdrawApply.balance) {
      message.error('超过最大金额');
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
      if(data.status != 1){
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        submitLoading: false,
      })
    })
  }

  onGetAll = () => {
    const { withdrawApply } = this.props;
    this.setState({
      coin_number: withdrawApply.balance
    })
  }

  render() {
    const { withdrawApply, fetchLoading } = this.props;
    const { 
      coin_number,
      submitLoading,
      count,
    } = this.state;

    return (
      <ContLayout loading={fetchLoading || submitLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>提币</span>}>
                <Select placeholder="选择币种" style={{width: 385}} onChange={this.handleType}>
                  {
                    Object.keys(coinType).map((value, index) => {
                      if(index != 0) {
                        return <Option value={value} key={value}>{coinType[value]}</Option>
                      }
                    })
                  }
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>提币地址</span>}>
                <Input onChange={this.handleAddress} style={{width: 385}} placeholder="输入提币地址" />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>提币数量</span>} className={styles.textTop}>
                <Input onChange={this.handleCoin} style={{width: 385}} placeholder="请输入提币数量" value={coin_number} />
                {
                  withdrawApply.type && 
                  <Fragment>
                    <Button
                      onClick={this.onGetAll}
                      style={{
                        width: 140,
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      全部提币
                    </Button>
                    <p style={{fontSize: 14, color: '#333'}}>
                      <span style={{paddingRight: 10}}>手续费:{ withdrawApply.gas } USDT</span><span>可用余额:{ withdrawApply.balance } USDT</span>
                    </p>
                  </Fragment>
                }
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input onChange={this.handleCaptcha} style={{width: 385}} placeholder="输入手机验证码" />
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
