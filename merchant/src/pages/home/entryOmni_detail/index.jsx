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
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import QRCode  from 'qrcode.react';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ entryOmni_detail, loading }) => ({
  entryOmni_detail,
  loading: loading.effects['entryOmni_detail/fetch'],
}))
@Form.create()
class EntryOmni_detail extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    /*dispatch({
      type: 'entryOmni_detail/fetch',
      payload:{
        pageSize:10,
        page:0,
        state: 0,
        time: [moment().startOf('day'), moment().endOf('day')],
      },
    }).then(data => {
      let count = 0;
      this.interval = window.setInterval(() => {
        count += 1;
        this.setState({
          count,
        });
      }, 1000);
    })*/
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  transfer = id => {
    dispatch({
      type: 'entryOmni_detail/transfer',
      payload: {
        order_id: id,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        yieldId: null,
        CNY: null,
        DB: null,
        MM: null,
      })
    })
  }

  cancel = id => {
    dispatch({
      type: 'entryOmni_detail/cancel',
      payload: {
        order_id: id,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        yieldId: null,
        CNY: null,
        DB: null,
        MM: null,
      })
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

  render() {
    const { entryOmni_detail, loading } = this.props;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Row type="flex" justify="space-between" align="middle" style={{
            background: 'rgba(33, 148, 255, 0.05)',
            height: 60,
            padding: '0 20px',
            fontSize: 16
          }}>
            <Col>承兑商 金三胖</Col>
            <Col style={{color: '#999'}}>订单编号:4856132845632131</Col>
          </Row>
          <Row type="flex" justify="space-around" align="middle" style={{
            fontSize: 16,
            color: '#999'
          }}>
            <Col className={styles.itemClass1} span={6}>
              总价<p>5,4560.00 CNY</p>
            </Col>
            <Col className={styles.itemClass1} span={6}>
              数量<p>1320 USDT</p>
            </Col>
            <Col className={styles.itemClass1} span={6}>
              单价<p>7.00 CNY</p>
            </Col>
            <Col className={styles.itemClass1} span={6}>
              手续费<p>1 USDT</p>
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
          <Row className={styles.itemClass2}>
            <Col span={4}><span className={`${styles.payName} ${styles.c1}`}>银行卡</span></Col>
            <Col span={5}>张三</Col>
            <Col span={5}>2663 2316 5312 2131 5213</Col>
            <Col span={5}>中国银行</Col>
            <Col span={5}>崇明岛支行</Col>
          </Row>
          <Row className={styles.itemClass2}>
            <Col span={4}><span className={`${styles.payName} ${styles.c2}`}>支付宝</span></Col>
            <Col span={5}>张三</Col>
            <Col span={5}>2663 2316 5312 2131 5213</Col>
          </Row>
          <Row className={styles.itemClass2}>
            <Col span={4}><span className={`${styles.payName} ${styles.c3}`}>微信</span></Col>
            <Col span={5}>张三</Col>
            <Col span={5}>2663 2316 5312 2131 5213</Col>
            <Col span={5}>
              <Popover content={<QRCode value={'12312323123'} size={120} />}>
                <span style={{color: '#2194FF', cursor: 'pointer'}}><Icon type="qrcode" />二维码</span>
              </Popover>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="middle" style={{
            background: 'rgba(33, 148, 255, 0.05)',
            height: 60,
            padding: '0 20px',
            fontSize: 16
          }}>
            <Col style={{color: '#333', fontWeight: 600, fontSize: 16}}>待转账，请向对方转账 {this.getLessTime(entryOmni_detail.creatTime, entryOmni_detail.aging)}</Col>
            <Col><Button type="primary">我已完成转账， 下一步</Button></Col>
          </Row>
          <Row type="flex" justify="space-between" align="middle" style={{
            background: 'rgba(33, 148, 255, 0.05)',
            height: 60,
            padding: '0 20px',
            fontSize: 16,
          }}>
            <Col style={{color: '#2194FF', fontWeight: 600, fontSize: 28}}>5,4560.00 CNY</Col>
            <Col style={{color: '#2194FF', fontSize: 16, cursor: 'pointer'}}>取消订单</Col>
          </Row>
        </div>
      </ContLayout>
    );
  }
}

export default EntryOmni_detail;
