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
    const { dispatch, goldYieldOrderDetail } = this.props;

    dispatch({
      type: 'goldYieldOrderDetail/withdrawOrder',
      payload: {
        order_id: goldYieldOrderDetail.order_id,
      },
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
        order_id: goldYieldOrderDetail.order_id,
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

  render() {
    const { goldYieldOrderDetail, loading } = this.props;
    const { MM } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">
              {buyStatusType[goldYieldOrderDetail.state]}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${goldYieldOrderDetail.pay_amount_cny} ${cashType[goldYieldOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${goldYieldOrderDetail.pay_amount} ${coinType[goldYieldOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">
              {goldYieldOrderDetail.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="商户订单号">
              {goldYieldOrderDetail.out_order_id}
            </Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">
              {goldYieldOrderDetail.a_user_name}
            </Descriptions.Item>
            <Descriptions.Item label="单价(CNY)">
              {goldYieldOrderDetail.cny_price}
            </Descriptions.Item>
            <Descriptions.Item label="手续费">{ `${goldYieldOrderDetail.gas} ${cashType[goldYieldOrderDetail.token_id]}` }</Descriptions.Item>
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
                    <Button type="primary" onClick={this.yield}>
                      出金
                    </Button>
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
