import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ goldYieldOrderDetail, loading }) => ({
  goldYieldOrderDetail,
  loading: loading.effects['goldYieldOrderDetail/fetch'],
}))
class GoldYieldOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldYieldOrderDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { goldYieldOrderDetail, loading } = this.props;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">{ buyStatusType[goldYieldOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ goldYieldOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ goldYieldOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">{ goldYieldOrderDetail.a_user_name }</Descriptions.Item>
            <Descriptions.Item label="币种">{ coinType[goldYieldOrderDetail.token_id] }</Descriptions.Item>
            <Descriptions.Item label="订单金额(USDT)">{ goldYieldOrderDetail.pay_amount }</Descriptions.Item>
            <Descriptions.Item label="订单金额(CNY)">{ goldYieldOrderDetail.pay_amount_cny }</Descriptions.Item>
            <Descriptions.Item label="单价(CNY)">{ goldYieldOrderDetail.cny_price }</Descriptions.Item>
            <Descriptions.Item label="手续费(USDT)">{ goldYieldOrderDetail.gas }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(goldYieldOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default GoldYieldOrderDetail;
