import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component, Fragment } from 'react';
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
class buyOrderDetail extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/fetch',
    }).then(data => {
      let count = 0;
      this.interval = window.setInterval(() => {
        count += 1;
        this.setState({
          count,
        });
      }, 1000);
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  transfer = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/transfer',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'buyOrderDetail/fetch',
      });
    })
  }

  receipt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/receipt',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'buyOrderDetail/fetch',
      });
    })
  }

  getAging = buyOrderDetail => {
    const time1 = new Date().getTime() - moment(buyOrderDetail.updated_at).local().format('x');
    const time2 = Number(buyOrderDetail.aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);

    if(lessTime <= 0) {
      /*const { dispatch } = this.props;
      dispatch({
        type: 'buyOrderDetail/fetch',
      }).then(data => {
        clearInterval(this.interval);
        if(data.data.state == 4 || data.data.state == 3) {
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
    const { buyOrderDetail, loading } = this.props;
    const lessTime = this.getAging(buyOrderDetail);
    const hoursTime = 60 * 60 * 1000;
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="币种">{ coinType[buyOrderDetail.token_id] }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ buyOrderDetail.pay_amount }</Descriptions.Item>
            <Descriptions.Item label="等值 (CNY)">{ buyOrderDetail.pay_amount_cny }</Descriptions.Item>
            {
              (buyOrderDetail.state == 4 || buyOrderDetail.state == 3) &&
              <Descriptions.Item label="时效"><span style={{color: '#EA0000'}}>{lessTime >= hoursTime ? `${lessTime.hours()} : ${lessTime.minutes()} : ${lessTime.seconds()}` : `${lessTime.minutes()} : ${lessTime.seconds()}`}</span></Descriptions.Item>
            }
            <Descriptions.Item label="客户姓名">{buyOrderDetail.payee_name}</Descriptions.Item>

            {
              buyOrderDetail.pay_type == 1 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{buyOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{buyOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 2 && 
              <Fragment>
                <Descriptions.Item label="客户支付宝账号"><img src={buyOrderDetail.payee_account} style={{maxWidth: 150}} /></Descriptions.Item>
                <Descriptions.Item label="客户支付宝收款码"><img src={buyOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 3 && 
              <Fragment>
                <Descriptions.Item label="客户微信账号"><img src={buyOrderDetail.payee_account} style={{maxWidth: 150}} /></Descriptions.Item>
                <Descriptions.Item label="客户微信收款码"><img src={buyOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 4 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{buyOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{buyOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 5 && 
              <Fragment>
                <Descriptions.Item label="客户Paypal账号">{buyOrderDetail.payee_account}</Descriptions.Item>
              </Fragment>
            }
            
            <Descriptions.Item label="订单状态">{ buyStatusType[buyOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ buyOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ buyOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ buyOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(buyOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(buyOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ buyOrderDetail.transfer_time ? moment(buyOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="转款时间">{ buyOrderDetail.confirm_time ? moment(buyOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            {
              lessTime > 0 && (buyOrderDetail.state == 4 || buyOrderDetail.state == 3) && 
              <Descriptions.Item label="操作">
                {
                  buyOrderDetail.state == 4 ?
                  <Popconfirm title="是否要确认转款？" onConfirm={this.receipt}>
                    <Button type="primary">确认转款</Button>
                  </Popconfirm>
                  :
                  buyOrderDetail.state == 3 ?
                  <Popconfirm title="是否要确认接单？" onConfirm={this.transfer}>
                    <Button type="primary">确认接单</Button>
                  </Popconfirm>
                  :
                  null
                }
              </Descriptions.Item>
            }
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default buyOrderDetail;
