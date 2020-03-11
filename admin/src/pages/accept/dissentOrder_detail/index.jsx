import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ accpetDissentOrderDetail, loading }) => ({
  accpetDissentOrderDetail,
  loading: loading.effects['accpetDissentOrderDetail/fetch'],
}))
class AccpetDissentOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accpetDissentOrderDetail/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  render() {
    const { accpetDissentOrderDetail, loading } = this.props;
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(accpetDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="异议类型">{  }</Descriptions.Item>
            <Descriptions.Item label="异议状态">{  }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ accpetDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">{ accpetDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">{ accpetDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="承兑商手机号">{ accpetDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ accpetDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ accpetDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ accpetDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="订单类型">{  }</Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${accpetDissentOrderDetail.pay_amount_cny} ${cashType[accpetDissentOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${accpetDissentOrderDetail.pay_amount} ${coinType[accpetDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ buyStatusType[accpetDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(accpetDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default AccpetDissentOrderDetail;
