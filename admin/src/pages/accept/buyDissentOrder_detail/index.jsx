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
      }else if(value < 0) {
        callback(`惩罚金额不能小于于0USDT`);
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

@connect(({ acceptBuyDissentOrderDetail, loading }) => ({
  acceptBuyDissentOrderDetail,
  loading: loading.effects['acceptBuyDissentOrderDetail/fetch'],
}))
class AcceptBuyDissentOrderDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    this.getInfo();
  }

  componentWillUnmount() {
    
  }

  getInfo = () => {
  	const { dispatch } = this.props;
    dispatch({
      type: 'acceptBuyDissentOrderDetail/fetch',
    })
  }

  toAccept = () => {
    const { dispatch } = this.props;

    this.setState({
      toAcceptLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptBuyDissentOrderDetail/toAccept',
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
      this.getInfo();
    })
  }

  toMerchant = () => {
    const { dispatch } = this.props;

    this.setState({
      toMerchantLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptBuyDissentOrderDetail/toMerchant',
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
      this.getInfo();
    })
  }

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptBuyDissentOrderDetail/close',
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
      this.getInfo();
    })
  }

  compromise = () => {
    const { dispatch } = this.props;

    this.setState({
      compromiseLock: true,
      operLock: true,
    })

    dispatch({
      type: 'acceptBuyDissentOrderDetail/compromise',
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
      this.getInfo();
    })
  }

  punishCancel = () => {
    this.setState({
      punishVisible: false,
    });
  }

  handlePunishModalVisible = type => {
    const { acceptBuyDissentOrderDetail } = this.props;

    this.setState({
      params: {
        type,
        lock_forfiet: acceptBuyDissentOrderDetail.lock_forfiet,
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
      type: params.type == 1 ? 'acceptBuyDissentOrderDetail/punishAccept' : 'acceptBuyDissentOrderDetail/punishMerchant',
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
      this.getInfo();
      this.setState({
        punishVisible: false,
      });
    })
  }

  render() {
    const { acceptBuyDissentOrderDetail, loading } = this.props;
    const { 
      toAcceptLock, 
      toMerchantLock, 
      closeLock, 
      operLock,
      compromiseLock, 
      params,
      punishVisible,
    } = this.state;
    const fileList = acceptBuyDissentOrderDetail.issue_file ? acceptBuyDissentOrderDetail.issue_file.split(',') : [];

    let appeal = null,
    	appeal_telephone_number = null,
    	beAppeal = null,
    	beAppeal_telephone_number = null;

    if(acceptBuyDissentOrderDetail.complainant == 1) {
    	appeal = acceptBuyDissentOrderDetail.m_user_name,
    	appeal_telephone_number = acceptBuyDissentOrderDetail.m_telephone_number,
    	beAppeal = acceptBuyDissentOrderDetail.a_user_name,
    	beAppeal_telephone_number = acceptBuyDissentOrderDetail.a_telephone_number;
    }else {
    	appeal = acceptBuyDissentOrderDetail.a_user_name,
    	appeal_telephone_number = acceptBuyDissentOrderDetail.a_telephone_number,
    	beAppeal = acceptBuyDissentOrderDetail.m_user_name,
    	beAppeal_telephone_number = acceptBuyDissentOrderDetail.m_telephone_number;
    }

    const punishMethods = {
      submit: this.punish,
      cancel: this.punishCancel,
      params,
    };
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议订单时间">{ moment(acceptBuyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="申诉者">{ appeal }</Descriptions.Item>
            <Descriptions.Item label="申诉者图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            <Descriptions.Item label="申诉者描述">{ acceptBuyDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="申诉者手机号">{ appeal_telephone_number }</Descriptions.Item>

            {
              acceptBuyDissentOrderDetail.issue_state == 3 &&
              <Fragment>
                <Descriptions.Item label="客服介入者联系方式">{ acceptBuyDissentOrderDetail.contact }</Descriptions.Item>
                <Descriptions.Item label="客服介入者申诉描述">{ acceptBuyDissentOrderDetail.content }</Descriptions.Item>
              </Fragment>
            }

            <Descriptions.Item label="被申诉者">{ beAppeal }</Descriptions.Item>
            <Descriptions.Item label="被申诉者手机号">{ beAppeal_telephone_number }</Descriptions.Item>

            <Descriptions.Item label="平台订单号">{ acceptBuyDissentOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ acceptBuyDissentOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="订单状态">{ buyStatusType[acceptBuyDissentOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="订单金额/代币数量">{ `${acceptBuyDissentOrderDetail.pay_amount_cny} ${cashType[acceptBuyDissentOrderDetail.currency_type]}/${acceptBuyDissentOrderDetail.pay_amount} ${coinType[acceptBuyDissentOrderDetail.token_id]}` }</Descriptions.Item>

            <Descriptions.Item label="创建时间">{ moment(acceptBuyDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>

            {
              acceptBuyDissentOrderDetail.issue_state == 2 &&
              <Fragment>	
            	<Descriptions.Item label="管理员处理时间">{ moment(acceptBuyDissentOrderDetail.manager_deal_time).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            	<Descriptions.Item label="管理员姓名">{ acceptBuyDissentOrderDetail.manager_name }</Descriptions.Item>
            	<Descriptions.Item label="管理员手机号">{ acceptBuyDissentOrderDetail.manager_telephone_number }</Descriptions.Item>
              	<Descriptions.Item label="处理结果">{ acceptBuyDissentOrderDetail.issue_result }</Descriptions.Item>
              	{
              		acceptBuyDissentOrderDetail.forfiet && 
              		<Descriptions.Item label="惩罚金额">{ `${acceptBuyDissentOrderDetail.forfiet}USDT` }</Descriptions.Item>
              	}
              </Fragment>
            }

            {
              (acceptBuyDissentOrderDetail.issue_state == 1 || acceptBuyDissentOrderDetail.issue_state == 3) &&
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
                {
                	acceptBuyDissentOrderDetail.issue_state == 3 &&
                	<Descriptions.Item>
	                  <Button onClick={() => this.handlePunishModalVisible(1)} disabled={operLock} type="primary">惩罚承兑商</Button>
	                  <span style={{display: 'inline-block', width: '10px'}}></span>
	                  <Button onClick={() => this.handlePunishModalVisible(2)} disabled={operLock} type="primary">惩罚商户</Button>
	                  <span style={{display: 'inline-block', width: '10px'}}></span>
	                  <Popconfirm title="是否要确认和解？" onConfirm={this.compromise}>
	                    <Button loading={compromiseLock} disabled={operLock} type="danger">和解</Button>
	                  </Popconfirm>
	                </Descriptions.Item>
                }
              </Fragment>
            }

            {/*<Descriptions.Item label="处理状态">{ issueTypeStatus[acceptBuyDissentOrderDetail.issue_state] }</Descriptions.Item>*/}
            
            {
              /*(acceptBuyDissentOrderDetail.state == 5 && acceptBuyDissentOrderDetail.payment_screenshot) &&
              <Descriptions.Item label="承兑商支付截图">
                <a target="_blank" href={acceptBuyDissentOrderDetail.payment_screenshot}><img src={acceptBuyDissentOrderDetail.payment_screenshot} width="150" height="150" /></a>
              </Descriptions.Item>*/
            }

            {/*<Descriptions.Item label="客户姓名">{acceptBuyDissentOrderDetail.payee_name}</Descriptions.Item>*/}

            {
              /*acceptBuyDissentOrderDetail.pay_type == 1 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{acceptBuyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>*/
            }

            {
              /*acceptBuyDissentOrderDetail.pay_type == 2 && 
              <Fragment>
                <Descriptions.Item label="客户支付宝账号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户支付宝收款码"><img src={acceptBuyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>*/
            }

            {
              /*acceptBuyDissentOrderDetail.pay_type == 3 && 
              <Fragment>
                <Descriptions.Item label="客户微信账号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户微信收款码"><img src={acceptBuyDissentOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>*/
            }

            {
              /*acceptBuyDissentOrderDetail.pay_type == 4 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{acceptBuyDissentOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>*/
            }

            {
              /*acceptBuyDissentOrderDetail.pay_type == 5 && 
              <Fragment>
                <Descriptions.Item label="客户Paypal账号">{acceptBuyDissentOrderDetail.payee_account}</Descriptions.Item>
              </Fragment>*/
            }
            
            {/*<Descriptions.Item label="订单更新时间">{ moment(acceptBuyDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ acceptBuyDissentOrderDetail.transfer_time ? moment(acceptBuyDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="转款时间">{ acceptBuyDissentOrderDetail.confirm_time ? moment(acceptBuyDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>*/}
            
          </Descriptions>
        </div>
        <CreatePunishForm {...punishMethods} modalVisible={ punishVisible } />
      </ContLayout>
    );
  }
}

export default AcceptBuyDissentOrderDetail;
