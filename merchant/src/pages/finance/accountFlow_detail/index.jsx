import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ coinDissentOrderDetail, loading }) => ({
  coinDissentOrderDetail,
  loading: loading.effects['coinDissentOrderDetail/fetch'],
}))
class CoinDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
    contact: '',
    content: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coinDissentOrderDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  handleContact = e => {
    this.setState({
      contact: e.target.value
    })
  }

  handleContent = e => {
    this.setState({
      content: e.target.value
    })
  }

  handleKF = () => {
    this.setState({
      KFVisible: !this.state.KFVisible,
    })
  }

  handleOk = () => {
    const { dispatch } = this.props;
    const { contact, content } = this.state;
    
    if(contact == '' || !regPhone(contact)) {
      message.error('请填写正确的联系方式后提交');
      return;
    }else if(content == '') {
      message.error('请填写联系方式后提交');
      return;
    }

    this.setState({
      submitLock: true,
    })

    dispatch({
      type: 'coinDissentOrderDetail/KF',
      payload: {
        contact,
        content,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        KFVisible: false,
        submitLock: false,
      })
    })
  }

  handleCancel = () => {
    this.setState({
      KFVisible: false,
    })
  }

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
    })

    dispatch({
      type: 'coinDissentOrderDetail/close',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        KFVisible: false,
        closeLock: false,
      })
    })
  }

  render() {
    const { coinDissentOrderDetail, loading } = this.props;
    const { KFVisible, submitLock, closeLock } = this.state;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">{ buyStatusType[coinDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ coinDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ coinDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="付款方式"><img src={payIcon[coinDissentOrderDetail.pay_type]} /></Descriptions.Item>
            <Descriptions.Item label="付款姓名">{ coinDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="银行卡号">{ buyOrderDetail.payee_account }</Descriptions.Item>
            <Descriptions.Item label="银行名称">{ coinDissentOrderDetail.account_bank_name }</Descriptions.Item>
            <Descriptions.Item label="商户购买">{  }</Descriptions.Item>
            <Descriptions.Item label="平台折扣后金额（CNY）">{  }</Descriptions.Item>
            <Descriptions.Item label="成交汇率">{ coinDissentOrderDetail.ex_rate }</Descriptions.Item>
            <Descriptions.Item label="调价收入">{  }</Descriptions.Item>
            <Descriptions.Item label="购买订单总金额（USDT）">{ coinDissentOrderDetail.pay_amount }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(coinDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="转账时间">{ coinDissentOrderDetail.transfer_time ? moment(coinDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ coinDissentOrderDetail.confirm_time ? moment(coinDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="操作">
              <Button type="primary" onClick={this.handleKF}>客服介入</Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button loading={closeLock} type="danger" onClick={this.closeObjection}>关闭异议</Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
        {
          KFVisible && 
          <Layer 
            title="客服介入"
            hiddenVisible={this.handleCancel}
          >
            <div className={styles.layerWrap} style={{width: '70%', margin: '0 auto'}}>
              <Descriptions column={1}>
                <Descriptions.Item label={<span className={styles.itemLabel}>联系方式</span>}>
                  <Input placeholder="输入联系方式" style={{width: '100%'}} onChange={this.handleContact} />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>申诉描述</span>} className={styles.textTop}>
                  <TextArea placeholder="请输入申诉描述" onChange={this.handleContent} style={{width: '100%', height: 162}} />
                </Descriptions.Item>
                <Descriptions.Item className={styles.noneBeforeIcon}>
                  <Button type="primary" loading={submitLock} onClick={this.submit} >确定提交</Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Layer>
        }
      </ContLayout>
    );
  }
}

export default CoinDissentOrderDetail;
