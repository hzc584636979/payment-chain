import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
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
    const { dispatch } = this.props;
    dispatch({
      type: 'goldEntryOrderDetail/fetch',
    });
  }

  componentWillUnmount() {}

  render() {
    const { goldEntryOrderDetail, loading } = this.props;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">
              {sellStatusType[goldEntryOrderDetail.state]}
            </Descriptions.Item>
            <Descriptions.Item label="币种">
              {coinType[goldEntryOrderDetail.token_id]}
            </Descriptions.Item>
            <Descriptions.Item label="代币数量">
              {goldEntryOrderDetail.pay_amount}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额(CNY)">
              {goldEntryOrderDetail.pay_amount_cny}
            </Descriptions.Item>
            <Descriptions.Item label="单价(CNY)">
              {goldEntryOrderDetail.cny_price}
            </Descriptions.Item>
            <Descriptions.Item label="平台订单号">
              {goldEntryOrderDetail.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="商户订单号">
              {goldEntryOrderDetail.out_order_id}
            </Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">
              {goldEntryOrderDetail.a_user_name}
            </Descriptions.Item>
            <Descriptions.Item label="手续费(USDT)">{goldEntryOrderDetail.gas}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(goldEntryOrderDetail.created_at)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default GoldEntryOrderDetail;
