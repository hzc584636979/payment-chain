import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ merchantBuyDissentOrderDetail, loading }) => ({
  merchantBuyDissentOrderDetail,
  loading: loading.effects['merchantBuyDissentOrderDetail/fetch'],
}))
class MerchantBuyDissentOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantBuyDissentOrderDetail/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  toAccept = () => {
    const { dispatch } = this.props;

    this.setState({
      toAcceptLock: true,
      operLock: true,
    })

    dispatch({
      type: 'merchantBuyDissentOrderDetail/toAccept',
    }).then(data => {
      this.setState({
        toAcceptLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  toMerchant = () => {
    const { dispatch } = this.props;

    this.setState({
      toMerchantLock: true,
      operLock: true,
    })

    dispatch({
      type: 'merchantBuyDissentOrderDetail/toMerchant',
    }).then(data => {
      this.setState({
        toMerchantLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
      operLock: true,
    })

    dispatch({
      type: 'merchantBuyDissentOrderDetail/close',
    }).then(data => {
      this.setState({
        closeLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  render() {
    const { merchantBuyDissentOrderDetail, loading } = this.props;
    const { toAcceptLock, toMerchantLock, closeLock, operLock } = this.state;
    const fileList = merchantBuyDissentOrderDetail.issue_file ? merchantBuyDissentOrderDetail.issue_file.split(',') : [];
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(merchantBuyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="问题类型">{ merchantBuyDissentOrderDetail.issue_type }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ merchantBuyDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ merchantBuyDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ merchantBuyDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ buyStatusType[merchantBuyDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${merchantBuyDissentOrderDetail.pay_amount_cny} ${cashType[merchantBuyDissentOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${merchantBuyDissentOrderDetail.pay_amount} ${coinType[merchantBuyDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">{ merchantBuyDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="承兑商手机号">{ merchantBuyDissentOrderDetail.issue_desc }</Descriptions.Item>
            {
              merchantBuyDissentOrderDetail.state == 5 &&
              <Descriptions.Item label="承兑商支付截图">
                <a target="_blank" href={merchantBuyDissentOrderDetail.payment_screenshot}><img src={merchantBuyDissentOrderDetail.payment_screenshot} width="150" height="150" /></a>
              </Descriptions.Item>
            }
            <Descriptions.Item label="商户姓名">{ merchantBuyDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="商户手机号">{ merchantBuyDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="客户姓名">{merchantBuyDissentOrderDetail.payee_name}</Descriptions.Item>

            {
              merchantBuyDissentOrderDetail.pay_type == 1 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{merchantBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{merchantBuyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              merchantBuyDissentOrderDetail.pay_type == 2 && 
              <Fragment>
                <Descriptions.Item label="客户支付宝账号">{merchantBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户支付宝收款码"><img src={merchantBuyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              merchantBuyDissentOrderDetail.pay_type == 3 && 
              <Fragment>
                <Descriptions.Item label="客户微信账号">{merchantBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户微信收款码"><img src={merchantBuyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              merchantBuyDissentOrderDetail.pay_type == 4 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{merchantBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{merchantBuyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              merchantBuyDissentOrderDetail.pay_type == 5 && 
              <Fragment>
                <Descriptions.Item label="客户Paypal账号">{merchantBuyDissentOrderDetail.payee_account}</Descriptions.Item>
              </Fragment>
            }
            <Descriptions.Item label="创建时间">{ moment(merchantBuyDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(merchantBuyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ merchantBuyDissentOrderDetail.transfer_time ? moment(merchantBuyDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="转款时间">{ merchantBuyDissentOrderDetail.confirm_time ? moment(merchantBuyDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="操作">
              <Popconfirm title="是否要确认释放给承兑商？" onConfirm={this.toAccept}>
                <Button loading={toAcceptLock} disabled={operLock} type="primary">释放给承兑商</Button>
              </Popconfirm>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Popconfirm title="是否要确认释放给商户？" onConfirm={this.toMerchant}>
                <Button loading={toMerchantLock} disabled={operLock} type="primary">释放给商户</Button>
              </Popconfirm>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Popconfirm title="是否要确认取消订单？" onConfirm={this.closeObjection}>
                <Button loading={closeLock} disabled={operLock} type="danger">取消订单</Button>
              </Popconfirm>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default MerchantBuyDissentOrderDetail;
