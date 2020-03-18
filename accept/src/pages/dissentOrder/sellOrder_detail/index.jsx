import { Button, Descriptions, Popconfirm, Input, message, Upload, Icon } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import ContLayout from '@/components/ContLayout';
import { getBase64 } from '@/utils/utils';
import Layer from '@/components/Layer';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;

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

@connect(({ sellDissentOrderDetail, loading }) => ({
  sellDissentOrderDetail,
  fetchLoading: loading.effects['sellDissentOrderDetail/fetch'],
  receiptLoading: loading.effects['sellDissentOrderDetail/receipt'],
}))
class SellDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
    contact: '',
    content: '',
    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellDissentOrderDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  handleChange = file => {
    if(!beforeUpload(file)) return false;
    getBase64(file, imageUrl => {
      if(!imageUrl) {
        this.setState({
          loading: false,
        });
        return;
      }
      this.setState({
        fileList: [
          ...this.state.fileList,
          imageUrl,
        ],
        upLock: this.state.fileList.length < 2 ? false : true,
        loading: false,
      })
    });
    return false;
  }

  handleContact = e => {
    this.setState({
      contact: e.target.value
    })
  }

  handleContent = e => {
    this.setState({
      content: e.target.value
    })
  }

  handleKF = () => {
    this.setState({
      KFVisible: !this.state.KFVisible,
    })
  }

  handleOk = () => {
    const { dispatch } = this.props;
    const { contact, content, fileList } = this.state;
    
    if(contact == '' || !regPhone(contact)) {
      message.error('请填写正确的联系方式后提交');
      return;
    }else if(content == '') {
      message.error('请填写申诉描述后提交');
      return;
    }

    this.setState({
      submitLock: true,
    })

    dispatch({
      type: 'sellDissentOrderDetail/KF',
      payload: {
        contact,
        content,
        // fileList
      },
    }).then(data => {
      this.setState({
        submitLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellDissentOrderDetail/fetch',
      });
      this.setState({
        KFVisible: false,
        fileList: [],
      })
    })
  }

  handleCancel = () => {
    this.setState({
      KFVisible: false,
    })
  }

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
    })

    dispatch({
      type: 'sellDissentOrderDetail/close',
    }).then(data => {
      this.setState({
        closeLock: false,
      })
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      router.push(`/dissentOrder/sellOrder?history`);
    })
  }

  receipt = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellDissentOrderDetail/receipt',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'sellDissentOrderDetail/fetch',
      });
    })
  }

  render() {
    const { sellDissentOrderDetail, fetchLoading, receiptLoading } = this.props;
    const { KFVisible, submitLock, closeLock, loading, upLock } = this.state;
    const KFStatus = true/*new Date().getTime() - moment(sellDissentOrderDetail.issue_create_time).local().format('x') > 3 * 60 * 60 * 1000 ? true : false*/;
    const fileList = sellDissentOrderDetail.issue_file ? sellDissentOrderDetail.issue_file.split(',') : [];
    
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
      </div>
    );

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">{ moment(sellDissentOrderDetail.issue_create_time).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="平台订单号">{ sellDissentOrderDetail.order_id }</Descriptions.Item>
            {/*<Descriptions.Item label="问题类型">{ sellDissentOrderDetail.issue_type }</Descriptions.Item>*/}
            <Descriptions.Item label="问题描述">{ sellDissentOrderDetail.issue_desc }</Descriptions.Item>
            <Descriptions.Item label="问题图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            <Descriptions.Item label="处理状态">{ issueTypeStatus[sellDissentOrderDetail.issue_state] }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">{ sellDissentOrderDetail.out_order_id }</Descriptions.Item>
            {
              sellDissentOrderDetail.real_pay_amount > 0 ?
              <Fragment>
                <Descriptions.Item label="订单状态">{ `${sellStatusType[sellDissentOrderDetail.state]}(${sellDissentOrderDetail.pay_amount_cny > sellDissentOrderDetail.real_pay_amount ? '多收钱调价' : '少收钱调价'})` }</Descriptions.Item>
                <Descriptions.Item label="订单金额(原有金额/调价金额)">{ `${sellDissentOrderDetail.real_pay_amount} ${cashType[sellDissentOrderDetail.currency_type]}/${sellDissentOrderDetail.pay_amount_cny} ${cashType[sellDissentOrderDetail.currency_type]}` }
                </Descriptions.Item>
              </Fragment>
              :
              <Fragment>
                <Descriptions.Item label="订单状态">{ sellStatusType[sellDissentOrderDetail.state] }</Descriptions.Item>
                <Descriptions.Item label="订单金额">{ `${sellDissentOrderDetail.pay_amount_cny} ${cashType[sellDissentOrderDetail.currency_type]}` }
                </Descriptions.Item>
              </Fragment>
            }
            <Descriptions.Item label="代币数量">{ `${sellDissentOrderDetail.pay_amount} ${coinType[sellDissentOrderDetail.token_id]}` }</Descriptions.Item>
            <Descriptions.Item label="商户昵称">{ sellDissentOrderDetail.m_user_name }</Descriptions.Item>
            <Descriptions.Item label="商户手机号">{ sellDissentOrderDetail.m_telephone_number }</Descriptions.Item>
            <Descriptions.Item label="付款用户">{ sellDissentOrderDetail.payee_name }</Descriptions.Item>
            <Descriptions.Item label="付款账户">{ sellDissentOrderDetail.user_pay_account }</Descriptions.Item>
            {
              (sellDissentOrderDetail.pay_type == 1 || sellDissentOrderDetail.pay_type == 4) &&
              <Descriptions.Item label="开户行">{ sellDissentOrderDetail.user_account_bank_name }</Descriptions.Item>
            }
            <Descriptions.Item label="付款方式"><img src={payIcon[sellDissentOrderDetail.pay_type]} style={{maxWidth: 40}} /></Descriptions.Item>
            <Descriptions.Item label="收币商户">{ sellDissentOrderDetail.m_user_name }</Descriptions.Item>
            {
              sellDissentOrderDetail.issue_state == 2 &&
              <Fragment>
                <Descriptions.Item label="处理结果">{ sellDissentOrderDetail.issue_result }</Descriptions.Item>
                {
                  sellDissentOrderDetail.forfiet && 
                  <Descriptions.Item label="惩罚金额">{ `${sellDissentOrderDetail.forfiet}USDT` }</Descriptions.Item>
                }
              </Fragment>
            }
            <Descriptions.Item label="创建时间">{ moment(sellDissentOrderDetail.created_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            {/*<Descriptions.Item label="订单更新时间">{ moment(sellDissentOrderDetail.updated_at).local().format('YYYY-MM-DD HH:mm:ss') }</Descriptions.Item>
            <Descriptions.Item label="付款时间">{ sellDissentOrderDetail.transfer_time ? moment(sellDissentOrderDetail.transfer_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>
            <Descriptions.Item label="承兑商确认时间">{ sellDissentOrderDetail.confirm_time ? moment(sellDissentOrderDetail.confirm_time).local().format('YYYY-MM-DD HH:mm:ss') : EXHIBITION2 }</Descriptions.Item>*/}
            {
              ((sellDissentOrderDetail.issue_state != 2 && (sellDissentOrderDetail.state == 1 || sellDissentOrderDetail.state == 2 || sellDissentOrderDetail.state == 4 || sellDissentOrderDetail.state == 8)) 
              || sellDissentOrderDetail.issue_state == 1 
              || sellDissentOrderDetail.complainant == 2 ) &&
              <Descriptions.Item label="操作">
                {
                  (sellDissentOrderDetail.issue_state != 2 && (sellDissentOrderDetail.state == 1 || sellDissentOrderDetail.state == 2 || sellDissentOrderDetail.state == 4 || sellDissentOrderDetail.state == 8)) &&
                  <Fragment>
                    <Popconfirm title="是否要确认收款？" onConfirm={this.receipt}>
                      <Button loading={receiptLoading}>确认收款</Button>
                    </Popconfirm>
                    <span style={{display: 'inline-block', width: '10px'}}></span>
                  </Fragment>
                }
                {
                  /*sellDissentOrderDetail.issue_state == 1 &&
                  <Fragment>
                    <Button type="primary" onClick={this.handleKF}>客服介入</Button>
                    <span style={{display: 'inline-block', width: '10px'}}></span>
                  </Fragment>*/
                }
                {
                  sellDissentOrderDetail.complainant == 2 &&
                  <Popconfirm title="是否要确认关闭异议？" onConfirm={this.closeObjection}>
                    <Button type="danger" loading={closeLock}>关闭异议</Button>
                  </Popconfirm>
                }
              </Descriptions.Item>
            }
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
                  <Input placeholder="输入联系方式" style={{width: '100%'}} maxLength={11} onChange={this.handleContact} />
                </Descriptions.Item>
                <Descriptions.Item label={<span className={styles.itemLabel}>申诉描述</span>} className={styles.textTop}>
                  <TextArea placeholder="请输入申诉描述" onChange={this.handleContent} style={{width: '100%', height: 162}} />
                </Descriptions.Item>
                {/*<Descriptions.Item label={<span className={styles.itemLabel}>申诉图片</span>} className={styles.textTop}>
                                  <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    showUploadList={true}
                                    beforeUpload={this.handleChange}
                                    disabled={upLock}
                                    multiple={true}
                                    accept={'.jpg,.jpeg,.png'}
                                  >
                                    {!submitLock && !upLock && uploadButton}
                                  </Upload>
                                  <div className={styles.upImgDesc}>图片上传限制:最多3张，最大2MB</div>
                                </Descriptions.Item>*/}
                <Descriptions.Item className={styles.noneBeforeIcon}>
                  <Button type="primary" loading={submitLock} onClick={this.handleOk}>确定提交</Button>
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
