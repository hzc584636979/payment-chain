import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ buyDissentOrderDetail, loading }) => ({
  buyDissentOrderDetail,
  loading: loading.effects['buyDissentOrderDetail/fetch'],
}))
class SellDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    /*dispatch({
      type: 'buyDissentOrderDetail/fetch',
    });*/
  }

  componentWillUnmount() {

  }

  receipt = () => {
    dispatch({
      type: 'buyDissentOrderDetail/receipt',
      payload: {id},
    });
  }

  handleKF = () => {
    this.setState({
      KFVisible: !this.state.KFVisible,
    })
  }

  handleOk = () => {
    this.setState({
      KFVisible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      KFVisible: false,
    })
  }

  render() {
    const { loading } = this.props;
    const { KFVisible, submitLock } = this.state;
                                               
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">已过期</Descriptions.Item>
            <Descriptions.Item label="平台订单号">215898456123564632156325412</Descriptions.Item>
            <Descriptions.Item label="商户订单号">4652312511215</Descriptions.Item>
            <Descriptions.Item label="付款方式">支付宝转银行卡</Descriptions.Item>
            <Descriptions.Item label="收款姓名">金三胖</Descriptions.Item>
            <Descriptions.Item label="银行卡号">478485613213254651</Descriptions.Item>
            <Descriptions.Item label="银行名称">中国银行</Descriptions.Item>
            <Descriptions.Item label="商户购买">14.24</Descriptions.Item>
            <Descriptions.Item label="平台折扣后金额（CNY）">100.00</Descriptions.Item>
            <Descriptions.Item label="成交汇率">7.05</Descriptions.Item>
            <Descriptions.Item label="调价收入">0.00</Descriptions.Item>
            <Descriptions.Item label="购买订单总金额（USDT）">14.24</Descriptions.Item>
            <Descriptions.Item label="创建时间">2019-11-11 18:24:30</Descriptions.Item>
            <Descriptions.Item label="转账时间">--</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">--</Descriptions.Item>
            <Descriptions.Item label="操作">
              <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                <Button type="primary">确定收款</Button>
              </Popconfirm>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button type="primary" onClick={this.handleKF}>客服介入</Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button type="danger">
                <Link to="/dissentOrder/buyOrder?history">关闭</Link>
              </Button>
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
                  <Input placeholder="输入联系方式" style={{width: '100%'}} onChange={this.handleSelect} />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>申诉描述</span>} className={styles.textTop}>
                  <TextArea placeholder="请输入申诉描述" onChange={this.handleDesc} style={{width: '100%', height: 162}} />
                </Descriptions.Item>
                <Descriptions.Item className={styles.noneBeforeIcon}>
                  <Button type="primary" onClick={this.submit} disabled={submitLock}>确定提交</Button>
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
