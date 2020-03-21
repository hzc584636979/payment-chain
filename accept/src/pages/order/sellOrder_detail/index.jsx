import { Button, Descriptions, Popconfirm, Input, message, Form, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;
const FormItem = Form.Item;

const CreateModifyForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, params, modifyPriceLoading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  const validator = (rule, value, callback) => {
    if(value && !Number(value)) {
     callback('请输入数字的实际金额');
    }else if(value < 0) {
      callback('实际金额不能小于0');
    }
    callback();
  }

  return (
    <Modal
      title="调价确认"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      confirmLoading={modifyPriceLoading}
      centered
      okText='确认'
    >
      {
        params &&
        <Form>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="订单金额">
            {`${params.pay_amount_cny} ${cashType[params.currency_type]}`}
          </FormItem>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="实际金额">
            {form.getFieldDecorator('real_pay_amount', {
              rules: [
                { 
                  required: true, 
                  message: '请输入实际金额' 
                },
                {
                  validator: validator
                }
              ],
            })(<Input style={{width: 150}} placeholder="请输入实际金额" />)}
            {cashType[params.currency_type]}
          </FormItem>
        </Form>
      }
    </Modal>
  );
});

@connect(({ sellOrderDetail, loading }) => ({
  sellOrderDetail,
  loading: loading.effects['sellOrderDetail/fetch'],
  receiptLoading: loading.effects['sellOrderDetail/receipt'],
  noReceiptLoading: loading.effects['sellOrderDetail/noReceipt'],
  orderCancelLoading: loading.effects['sellOrderDetail/orderCancel'],
  modifyPriceLoading: loading.effects['sellOrderDetail/modifyPrice'],
  orderWithdrawLoading: loading.effects['sellOrderDetail/orderWithdraw'],
}))
class SellOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if(nextProps.location.query.key && this.initKey != nextProps.location.query.key) {
      clearInterval(this.interval);
      this.initKey = nextProps.location.query.key;
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    }
  }

  receipt = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/receipt',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    })
  }

  noReceipt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/noReceipt',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    })
  }

  getAging = sellOrderDetail => {
    const time1 = new Date().getTime() - moment(sellOrderDetail.updated_at).local().format('x');
    const time2 = Number(sellOrderDetail.aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);

    if(lessTime <= 0) {
      /*const { dispatch } = this.props;
      dispatch({
        type: 'sellOrderDetail/fetch',
      }).then(data => {
        clearInterval(this.interval);
        if(data.data.state == 2) {
          let count = 0;
          this.interval = window.setInterval(() => {
            count += 1;
            this.setState({
              count,
            });
          }, 1000);
        }
      })*/
      return lessTime;
    }else {
      return lessTime;
    }
  }

  modify = arg => {
    const { dispatch } = this.props;

    dispatch({
      type: 'sellOrderDetail/modifyPrice',
      payload: {
        real_pay_amount: arg.real_pay_amount,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
        router.push({
          pathname: `/order/sellOrder_detail/${data.data.new_order_id}`,
          query: {
            key: data.data.new_order_id,
          },
        });
      }
    })
  }

  modifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
  }

  handleModifyModalVisible = () => {
    this.setState({
      modifyVisible: true,
    });
  }

  orderWithdraw = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/orderWithdraw',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    })
  }

  orderCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellOrderDetail/orderCancel',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellOrderDetail/fetch',
      });
    })
  }

  render() {
    const { 
      sellOrderDetail,
      loading,
      receiptLoading,
      noReceiptLoading,
      orderCancelLoading,
      modifyPriceLoading,
      orderWithdrawLoading, 
    } = this.props;
    const time = (new Date().getTime() - moment(sellOrderDetail.updated_at).local().format('x')) > 5 * 60 * 1000 ? true : false;

    const lessTime = this.getAging(sellOrderDetail);
    const hoursTime = 60 * 60 * 1000;
    const profitPercent = new BigNumber(sellOrderDetail.deal_rate)
          .dividedBy(new BigNumber(sellOrderDetail.cny_price))
          .minus(1)
          .multipliedBy(100)
          .toNumber();

    const { modifyVisible } = this.state;
    const orderIdLength = sellOrderDetail.order_id ? sellOrderDetail.order_id.toString().length : null;

    const modifyMethods = {
      submit: this.modify,
      cancel: this.modifyCancel,
      params: sellOrderDetail,
      modifyPriceLoading
    };
                                               
    return (
      <ContLayout loading={loading}>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            {
              sellOrderDetail.real_pay_amount > 0 ?
              <Fragment>
                <Descriptions.Item label="订单状态">{ `${sellStatusType[sellOrderDetail.state]}(${sellOrderDetail.pay_amount_cny > sellOrderDetail.real_pay_amount ? '多收钱调价' : '少收钱调价'})` }</Descriptions.Item>
                <Descriptions.Item label="订单金额(原有金额/调价金额)">{ `${sellOrderDetail.real_pay_amount} ${cashType[sellOrderDetail.currency_type]}/${sellOrderDetail.pay_amount_cny} ${cashType[sellOrderDetail.currency_type]}` }
                </Descriptions.Item>
              </Fragment>
              :
              <Fragment>
                <Descriptions.Item label="订单状态">{ sellStatusType[sellOrderDetail.state] }</Descriptions.Item>
                <Descriptions.Item label="订单金额">{ `${sellOrderDetail.pay_amount_cny} ${cashType[sellOrderDetail.currency_type]}` }
                </Descriptions.Item>
              </Fragment>
            }
            <Descriptions.Item label="代币数量">{ `${sellOrderDetail.pay_amount} ${coinType[sellOrderDetail.token_id]}` }
            </Descriptions.Item>
            <Descriptions.Item label="交易汇率(USDT:CNY)">{ `1:${sellOrderDetail.deal_rate}` }</Descriptions.Item>
            <Descriptions.Item label="火币汇率(USDT:CNY)">{ `1:${sellOrderDetail.cny_price}` }</Descriptions.Item>
            <Descriptions.Item label="套利空间">{ `${profitPercent}%` }</Descriptions.Item>
            <Descriptions.Item label="交易利润(USDT)">{ `${sellOrderDetail.profit > -1 ? '+' : '' } ${sellOrderDetail.profit}` }</Descriptions.Item>
            
            {
              sellOrderDetail.state == 2 &&
              <Descriptions.Item label="时效"><span style={{color: '#EA0000'}}>{lessTime >= hoursTime ? `${lessTime.hours()} : ${lessTime.minutes()} : ${lessTime.seconds()}` : `${lessTime.minutes()} : ${lessTime.seconds()}`}</span></Descriptions.Item>
            }
            <Descriptions.Item label="付款用户">{ sellOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="付款人身份证">{ sellOrderDetail.id_number }</Descriptions.Item>
            <Descriptions.Item label="付款款人手机号">{ sellOrderDetail.telephone_number  }</Descriptions.Item>
            <Descriptions.Item label="付款账户">{ sellOrderDetail.user_pay_account }</Descriptions.Item>
            {
              (sellOrderDetail.pay_type == 1 || sellOrderDetail.pay_type == 4) &&
              <Descriptions.Item label="开户行">{ sellOrderDetail.user_account_bank_name }</Descriptions.Item>
            }
            <Descriptions.Item label="付款方式"><img src={payIcon[sellOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            {
              orderIdLength &&
              <Descriptions.Item label="订单号后6位">{ sellOrderDetail.order_id.toString().substr(orderIdLength-6, orderIdLength) }</Descriptions.Item>
            }
            <Descriptions.Item label="平台订单号">{ sellOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ sellOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="收币商户">{ sellOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(sellOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(sellOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="付款时间">{ sellOrderDetail.transfer_time ? moment(sellOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ sellOrderDetail.confirm_time ? moment(sellOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            {
              /*sellOrderDetail.state == 1 &&
              <Descriptions.Item label="操作">
                <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                  <Button loading={receiptLoading}>确认收款</Button>
                </Popconfirm>
              </Descriptions.Item>*/
            }
            {
              /*lessTime > 0 && sellOrderDetail.state == 2 &&
              <Descriptions.Item label="操作">
                <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                  <Button loading={receiptLoading}>确认收款</Button>
                </Popconfirm>
                {
                  time &&
                  <Fragment>
                    <span style={{display: 'inline-block', width: '10px'}}></span>
                    <Popconfirm title="是否要确认未收款？" onConfirm={this.noReceipt}>
                      <Button>未收到收款</Button>
                    </Popconfirm>
                  </Fragment>
                }
              </Descriptions.Item>*/
            }
            {
              (sellOrderDetail.state == 1 || sellOrderDetail.state == 2) &&
              <Descriptions.Item label="操作">
                <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                  <Button loading={receiptLoading}>确认收款</Button>
                </Popconfirm>
                <span style={{display: 'inline-block', width: '10px'}}></span>
                
                {
                  sellOrderDetail.state == 1 ?
                  <Popconfirm title="是否要确认取消订单？" onConfirm={this.orderCancel}>
                    <Button loading={orderCancelLoading}>取消订单</Button>
                  </Popconfirm>
                  :
                  <Popconfirm title="是否要确认未收款？" onConfirm={this.noReceipt}>
                    <Button loading={noReceiptLoading}>未收到收款</Button>
                  </Popconfirm>
                }
                <span style={{display: 'inline-block', width: '10px'}}></span>
                <Button onClick={this.handleModifyModalVisible}>调价确认</Button>
              </Descriptions.Item>
            }
            {
              sellOrderDetail.state == 3 &&
              <Descriptions.Item label="操作">
                <Popconfirm title="是否要确认撤回？" onConfirm={this.orderWithdraw}>
                  <Button loading={orderWithdrawLoading}>12小时撤回权</Button>
                </Popconfirm>
              </Descriptions.Item>
            }
            {
              (sellOrderDetail.state == 4 || sellOrderDetail.state == 8) &&
              <Descriptions.Item label="操作">
                <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                  <Button loading={receiptLoading}>确认收款</Button>
                </Popconfirm>
              </Descriptions.Item>
            }
          </Descriptions>
        </div>
        <CreateModifyForm {...modifyMethods} modalVisible={ modifyVisible } />
      </ContLayout>
    );
  }
}

export default SellOrderDetail;
