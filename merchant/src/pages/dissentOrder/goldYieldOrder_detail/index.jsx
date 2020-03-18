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

@connect(({ goldYieldDissentOrderDetail, loading }) => ({
  goldYieldDissentOrderDetail,
  fetchLoading: loading.effects['goldYieldDissentOrderDetail/fetch'],
}))
class GoldYieldDissentOrderDetail extends Component {
  state = {
    KFVisible: false,
    contact: '',
    content: '',
    fileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldYieldDissentOrderDetail/fetch',
    });
  }

  componentWillUnmount() {}

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
      contact: e.target.value,
    });
  };

  handleContent = e => {
    this.setState({
      content: e.target.value,
    });
  };

  handleKF = () => {
    this.setState({
      KFVisible: !this.state.KFVisible,
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { contact, content, fileList } = this.state;

    if (contact == '' || !regPhone(contact)) {
      message.error('请填写正确的联系方式后提交');
      return;
    } else if (content == '') {
      message.error('请填写申诉描述后提交');
      return;
    }

    this.setState({
      submitLock: true,
    });

    dispatch({
      type: 'goldYieldDissentOrderDetail/KF',
      payload: {
        contact,
        content,
        // fileList
      },
    }).then(data => {
      this.setState({
        submitLock: false,
      });
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      dispatch({
        type: 'goldYieldDissentOrderDetail/fetch',
      });
      this.setState({
        KFVisible: false,
        fileList: [],
      });
    });
  };

  handleCancel = () => {
    this.setState({
      KFVisible: false,
    });
  };

  closeObjection = () => {
    const { dispatch } = this.props;

    this.setState({
      closeLock: true,
    });

    dispatch({
      type: 'goldYieldDissentOrderDetail/close',
    }).then(data => {
      this.setState({
        closeLock: false,
      });
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      router.push(`/dissentOrder/goldYieldOrder?history`);
    });
  };

  render() {
    const { goldYieldDissentOrderDetail, fetchLoading } = this.props;
    const { KFVisible, submitLock, closeLock, loading, upLock } = this.state;
    const fileList = goldYieldDissentOrderDetail.issue_file ? goldYieldDissentOrderDetail.issue_file.split(',') : [];

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
      </div>
    );

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="异议时间">
              {moment(goldYieldDissentOrderDetail.issue_create_time)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="平台订单号">
              {goldYieldDissentOrderDetail.order_id}
            </Descriptions.Item>
            {/*<Descriptions.Item label="问题类型">
              {goldYieldDissentOrderDetail.issue_type}
            </Descriptions.Item>*/}
            <Descriptions.Item label="问题描述">
              {goldYieldDissentOrderDetail.issue_desc}
            </Descriptions.Item>
            <Descriptions.Item label="问题图片">
              { fileList.map((v, i) => <a key={i} target="_blank" href={v}><img src={v} style={{maxWidth: 150}} /></a>) }
            </Descriptions.Item>
            <Descriptions.Item label="处理状态">{ issueTypeStatus[goldYieldDissentOrderDetail.issue_state] }</Descriptions.Item>
            <Descriptions.Item label="唯一标示号">
              {goldYieldDissentOrderDetail.out_order_id}
            </Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {buyStatusType[goldYieldDissentOrderDetail.state]}
            </Descriptions.Item>
            <Descriptions.Item label="订单金额/代币数量">{ `${goldYieldDissentOrderDetail.pay_amount_cny} ${cashType[goldYieldDissentOrderDetail.currency_type]}/${goldYieldDissentOrderDetail.m_pay_amount} ${coinType[goldYieldDissentOrderDetail.token_id]}` }</Descriptions.Item>
            {/*<Descriptions.Item label="承兑商姓名">
              {goldYieldDissentOrderDetail.a_user_name}
            </Descriptions.Item>
            <Descriptions.Item label="承兑商手机号">{ goldYieldDissentOrderDetail.a_telephone_number }</Descriptions.Item>*/}
            <Descriptions.Item label="手续费">{ `${goldYieldDissentOrderDetail.gas} ${cashType[goldYieldDissentOrderDetail.token_id]}` }</Descriptions.Item>
            {
              (goldYieldDissentOrderDetail.state == 5 && goldYieldDissentOrderDetail.payment_screenshot) &&
              <Descriptions.Item label="支付截图">
                <a target="_blank" href={goldYieldDissentOrderDetail.payment_screenshot}><img src={goldYieldDissentOrderDetail.payment_screenshot} width="150" height="150" /></a>
              </Descriptions.Item>
            }
            {
              goldYieldDissentOrderDetail.issue_state == 2 &&
              <Fragment>
                <Descriptions.Item label="处理结果">{ goldYieldDissentOrderDetail.issue_result }</Descriptions.Item>
                {
                  goldYieldDissentOrderDetail.forfiet && 
                  <Descriptions.Item label="惩罚金额">{ `${goldYieldDissentOrderDetail.forfiet}USDT` }</Descriptions.Item>
                }
              </Fragment>
            }
            <Descriptions.Item label="创建时间">
              {moment(goldYieldDissentOrderDetail.created_at)
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {
              (goldYieldDissentOrderDetail.issue_state == 1 
              || goldYieldDissentOrderDetail.complainant == 1) &&
              <Descriptions.Item label="操作">
                {
                  goldYieldDissentOrderDetail.issue_state == 1 &&
                  <Fragment>
                    <Button type="primary" onClick={this.handleKF}>
                      客服介入
                    </Button>
                    <span style={{ display: 'inline-block', width: '10px' }}></span>
                  </Fragment>
                }
                {
                  goldYieldDissentOrderDetail.complainant == 1 &&
                  <Popconfirm title="是否要确认关闭异议？" onConfirm={this.closeObjection}>
                    <Button type="danger" loading={closeLock}>关闭异议</Button>
                  </Popconfirm>
                }
              </Descriptions.Item>
            }
          </Descriptions>
        </div>
        {KFVisible && (
          <Layer title="客服介入" hiddenVisible={this.handleCancel}>
            <div className={styles.layerWrap} style={{ width: '70%', margin: '0 auto' }}>
              <Descriptions column={1}>
                <Descriptions.Item label={<span className={styles.itemLabel}>联系方式</span>}>
                  <Input
                    placeholder="输入联系方式"
                    maxLength={11}
                    style={{ width: '100%' }}
                    onChange={this.handleContact}
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span className={styles.itemLabel}>申诉描述</span>}
                  className={styles.textTop}
                >
                  <TextArea
                    placeholder="请输入申诉描述"
                    onChange={this.handleContent}
                    style={{ width: '100%', height: 162 }}
                  />
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
                  <Button type="primary" loading={submitLock} onClick={this.handleOk}>
                    确定提交
                  </Button>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Layer>
        )}
      </ContLayout>
    );
  }
}

export default GoldYieldDissentOrderDetail;
