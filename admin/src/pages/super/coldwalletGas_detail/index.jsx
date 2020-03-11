import { Button, Descriptions, Popconfirm, Input, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

@connect(({ coldwalletGasDetail, loading }) => ({
  coldwalletGasDetail,
  loading: loading.effects['coldwalletGasDetail/fetch'],
}))
class ColdwalletGasDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coldwalletGasDetail/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  frozen = id => {
    const { dispatch } = this.props;

    this.setState({
      lock: true,
    })

    dispatch({
      type: 'coldwalletGasDetail/frozen',
    }).then(data => {
      this.setState({
        lock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
    })
  }

  render() {
    const { coldwalletGasDetail, loading } = this.props;
    const { lock } = this.state;
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="商户姓名">{coldwalletGasDetail.payee_name}</Descriptions.Item>
            <Descriptions.Item label="商户手机号">{coldwalletGasDetail.payee_name}</Descriptions.Item>
            <Descriptions.Item label="商户地址">{coldwalletGasDetail.payee_name}</Descriptions.Item>
            <Descriptions.Item label="订单金额">{ `${coldwalletGasDetail.pay_amount_cny} ${cashType[coldwalletGasDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="手续费">{ `${coldwalletGasDetail.pay_amount_cny} ${coinType[coldwalletGasDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="冻结资金">{ `${coldwalletGasDetail.pay_amount_cny} ${coinType[coldwalletGasDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="操作">
              <Popconfirm title="是否要确认冻结商户资金？" onConfirm={this.frozen}>
                <Button loading={lock} type="primary">冻结商户资金</Button>
              </Popconfirm>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default ColdwalletGasDetail;
