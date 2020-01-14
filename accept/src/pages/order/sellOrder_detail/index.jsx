import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ sellOrderDetail, loading }) => ({
  sellOrderDetail,
  loading: loading.effects['sellOrderDetail/fetch'],
}))
class SellOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  receipt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/receipt',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    })
  }

  noReceipt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/noReceipt',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    })
  }

  render() {
    const { sellOrderDetail, loading } = this.props;
    const time = (new Date().getTime() - moment(sellOrderDetail.updated_at).local().format('x')) > 5 * 60 * 1000 ? true : false;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">{ sellStatusType[sellOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ sellOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ sellOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="付款用户">{ sellOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="付款方式"><img src={payIcon[sellOrderDetail.pay_type]} /></Descriptions.Item>
            <Descriptions.Item label="付款金额(USDT)">{ sellOrderDetail.pay_amount }</Descriptions.Item>
            <Descriptions.Item label="付款金额(CNY)">{ sellOrderDetail.pay_amount_cny }</Descriptions.Item>
            <Descriptions.Item label="收币商户">{ sellOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(sellOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="付款时间">{ sellOrderDetail.transfer_time ? moment(sellOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ sellOrderDetail.confirm_time ? moment(sellOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="操作">
              {
                sellOrderDetail.state == 2 &&
                <Fragment>
                  <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                    <Button>确认收款</Button>
                  </Popconfirm>
                  {
                    time &&
                    <Fragment>
                      <span style={{display: 'inline-block', width: '10px'}}></span>
                      <Popconfirm title="是否要确认未收款？" onConfirm={this.noReceipt}>
                        <Button>未收到收款</Button>
                      </Popconfirm>
                    </Fragment>
                  }
                </Fragment>
              }
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default SellOrderDetail;
