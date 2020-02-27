import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component, Fragment } from 'react';
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

  getAging = sellOrderDetail => {
    const time1 = new Date().getTime() - moment(sellOrderDetail.updated_at).local().format('x');
    const time2 = Number(sellOrderDetail.aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);

    if(lessTime <= 0) {
      /*const { dispatch } = this.props;
      dispatch({
        type: 'sellOrderDetail/fetch',
      }).then(data => {
        clearInterval(this.interval);
        if(data.data.state == 2) {
          let count = 0;
          this.interval = window.setInterval(() => {
            count += 1;
            this.setState({
              count,
            });
          }, 1000);
        }
      })*/
      return lessTime;
    }else {
      return lessTime;
    }
  }

  render() {
    const { sellOrderDetail, loading } = this.props;
    const time = (new Date().getTime() - moment(sellOrderDetail.updated_at).local().format('x')) > 5 * 60 * 1000 ? true : false;

    const lessTime = this.getAging(sellOrderDetail);
    const hoursTime = 60 * 60 * 1000;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">{ sellStatusType[sellOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${sellOrderDetail.pay_amount_cny} ${cashType[sellOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${sellOrderDetail.pay_amount} ${coinType[sellOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="交易汇率(USDT:CNY)">{ `1:${sellOrderDetail.deal_rate}` }</Descriptions.Item>
            <Descriptions.Item label="交易利润(CNY)">{ `${sellOrderDetail.profit}` }</Descriptions.Item>
            
            {
              sellOrderDetail.state == 2 &&
              <Descriptions.Item label="时效"><span style={{color: '#EA0000'}}>{lessTime >= hoursTime ? `${lessTime.hours()} : ${lessTime.minutes()} : ${lessTime.seconds()}` : `${lessTime.minutes()} : ${lessTime.seconds()}`}</span></Descriptions.Item>
            }
            <Descriptions.Item label="付款用户">{ sellOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="付款人身份证">{ sellOrderDetail.user_id_number }</Descriptions.Item>
            <Descriptions.Item label="付款款人手机号">{ sellOrderDetail.user_telephone_number  }</Descriptions.Item>
            <Descriptions.Item label="付款账户">{ sellOrderDetail.user_pay_account }</Descriptions.Item>
            {
              (sellOrderDetail.pay_type == 1 || sellOrderDetail.pay_type == 4) &&
              <Descriptions.Item label="开户行">{ sellOrderDetail.user_account_bank_name }</Descriptions.Item>
            }
            <Descriptions.Item label="付款方式"><img src={payIcon[sellOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ sellOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ sellOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="收币商户">{ sellOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(sellOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(sellOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="付款时间">{ sellOrderDetail.transfer_time ? moment(sellOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ sellOrderDetail.confirm_time ? moment(sellOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            {
              lessTime > 0 && sellOrderDetail.state == 2 &&
              <Descriptions.Item label="操作">
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
              </Descriptions.Item>
            }
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default SellOrderDetail;
