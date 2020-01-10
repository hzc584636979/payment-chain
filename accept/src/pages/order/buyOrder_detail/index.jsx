import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ buyOrderDetail, loading }) => ({
  buyOrderDetail,
  loading: loading.effects['buyOrderDetail/fetch'],
}))
class SellOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  transfer = id => {
    dispatch({
      type: 'buyOrderDetail/transfer',
    });
  }

  receipt = id => {
    dispatch({
      type: 'buyOrderDetail/receipt',
    });
  }

  render() {
    const { buyOrderDetail, loading } = this.props;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">{ buyStatusType[buyOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ buyOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ buyOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ buyOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="商户账号">{ buyOrderDetail.payee_account }</Descriptions.Item>
            <Descriptions.Item label="币种">{ coinType[buyOrderDetail.token_id] }</Descriptions.Item>
            <Descriptions.Item label="商户出售金额 (USDT)">{ buyOrderDetail.pay_amount }</Descriptions.Item>
            <Descriptions.Item label="等值 (CNY)">{ buyOrderDetail.pay_amount_cny }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(buyOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ buyOrderDetail.transfer_time ? moment(buyOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="确认时间">{ buyOrderDetail.confirm_time ? moment(buyOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="操作">
              {
                buyOrderDetail.state == 5 ?
                <Popconfirm title="是否要确认转款？" onConfirm={this.transfer}>
                  <Button type="primary">确认转款</Button>
                </Popconfirm>
                :
                buyOrderDetail.state == 4 ?
                <Popconfirm title="是否要确认接单？" onConfirm={this.receipt}>
                  <Button type="primary">确认接单</Button>
                </Popconfirm>
                :
                null
              }
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default SellOrderDetail;
