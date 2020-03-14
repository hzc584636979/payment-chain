import { 
  Button, 
  Descriptions, 
  Popconfirm, 
  Input, 
  message,
  Form,
  Modal, 
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;
const FormItem = Form.Item;

const CreatePunishForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, params } = props;
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
    if(value) {
      if(!Number(value)) {
        callback('请输入整数的惩罚金额');
      }else if(value > params.lock_forfiet) {
        callback(`惩罚金额不能大于${params.lock_forfiet}USDT`);
      }/*else if(value.toString().indexOf('.') > -1 && value.toString().split('.')[1].length > 8) {
          callback('惩罚金额的小数不能多于8位');
      }*/
    }
    callback();
  }

  return (
    <Modal
      title={params ? params.type == 1 ? "惩罚承兑商" : "惩罚商户" : null}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="惩罚金额">
          {form.getFieldDecorator('forfiet', {
            rules: [
              { 
                required: true, 
                message: '请输入惩罚金额' 
              },
              {
                validator: validator
              }
            ],
          })(<Input style={{width: 200}} placeholder="请输入惩罚金额" />)}USDT
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ acceptSellDissentOrderDetail, loading }) => ({
  acceptSellDissentOrderDetail,
  loading: loading.effects['acceptSellDissentOrderDetail/fetch'],
}))
class AcceptSellDissentOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'acceptSellDissentOrderDetail/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  toAccept = () => {
    const { dispatch } = this.props;

    this.setState({
      toAcceptLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptSellDissentOrderDetail/toAccept',
    }).then(data => {
      this.setState({
        toAcceptLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  toMerchant = () => {
    const { dispatch } = this.props;

    this.setState({
      toMerchantLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptSellDissentOrderDetail/toMerchant',
    }).then(data => {
      this.setState({
        toMerchantLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptSellDissentOrderDetail/close',
    }).then(data => {
      this.setState({
        closeLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  compromise = () => {
    const { dispatch } = this.props;

    this.setState({
      compromiseLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptSellDissentOrderDetail/compromise',
    }).then(data => {
      this.setState({
        compromiseLock: false,
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
    })
  }

  punishCancel = () => {
    this.setState({
      punishVisible: false,
    });
  }

  handlePunishModalVisible = type => {
    const { acceptSellDissentOrderDetail } = this.props;

    this.setState({
      params: {
        type,
        lock_forfiet: acceptSellDissentOrderDetail.lock_forfiet,
      },
      punishVisible: true,
    });
  }

  punish = arg => {
    const { dispatch } = this.props;
    const { params } = this.state;

    this.setState({
      operLock: true,
    })

    dispatch({
      type: params.type == 1 ? 'acceptSellDissentOrderDetail/punishAccept' : 'acceptSellDissentOrderDetail/punishMerchant',
      payload: {
        forfiet: Number(arg.forfiet),
      },
    }).then(data => {
      this.setState({
        operLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        punishVisible: false,
      });
    })
  }

  render() {
    const { acceptSellDissentOrderDetail, loading } = this.props;
    const { 
      toAcceptLock, 
      toMerchantLock, 
      closeLock, 
      operLock,
      compromiseLock, 
      params,
      punishVisible,
    } = this.state;
    const fileList = acceptSellDissentOrderDetail.issue_file ? acceptSellDissentOrderDetail.issue_file.split(',') : [];

    const punishMethods = {
      submit: this.punish,
      cancel: this.punishCancel,
      params,
    };
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(acceptSellDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="问题类型">{ acceptSellDissentOrderDetail.issue_type }</Descriptions.Item>
            <Descriptions.Item label="问题描述">{ acceptSellDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            {
              acceptSellDissentOrderDetail.issue_state == 3 &&
              <Fragment>
                <Descriptions.Item label="客服介入联系方式">{ acceptSellDissentOrderDetail.contact }</Descriptions.Item>
                <Descriptions.Item label="客服介入申诉描述">{ acceptSellDissentOrderDetail.content }</Descriptions.Item>
              </Fragment>
            }
            <Descriptions.Item label="处理状态">{ issueTypeStatus[acceptSellDissentOrderDetail.issue_state] }</Descriptions.Item>
            {
              acceptSellDissentOrderDetail.issue_state == 2 &&
              <Descriptions.Item label="处理结果">{ acceptSellDissentOrderDetail.issue_result }</Descriptions.Item>
            }
            <Descriptions.Item label="平台订单号">{ acceptSellDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ acceptSellDissentOrderDetail.out_order_id }</Descriptions.Item>
            {
              acceptSellDissentOrderDetail.real_pay_amount > 0 ?
              <Fragment>
                <Descriptions.Item label="订单状态">{ `${sellStatusType[acceptSellDissentOrderDetail.state]}(${acceptSellDissentOrderDetail.pay_amount_cny > acceptSellDissentOrderDetail.real_pay_amount ? '多收钱调价' : '少收钱调价'})` }</Descriptions.Item>
                <Descriptions.Item label="订单金额(原有金额/调价金额)">{ `${acceptSellDissentOrderDetail.real_pay_amount} ${cashType[acceptSellDissentOrderDetail.currency_type]}/${acceptSellDissentOrderDetail.pay_amount_cny} ${cashType[acceptSellDissentOrderDetail.currency_type]}` }
                </Descriptions.Item>
              </Fragment>
              :
              <Fragment>
                <Descriptions.Item label="订单状态">{ sellStatusType[acceptSellDissentOrderDetail.state] }</Descriptions.Item>
                <Descriptions.Item label="订单金额">{ `${acceptSellDissentOrderDetail.pay_amount_cny} ${cashType[acceptSellDissentOrderDetail.currency_type]}` }
                </Descriptions.Item>
              </Fragment>
            }
            <Descriptions.Item label="代币数量">{ `${acceptSellDissentOrderDetail.pay_amount} ${coinType[acceptSellDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="承兑商昵称">{ acceptSellDissentOrderDetail.a_user_name }</Descriptions.Item>
            <Descriptions.Item label="承兑商手机号">{ acceptSellDissentOrderDetail.a_telephone_number }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ acceptSellDissentOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="商户手机号">{ acceptSellDissentOrderDetail.m_telephone_number }</Descriptions.Item>
            <Descriptions.Item label="付款用户">{ acceptSellDissentOrderDetail.pay_real_name }</Descriptions.Item>
            <Descriptions.Item label="付款账户">{ acceptSellDissentOrderDetail.user_pay_account }</Descriptions.Item>
            {
              (acceptSellDissentOrderDetail.pay_type == 1 || acceptSellDissentOrderDetail.pay_type == 4) &&
              <Descriptions.Item label="开户行">{ acceptSellDissentOrderDetail.user_account_bank_name }</Descriptions.Item>
            }
            <Descriptions.Item label="付款方式"><img src={payIcon[acceptSellDissentOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(acceptSellDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(acceptSellDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="付款时间">{ acceptSellDissentOrderDetail.transfer_time ? moment(acceptSellDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ acceptSellDissentOrderDetail.confirm_time ? moment(acceptSellDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            {
              (acceptSellDissentOrderDetail.issue_state == 1 || acceptSellDissentOrderDetail.issue_state == 3) &&
              <Fragment>
                <Descriptions.Item label="操作">
                  <Popconfirm title="是否要确认释放给承兑商？" onConfirm={this.toAccept}>
                    <Button loading={toAcceptLock} disabled={operLock} type="primary">释放给承兑商</Button>
                  </Popconfirm>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Popconfirm title="是否要确认释放给商户？" onConfirm={this.toMerchant}>
                    <Button loading={toMerchantLock} disabled={operLock} type="primary">释放给商户</Button>
                  </Popconfirm>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Popconfirm title="是否要确认取消订单？" onConfirm={this.closeObjection}>
                    <Button loading={closeLock} disabled={operLock} type="danger">取消订单</Button>
                  </Popconfirm>
                </Descriptions.Item>
                <Descriptions.Item>
                  <Button onClick={() => this.handlePunishModalVisible(1)} disabled={operLock} type="primary">惩罚承兑商</Button>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Button onClick={() => this.handlePunishModalVisible(2)} disabled={operLock} type="primary">惩罚商户</Button>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Popconfirm title="是否要确认和解？" onConfirm={this.compromise}>
                    <Button loading={compromiseLock} disabled={operLock} type="danger">和解</Button>
                  </Popconfirm>
                </Descriptions.Item>
              </Fragment>
            }
          </Descriptions>
        </div>
        <CreatePunishForm {...punishMethods} modalVisible={ punishVisible } />
      </ContLayout>
    );
  }
}

export default AcceptSellDissentOrderDetail;
