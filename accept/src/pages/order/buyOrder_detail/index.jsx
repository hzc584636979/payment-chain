import { Button, Descriptions, Popconfirm, Input, message, Popover, Icon, Upload } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import Layer from '@/components/Layer';
import { getBase64 } from '@/utils/utils';
import moment from 'moment';
import styles from './style.less';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG文件!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片超过2MB!');
    return false;
  }
  return true;
}

const { TextArea } = Input;

@connect(({ buyOrderDetail, loading }) => ({
  buyOrderDetail,
  loading: loading.effects['buyOrderDetail/fetch'],
}))
class buyOrderDetail extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/fetch',
    }).then(data => {
      let count = 0;
      this.interval = window.setInterval(() => {
        count += 1;
        this.setState({
          count,
        });
      }, 1000);
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  transfer = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/transfer',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'buyOrderDetail/fetch',
      });
    })
  }

  receipt = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderDetail/receipt',
      payload: {
        payment_screenshot: this.state.receiptImg
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'buyOrderDetail/fetch',
      });
    })
  }

  getAging = buyOrderDetail => {
    const time1 = new Date().getTime() - moment(buyOrderDetail.updated_at).local().format('x');
    const time2 = Number(buyOrderDetail.aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);

    if(lessTime <= 0) {
      /*const { dispatch } = this.props;
      dispatch({
        type: 'buyOrderDetail/fetch',
      }).then(data => {
        clearInterval(this.interval);
        if(data.data.state == 4 || data.data.state == 3) {
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

  handleUploadImg = file => {
    if(!beforeUpload(file)) return false;
    this.setState({
      handleUploadImgLoading: true
    })
    getBase64(file, imageUrl =>
      this.setState({
        receiptImg: imageUrl,
        handleUploadImgLoading: false,
      }),
    );
    return false;
  }

  handleReceiptChange = () => {
    this.setState({
      receiptChange: false,
      visible: false,
      receiptImg: null,
    })
  }

  handleShowReceiptImg = () => {
    this.setState({
      visible: true,
    })
  }

  render() {
    const { buyOrderDetail, loading } = this.props;
    const { handleUploadImgLoading, receiptImg, visible } = this.state;
    const lessTime = this.getAging(buyOrderDetail);
    const hoursTime = 60 * 60 * 1000;

    const uploadButton = (
      <div>
        <Icon type={handleUploadImgLoading ? 'loading' : 'plus'} />
      </div>
    );
                     
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="订单金额">{ `${buyOrderDetail.pay_amount_cny} ${cashType[buyOrderDetail.currency_type]}` }</Descriptions.Item>
            <Descriptions.Item label="代币数量">{ `${buyOrderDetail.pay_amount} ${coinType[buyOrderDetail.token_id]}` }</Descriptions.Item>
            
            {
              (buyOrderDetail.state == 4 || buyOrderDetail.state == 3) &&
              <Descriptions.Item label="时效"><span style={{color: '#EA0000'}}>{lessTime >= hoursTime ? `${lessTime.hours()} : ${lessTime.minutes()} : ${lessTime.seconds()}` : `${lessTime.minutes()} : ${lessTime.seconds()}`}</span></Descriptions.Item>
            }
            <Descriptions.Item label="客户姓名">{buyOrderDetail.payee_name}</Descriptions.Item>

            {
              buyOrderDetail.pay_type == 1 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{buyOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{buyOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 2 && 
              <Fragment>
                <Descriptions.Item label="客户支付宝账号">{buyOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户支付宝收款码"><img src={buyOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 3 && 
              <Fragment>
                <Descriptions.Item label="客户微信账号">{buyOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户微信收款码"><img src={buyOrderDetail.pay_code_url} style={{maxWidth: 150}} /></Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 4 && 
              <Fragment>
                <Descriptions.Item label="客户银行卡号">{buyOrderDetail.payee_account}</Descriptions.Item>
                <Descriptions.Item label="客户开户行">{buyOrderDetail.account_bank_name}</Descriptions.Item>
              </Fragment>
            }

            {
              buyOrderDetail.pay_type == 5 && 
              <Fragment>
                <Descriptions.Item label="客户Paypal账号">{buyOrderDetail.payee_account}</Descriptions.Item>
              </Fragment>
            }
            
            <Descriptions.Item label="订单状态">{ buyStatusType[buyOrderDetail.state] }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ buyOrderDetail.order_id }</Descriptions.Item>
            <Descriptions.Item label="商户订单号">{ buyOrderDetail.out_order_id }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ buyOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="创建时间">{ moment(buyOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="订单更新时间">{ moment(buyOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="接单时间">{ buyOrderDetail.transfer_time ? moment(buyOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="转款时间">{ buyOrderDetail.confirm_time ? moment(buyOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            
            {
              lessTime > 0 && (buyOrderDetail.state == 4 || buyOrderDetail.state == 3) && 
              <Descriptions.Item label="操作">
                {
                  buyOrderDetail.state == 4 ?
                  <Popover 
                    title={`上传支付截图`}
                    content={
                      <div style={{width: 150}}>
                        <div style={{textAlign: 'center', width: 104, margin: '0 auto'}}>
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={this.handleUploadImg}
                            accept={'.jpg,.jpeg,.png'}
                          >
                            { receiptImg ? <img width="50" height="50" src={receiptImg} /> : uploadButton }
                          </Upload>
                        </div>
                        <Button onClick={this.handleReceiptChange}>取消</Button>
                        <span style={{display: 'inline-block', width: '10px'}}></span>
                        <Button disabled={!receiptImg} type="primary" onClick={() => this.receipt(buyOrderDetail.order_id)}>确定</Button>
                      </div>
                    }
                    trigger="click"
                    visible={visible}
                  >
                    <Button onClick={this.handleShowReceiptImg}>确认转款</Button>
                  </Popover>
                  :
                  buyOrderDetail.state == 3 ?
                  <Popconfirm title="是否要确认接单？" onConfirm={this.transfer}>
                    <Button type="primary">确认接单</Button>
                  </Popconfirm>
                  :
                  null
                }
              </Descriptions.Item>
            }
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default buyOrderDetail;
