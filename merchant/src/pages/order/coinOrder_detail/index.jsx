import { Button, Descriptions, Popconfirm, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;
const orderType = {
  0: '全部',
  1: '充币账单',
  2: '提币账单',
};
const statusType = {
  0: '全部',
  1: '提起交易',
  2: '交易已广播',
  3: '交易上链已确认',
  4: '交易广播失败',
  5: '交易上链失败',
  6: '已上链等待达到确认数',
  20: '拒绝提币申请',
};

@connect(({ coinOrderDetail, loading }) => ({
  coinOrderDetail,
  loading: loading.effects['coinOrderDetail/fetch'],
}))
class CoinOrderDetail extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coinOrderDetail/fetch',
    });
  }

  componentWillUnmount() {}

  render() {
    const { coinOrderDetail, loading } = this.props;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单状态">
              {statusType[coinOrderDetail.state >= 20 ? coinOrderDetail.state : Number(coinOrderDetail.state) + 1]}
            </Descriptions.Item>
            <Descriptions.Item label="订单分类">
              {orderType[coinOrderDetail.type]}
            </Descriptions.Item>
            <Descriptions.Item label="代币数量">
              {`${wei2USDT(coinOrderDetail.count, coinOrderDetail.token_id == 1 ? 'erc20' : 'omni')} ${coinType2[coinOrderDetail.token_id]}`}
            </Descriptions.Item>
            <Descriptions.Item label="地址">{coinOrderDetail.to_address}</Descriptions.Item>
            <Descriptions.Item label="Txhash">{coinOrderDetail.txid}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(coinOrderDetail.create_time * 1000)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {
              coinOrderDetail.state == 20 &&
              <Descriptions.Item label="拒绝提币理由">
                {coinOrderDetail.refuse_reason}
              </Descriptions.Item>
            }
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default CoinOrderDetail;
