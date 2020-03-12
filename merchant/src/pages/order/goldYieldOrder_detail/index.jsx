import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ goldYieldOrderDetail, loading }) => ({
  goldYieldOrderDetail,
  loading: loading.effects['goldYieldOrderDetail/fetch'],
  yieldLoading: loading.effects['goldYieldOrderDetail/yieldOrder'],
}))
class GoldYieldOrderDetail extends Component {
  state = {};

  componentDidMount() {
    this.getInfo();
  }

  componentWillUnmount() {}

  getInfo = m => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldYieldOrderDetail/fetch',
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        m && message.success(m);
      }
    })
  }

  withdraw = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goldYieldOrderDetail/withdrawOrder',
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      this.getInfo();
    });
  };

  yield = () => {
    const { dispatch, goldYieldOrderDetail } = this.props;
    const { MM } = this.state;
    
    if (!MM) {
      message.error('请输入交易密码');
      return;
    }

    dispatch({
      type: 'goldYieldOrderDetail/yieldOrder',
      payload: {
        payment_pwd: MM,
        token_id: goldYieldOrderDetail.token_id,
      },
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      this.getInfo();
      this.setState({
        MM: null,
      });
    });
  };

  handleMM = e => {
    this.setState({
      MM: e.target.value,
    });
  };

  noTransfer = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goldYieldOrderDetail/noTransfer',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.getInfo();
    })
  }

  render() {
    const { goldYieldOrderDetail, loading, yieldLoading } = this.props;
    const { MM } = this.state;

    const yieldAmount = new BigNumber(goldYieldOrderDetail.m_pay_amount)
          .plus(new BigNumber(goldYieldOrderDetail.gas))
          .toNumber();
    const cnyGas = new BigNumber(goldYieldOrderDetail.gas)
          .multipliedBy(new BigNumber(goldYieldOrderDetail.cny_price))
          .toNumber();

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="平台订单号">
              {goldYieldOrderDetail.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {buyStatusType[goldYieldOrderDetail.state]}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${goldYieldOrderDetail.pay_amount_cny} ${cashType[goldYieldOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="出金数量(出金代币数量 + 手续费)">{ `${goldYieldOrderDetail.m_pay_amount} + ${goldYieldOrderDetail.gas} = ${yieldAmount} ${coinType[goldYieldOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="出金手续费">{ `${goldYieldOrderDetail.gas} ${coinType[goldYieldOrderDetail.token_id]}(${cnyGas}CNY)` }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">
              {goldYieldOrderDetail.out_order_id}
            </Descriptions.Item>
            <Descriptions.Item label="火币购买汇率(USDT:CNY)">
              { `1:${goldYieldOrderDetail.cny_price}` }
            </Descriptions.Item>
            <Descriptions.Item label="出金账户">{ goldYieldOrderDetail.payee_account }</Descriptions.Item>
            <Descriptions.Item label="出金方式"><img src={payIcon[goldYieldOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">
              {goldYieldOrderDetail.a_user_name}
            </Descriptions.Item>
            {
              goldYieldOrderDetail.state == 5 &&
              <Descriptions.Item label="支付截图">
                <a target="_blank" href={goldYieldOrderDetail.payment_screenshot}><img src={goldYieldOrderDetail.payment_screenshot} width="150" height="150" /></a>
              </Descriptions.Item>
            }
            <Descriptions.Item label="创建时间">
              {moment(goldYieldOrderDetail.created_at)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="操作">
              {
                goldYieldOrderDetail.state < 5 &&
                  <Fragment>
                    <Button type="primary" onClick={this.withdraw}>撤回</Button>
                    <span style={{ display: 'inline-block', width: 15 }}></span>
                  </Fragment>
              }

              {
                goldYieldOrderDetail.state == 5 &&
                  <Fragment>
                    <Input
                      type="password"
                      placeholder="输入交易密码"
                      maxLength={24}
                      onChange={this.handleMM}
                      value={MM}
                      style={{ width: 200 }}
                    />
                    <span style={{ display: 'inline-block', width: 15 }}></span>
                    <Button loading={yieldLoading} type="primary" onClick={this.yield}>
                      出金
                    </Button>
                    <span style={{ display: 'inline-block', width: 15 }}></span>
                    <Popconfirm title="是否要确认未收到转账？" onConfirm={this.noTransfer}>
                      <Button>未收到转账</Button>
                    </Popconfirm>
                    <span style={{ display: 'inline-block', width: 15 }}></span>
                  </Fragment>
              }
              <Button onClick={() => this.getInfo('刷新成功')}>
                刷新订单
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default GoldYieldOrderDetail;
