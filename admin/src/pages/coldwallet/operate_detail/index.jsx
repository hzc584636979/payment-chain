import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ merchantDissentOrderDetail, loading }) => ({
  merchantDissentOrderDetail,
  loading: loading.effects['merchantDissentOrderDetail/fetch'],
}))
class MerchantDissentOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantDissentOrderDetail/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  render() {
    const { merchantDissentOrderDetail, loading } = this.props;
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(merchantDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="异议类型">{  }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ merchantDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">{ merchantDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">{ merchantDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="承兑商手机号">{ merchantDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ merchantDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ merchantDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ merchantDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="币种">{ coinType[merchantDissentOrderDetail.token_id] }</Descriptions.Item>
            <Descriptions.Item label="金额">{ merchantDissentOrderDetail.pay_amount }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ buyStatusType[merchantDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(merchantDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default MerchantDissentOrderDetail;
