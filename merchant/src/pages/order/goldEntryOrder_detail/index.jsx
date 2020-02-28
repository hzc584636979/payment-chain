import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ goldEntryOrderDetail, loading }) => ({
  goldEntryOrderDetail,
  loading: loading.effects['goldEntryOrderDetail/fetch'],
}))
class GoldEntryOrderDetail extends Component {
  state = {};

  componentDidMount() {
    this.getInfo();
  }

  componentWillUnmount() {}

  getInfo = m => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldEntryOrderDetail/fetch',
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        m && message.success(m);
      }
    })
  }

  render() {
    const { goldEntryOrderDetail, loading } = this.props;

    const entryAmount = new BigNumber(goldEntryOrderDetail.m_pay_amount)
          .plus(new BigNumber(goldEntryOrderDetail.gas))
          .toNumber();
    const cnyGas = new BigNumber(goldEntryOrderDetail.gas)
          .multipliedBy(new BigNumber(goldEntryOrderDetail.cny_price))
          .toNumber();

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="平台订单号">
              {goldEntryOrderDetail.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {sellStatusType[goldEntryOrderDetail.state]}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${goldEntryOrderDetail.pay_amount_cny} ${cashType[goldEntryOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="入金数量(入金代币数量 - 手续费)">{ `${entryAmount} - ${goldEntryOrderDetail.gas} = ${goldEntryOrderDetail.m_pay_amount} ${coinType[goldEntryOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="入金手续费">{ `${goldEntryOrderDetail.gas} ${coinType[goldEntryOrderDetail.token_id]}(${cnyGas}CNY)` }</Descriptions.Item>
            <Descriptions.Item label="火币出售汇率(USDT:CNY)">
              { `1:${goldEntryOrderDetail.cny_price}` }
            </Descriptions.Item>
            <Descriptions.Item label="入金账户">{ goldEntryOrderDetail.user_pay_account }</Descriptions.Item>
            <Descriptions.Item label="入金方式"><img src={payIcon[goldEntryOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">
              {goldEntryOrderDetail.a_user_name}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(goldEntryOrderDetail.created_at)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="操作">
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

export default GoldEntryOrderDetail;
