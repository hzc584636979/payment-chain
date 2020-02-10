import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ goldYieldDissentOrderDetail, loading }) => ({
  goldYieldDissentOrderDetail,
  loading: loading.effects['goldYieldDissentOrderDetail/fetch'],
}))
class GoldYieldDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
    contact: '',
    content: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldYieldDissentOrderDetail/fetch',
    });
  }

  componentWillUnmount() {}

  handleContact = e => {
    this.setState({
      contact: e.target.value,
    });
  };

  handleContent = e => {
    this.setState({
      content: e.target.value,
    });
  };

  handleKF = () => {
    this.setState({
      KFVisible: !this.state.KFVisible,
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { contact, content } = this.state;

    if (contact == '' || !regPhone(contact)) {
      message.error('请填写正确的联系方式后提交');
      return;
    } else if (content == '') {
      message.error('请填写申诉描述后提交');
      return;
    }

    this.setState({
      submitLock: true,
    });

    dispatch({
      type: 'goldYieldDissentOrderDetail/KF',
      payload: {
        contact,
        content,
      },
    }).then(data => {
      this.setState({
        submitLock: false,
      });
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      this.setState({
        KFVisible: false,
      });
    });
  };

  handleCancel = () => {
    this.setState({
      KFVisible: false,
    });
  };

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
    });

    dispatch({
      type: 'goldYieldDissentOrderDetail/close',
    }).then(data => {
      this.setState({
        closeLock: false,
      });
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      this.setState({
        KFVisible: false,
      });
    });
  };

  render() {
    const { goldYieldDissentOrderDetail, loading } = this.props;
    const { KFVisible, submitLock, closeLock } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">
              {buyStatusType[goldYieldDissentOrderDetail.state]}
            </Descriptions.Item>
            <Descriptions.Item label="异议时间">
              {moment(goldYieldDissentOrderDetail.issue_create_time)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="问题类型">
              {goldYieldDissentOrderDetail.issue_type}
            </Descriptions.Item>
            <Descriptions.Item label="问题描述">
              {goldYieldDissentOrderDetail.issue_desc}
            </Descriptions.Item>
            <Descriptions.Item label="平台订单号">
              {goldYieldDissentOrderDetail.order_id}
            </Descriptions.Item>
            <Descriptions.Item label="商户订单号">
              {goldYieldDissentOrderDetail.out_order_id}
            </Descriptions.Item>
            <Descriptions.Item label="承兑商姓名">
              {goldYieldDissentOrderDetail.a_user_name}
            </Descriptions.Item>
            <Descriptions.Item label="币种">
              {coinType[goldYieldDissentOrderDetail.token_id]}
            </Descriptions.Item>
            <Descriptions.Item label="代币数量">
              {goldYieldDissentOrderDetail.pay_amount}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额（CNY）">
              {goldYieldDissentOrderDetail.pay_amount_cny}
            </Descriptions.Item>
            <Descriptions.Item label="订单创建时间">
              {moment(goldYieldDissentOrderDetail.created_at)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="操作">
              <Button type="primary" onClick={this.handleKF}>
                客服介入
              </Button>
              <span style={{ display: 'inline-block', width: '10px' }}></span>
              <Button loading={closeLock} type="danger" onClick={this.closeObjection}>
                关闭异议
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
        {KFVisible && (
          <Layer title="客服介入" hiddenVisible={this.handleCancel}>
            <div className={styles.layerWrap} style={{ width: '70%', margin: '0 auto' }}>
              <Descriptions column={1}>
                <Descriptions.Item label={<span className={styles.itemLabel}>联系方式</span>}>
                  <Input
                    placeholder="输入联系方式"
                    maxLength={11}
                    style={{ width: '100%' }}
                    onChange={this.handleContact}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className={styles.itemLabel}>申诉描述</span>}
                  className={styles.textTop}
                >
                  <TextArea
                    placeholder="请输入申诉描述"
                    onChange={this.handleContent}
                    style={{ width: '100%', height: 162 }}
                  />
                </Descriptions.Item>
                <Descriptions.Item className={styles.noneBeforeIcon}>
                  <Button type="primary" loading={submitLock} onClick={this.handleOk}>
                    确定提交
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Layer>
        )}
      </ContLayout>
    );
  }
}

export default GoldYieldDissentOrderDetail;
