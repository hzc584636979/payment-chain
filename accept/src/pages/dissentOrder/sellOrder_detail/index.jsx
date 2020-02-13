import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ sellDissentOrderDetail, loading }) => ({
  sellDissentOrderDetail,
  loading: loading.effects['sellDissentOrderDetail/fetch'],
}))
class SellDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
    contact: '',
    content: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellDissentOrderDetail/fetch',
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
      message.error('请填写申诉描述后提交');
      return;
    }

    this.setState({
      submitLock: true,
    })

    dispatch({
      type: 'sellDissentOrderDetail/KF',
      payload: {
        contact,
        content,
      },
    }).then(data => {
      this.setState({
        submitLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        KFVisible: false,
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
      type: 'sellDissentOrderDetail/close',
    }).then(data => {
      this.setState({
        closeLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        KFVisible: false,
      })
    })
  }

  render() {
    const { sellDissentOrderDetail, loading } = this.props;
    const { KFVisible, submitLock, closeLock } = this.state;
    const KFStatus = true/*new Date().getTime() - moment(sellDissentOrderDetail.issue_create_time).local().format('x') > 3 * 60 * 60 * 1000 ? true : false*/;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(sellDissentOrderDetail.issue_create_time).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="问题类型">{ sellDissentOrderDetail.issue_type }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ sellDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ sellDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ sellDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="付款用户">{ sellDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="付款方式"><img src={payIcon[sellDissentOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${sellDissentOrderDetail.pay_amount_cny} ${cashType[sellDissentOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${sellDissentOrderDetail.pay_amount} ${coinType[sellDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="收币商户">{ sellDissentOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ sellStatusType[sellDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(sellDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(sellDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="付款时间">{ sellDissentOrderDetail.transfer_time ? moment(sellDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ sellDissentOrderDetail.confirm_time ? moment(sellDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="操作">
              {
                KFStatus &&
                <Button type="primary" onClick={this.handleKF}>客服介入</Button>
              }
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
                  <Input placeholder="输入联系方式" style={{width: '100%'}} maxLength={11} onChange={this.handleContact} />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>申诉描述</span>} className={styles.textTop}>
                  <TextArea placeholder="请输入申诉描述" onChange={this.handleContent} style={{width: '100%', height: 162}} />
                </Descriptions.Item>
                <Descriptions.Item className={styles.noneBeforeIcon}>
                  <Button type="primary" loading={submitLock} onClick={this.handleOk}>确定提交</Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Layer>
        }
      </ContLayout>
    );
  }
}

export default SellDissentOrderDetail;
