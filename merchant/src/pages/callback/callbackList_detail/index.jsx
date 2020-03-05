import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;
const statusType = {
  0: '全部', 
  1: '成功',
  2: '失败',
}
const orderStatustype = {
  0: '全部', 
  1: '出金订单',
  2: '入金订单',
}

@connect(({ callbackDetail, loading }) => ({
  callbackDetail,
  loading: loading.effects['callbackDetail/fetch'],
}))
class CallbackDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'callbackDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { callbackDetail, loading } = this.props;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="平台编号">{ callbackDetail.id }</Descriptions.Item>
            <Descriptions.Item label="订单类型">{ orderStatustype[callbackDetail.order_type] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ callbackDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ callbackDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="回调状态">{ statusType[callbackDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="回调地址">{ callbackDetail.url }</Descriptions.Item>
            <Descriptions.Item label="响应内容">{ callbackDetail.res }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(callbackDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default CallbackDetail;
