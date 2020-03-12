import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ buyDissentOrderDetail, loading }) => ({
  buyDissentOrderDetail,
  loading: loading.effects['buyDissentOrderDetail/fetch'],
}))
class BuyDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
    contact: '',
    content: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyDissentOrderDetail/fetch',
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
      type: 'buyDissentOrderDetail/KF',
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
      type: 'buyDissentOrderDetail/close',
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
    const { buyDissentOrderDetail, loading } = this.props;
    const { KFVisible, submitLock, closeLock } = this.state;
    const KFStatus = true/*new Date().getTime() - moment(buyDissentOrderDetail.issue_create_time).local().format('x') > 3 * 60 * 60 * 1000 ? true : false*/;
    const fileList = buyDissentOrderDetail.issue_file ? buyDissentOrderDetail.issue_file.split(',') : [];
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(buyDissentOrderDetail.issue_create_time).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="问题类型">{ buyDissentOrderDetail.issue_type }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ buyDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            <Descriptions.Item label="处理状态">{ issueTypeStatus[buyDissentOrderDetail.issue_state] }</Descriptions.Item>
            {
              buyDissentOrderDetail.issue_state == 2 &&
              <Descriptions.Item label="处理结果">{ buyDissentOrderDetail.issue_result }</Descriptions.Item>
            }
            <Descriptions.Item label="平台订单号">{ buyDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ buyDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ buyStatusType[buyDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="订单金额/代币数量">{ `${buyDissentOrderDetail.pay_amount_cny} ${cashType[buyDissentOrderDetail.currency_type]}/${buyDissentOrderDetail.pay_amount} ${coinType[buyDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ buyDissentOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="客户姓名">{buyDissentOrderDetail.payee_name}</Descriptions.Item>

            {
              buyDissentOrderDetail.pay_type == 1 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{buyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{buyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              buyDissentOrderDetail.pay_type == 2 && 
              <Fragment>
                <Descriptions.Item label="客户支付宝账号">{buyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户支付宝收款码"><img src={buyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              buyDissentOrderDetail.pay_type == 3 && 
              <Fragment>
                <Descriptions.Item label="客户微信账号">{buyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户微信收款码"><img src={buyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              buyDissentOrderDetail.pay_type == 4 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{buyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{buyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              buyDissentOrderDetail.pay_type == 5 && 
              <Fragment>
                <Descriptions.Item label="客户Paypal账号">{buyDissentOrderDetail.payee_account}</Descriptions.Item>
              </Fragment>
            }

            <Descriptions.Item label="创建时间">{ moment(buyDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(buyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ buyDissentOrderDetail.transfer_time ? moment(buyDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="转款时间">{ buyDissentOrderDetail.confirm_time ? moment(buyDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="操作">
              {
                
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
                  <Button type="primary" loading={submitLock} onClick={this.handleOk} >确定提交</Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Layer>
        }
      </ContLayout>
    );
  }
}

export default BuyDissentOrderDetail;
