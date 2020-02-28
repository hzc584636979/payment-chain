import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Menu,
  Row,
  Col,
  Divider,
  Popconfirm,
  message,
  Icon,
  Popover,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect, routerRedux } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ entryUSDT_detail, loading }) => ({
  entryUSDT_detail,
  loading: loading.effects['entryUSDT_detail/fetch'],
}))
@Form.create()
class EntryUSDT_detail extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'entryUSDT_detail/fetch',
    }).then(data => {
      /*let count = 0;
      this.interval = window.setInterval(() => {
        count += 1;
        this.setState({
          count,
        });
      }, 1000);*/
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  transfer = () => {
    const { dispatch, entryUSDT_detail } = this.props;
    dispatch({
      type: 'entryUSDT_detail/transfer',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        // message.success('操作成功');
        dispatch(routerRedux.push(`/order/goldEntryOrder_detail/${entryUSDT_detail.order_id}`));
      }
    })
  }

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'entryUSDT_detail/cancel',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
        dispatch(routerRedux.push(`/entry/entryErc20`));
      }
    })
  }

  getLessTime = (creatTime, aging) => {
    const time1 = new Date().getTime() - moment(creatTime).local().format('x');
    const time2 = Number(aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);
    const hoursTime = 60 * 60 * 1000;
    return (<div className={styles.time}>
          { lessTime >= hoursTime &&  `<span>${lessTime.hours()}</span> : `}<span>{lessTime.minutes()}</span> : <span>{lessTime.seconds()}</span>
        </div>)
  }

  handleClipBoard = val => {
    if(copy(val)){
      message.success('复制成功') 
    }else{
      message.error('复制失败，请重试') 
    }
  }

  render() {
    const { entryUSDT_detail, loading } = this.props;
    const gas = new BigNumber(entryUSDT_detail.gas)
          .multipliedBy(new BigNumber(entryUSDT_detail.pay_amount))
          .toNumber();

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Row type="flex" justify="space-between" align="middle" style={{
            background: 'rgba(33, 148, 255, 0.05)',
            height: 60,
            padding: '0 20px',
            fontSize: 16
          }}>
            <Col>承兑商 {entryUSDT_detail.a_user_name}</Col>
            <Col style={{color: '#999'}}>订单编号:{entryUSDT_detail.order_id}</Col>
          </Row>
          <Row type="flex" justify="space-around" align="middle" style={{
            fontSize: 16,
            color: '#999'
          }}>
            <Col className={styles.itemClass1} span={6}>
              总价<p>{ `${entryUSDT_detail.pay_amount_cny} ${cashType[entryUSDT_detail.currency_type]}` }</p>
            </Col>
            <Col className={styles.itemClass1} span={6}>
              数量<p>{`${entryUSDT_detail.pay_amount} ${coinType[entryUSDT_detail.token_id]}`}</p>
            </Col>
            <Col className={styles.itemClass1} span={6}>
              单价<p>{entryUSDT_detail.deal_rate} CNY</p>
            </Col>
            <Col className={styles.itemClass1} span={6}>
              手续费<p>{ `${entryUSDT_detail.gas} ${coinType[entryUSDT_detail.token_id]}` }</p>
            </Col>
          </Row>
          <Divider orientation="left" style={{color: '#999999', fontSize: 20}}>承兑商收款方式</Divider>
          <Row
            className={`${styles.message1}`}
            type="flex"
            justify="space-between"
            align="middle"
          >
            <Col>
              请务必使用本人已绑定的支付方式向以下账户自行转账
            </Col>
          </Row>
          <Row className={styles.itemClass2} type="flex" align='middle'>
            <Col span={4}><img src={payIcon[entryUSDT_detail.pay_type]} /></Col>
            <Col span={5}>{entryUSDT_detail.pay_real_name}</Col>
            {
              (entryUSDT_detail.pay_type == 1 || entryUSDT_detail.pay_type == 4) ?
              <a onClick={() => this.handleClipBoard(entryUSDT_detail.pay_account)}>{entryUSDT_detail.pay_account}</a>
              :
              entryUSDT_detail.pay_account
            }
            <Col span={5}>
              {
                (entryUSDT_detail.pay_type == 1 || entryUSDT_detail.pay_type == 4) &&
                entryUSDT_detail.account_bank_name
              }
              {
                (entryUSDT_detail.pay_type == 2 || entryUSDT_detail.pay_type == 3) &&
                /*<Popover content={<img src={entryUSDT_detail.pay_code_url} width="150" />}>
                  <span style={{color: '#2194FF', cursor: 'pointer'}}><Icon type="qrcode" />二维码</span>
                </Popover>*/
                <img src={entryUSDT_detail.pay_code_url} width="150" />
              }
            </Col>
          </Row>
          {/*<Row className={styles.itemClass2}>
            <Col span={4}><span className={`${styles.payName} ${styles.c2}`}>微信</span></Col>
            <Col span={5}>张三</Col>
            <Col span={5}>2663 2316 5312 2131 5213</Col>
            <Col span={5}>
              <Popover content={<QRCode value={'12312323123'} size={120} />}>
                <span style={{color: '#2194FF', cursor: 'pointer'}}><Icon type="qrcode" />二维码</span>
              </Popover>
            </Col>
          </Row>*/}
          <Row type="flex" justify="space-between" align="middle" style={{
            background: 'rgba(33, 148, 255, 0.05)',
            height: 60,
            padding: '0 20px',
            fontSize: 16
          }}>
            <Col style={{color: '#333', fontWeight: 600, fontSize: 16}}>待转账，请向对方转账 {/*this.getLessTime(entryUSDT_detail.creatTime, entryUSDT_detail.aging)*/}</Col>
            <Col><Button type="primary" onClick={this.transfer}>我已完成转账， 下一步</Button></Col>
          </Row>
          <Row type="flex" justify="space-between" align="middle" style={{
            background: 'rgba(33, 148, 255, 0.05)',
            height: 60,
            padding: '0 20px',
            fontSize: 16,
          }}>
            <Col style={{color: '#2194FF', fontWeight: 600, fontSize: 28}}>{`${entryUSDT_detail.pay_amount_cny} ${cashType[entryUSDT_detail.currency_type]}`}</Col>
            <Col style={{color: '#2194FF', fontSize: 16, cursor: 'pointer'}} onClick={this.cancel}>取消订单</Col>
          </Row>
        </div>
      </ContLayout>
    );
  }
}

export default EntryUSDT_detail;
