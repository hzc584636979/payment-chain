import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ acceptBuyDissentOrderDetail, loading }) => ({
  acceptBuyDissentOrderDetail,
  loading: loading.effects['acceptBuyDissentOrderDetail/fetch'],
}))
class AcceptBuyDissentOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'acceptBuyDissentOrderDetail/fetch',
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
      type: 'acceptBuyDissentOrderDetail/toAccept',
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
      type: 'acceptBuyDissentOrderDetail/toMerchant',
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
      type: 'acceptBuyDissentOrderDetail/close',
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
    const { acceptBuyDissentOrderDetail, loading } = this.props;
    const { toAcceptLock, toMerchantLock, closeLock, operLock } = this.state;
    const fileList = acceptBuyDissentOrderDetail.issue_file ? acceptBuyDissentOrderDetail.issue_file.split(',') : [];
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(acceptBuyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="问题类型">{ acceptBuyDissentOrderDetail.issue_type }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ acceptBuyDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ acceptBuyDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ acceptBuyDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ buyStatusType[acceptBuyDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${acceptBuyDissentOrderDetail.pay_amount_cny} ${cashType[acceptBuyDissentOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${acceptBuyDissentOrderDetail.pay_amount} ${coinType[acceptBuyDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="承兑商昵称">{ acceptBuyDissentOrderDetail.a_user_name }</Descriptions.Item>
            <Descriptions.Item label="承兑商手机号">{ acceptBuyDissentOrderDetail.a_telephone_number }</Descriptions.Item>
            {
              acceptBuyDissentOrderDetail.state == 5 &&
              <Descriptions.Item label="承兑商支付截图">
                <a target="_blank" href={acceptBuyDissentOrderDetail.payment_screenshot}><img src={acceptBuyDissentOrderDetail.payment_screenshot} width="150" height="150" /></a>
              </Descriptions.Item>
            }
            <Descriptions.Item label="商户昵称">{ acceptBuyDissentOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="商户手机号">{ acceptBuyDissentOrderDetail.m_telephone_number }</Descriptions.Item>
            <Descriptions.Item label="客户姓名">{acceptBuyDissentOrderDetail.payee_name}</Descriptions.Item>

            {
              acceptBuyDissentOrderDetail.pay_type == 1 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{acceptBuyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              acceptBuyDissentOrderDetail.pay_type == 2 && 
              <Fragment>
                <Descriptions.Item label="客户支付宝账号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户支付宝收款码"><img src={acceptBuyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              acceptBuyDissentOrderDetail.pay_type == 3 && 
              <Fragment>
                <Descriptions.Item label="客户微信账号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户微信收款码"><img src={acceptBuyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              acceptBuyDissentOrderDetail.pay_type == 4 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{acceptBuyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              acceptBuyDissentOrderDetail.pay_type == 5 && 
              <Fragment>
                <Descriptions.Item label="客户Paypal账号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
              </Fragment>
            }
            <Descriptions.Item label="创建时间">{ moment(acceptBuyDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(acceptBuyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ acceptBuyDissentOrderDetail.transfer_time ? moment(acceptBuyDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="转款时间">{ acceptBuyDissentOrderDetail.confirm_time ? moment(acceptBuyDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
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

export default AcceptBuyDissentOrderDetail;
