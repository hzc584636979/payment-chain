import { Button, Descriptions, Input, Upload, Icon, message, Row, Col } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('图片超过5MB!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({ financeSettingsWX, loading }) => ({
  financeSettingsWX,
  fetchLoading: loading.effects['financeSettingsWX/fetch'],
}))
class FinanceSettingsWX extends Component {
  state = {
    params: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'financeSettingsWX/fetch',
    }).then(data => {
      this.setState({
        params: {
          ...data
        }
      })
    })
  }

  interval = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleName = e => {
    this.setState({
      params: {
        ...this.state.params,
        we_real_name: e.target.value,
      }
    })
  }

  handleNumber = e => {
    this.setState({
      params: {
        ...this.state.params,
        we_number: e.target.value,
      }
    })
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          params: {
            ...this.state.params,
            we_payment_qr_code: imageUrl,
          },
          loading: false,
        }),
      );
    }
  }

  handleLink = e => {
    this.setState({
      params: {
        ...this.state.params,
        we_payment_link: e.target.value,
      }
    })
  }

  handlePhone = e => {
    this.setState({
      params: {
        ...this.state.params,
        telephone_number: e.target.value,
      }
    })
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const { telephone_number } = this.state.params;

    if(!telephone_number) {
      message.error('请输入手机号');
      return;
    }

    dispatch({
      type: 'financeSettingsWX/getCode',
      payload: {
        telephone_number
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      let count = 59;
      this.setState({
        count,
      });
      this.interval = window.setInterval(() => {
        count -= 1;
        this.setState({
          count,
        });

        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);
    })
  }

  handleCaptcha = e => {
    this.setState({
      params: {
        ...this.state.params,
        telephone_verify_code: e.target.value,
      }
    })
  }

  submit = () => {
    const { 
      we_real_name, 
      we_number,
      we_payment_qr_code,
      we_payment_link,
      telephone_number,
      telephone_verify_code,
    } = this.state.params;
    if(!we_real_name || !we_number || !we_payment_qr_code || !we_payment_link || !telephone_number || !telephone_verify_code){
      message.error('请填写完整信息后提交');
      return;
    }
    this.setState({
      submitLoading: true,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'financeSettingsWX/submit',
      payload: {
        we_real_name, 
        we_number,
        we_payment_qr_code,
        we_payment_link,
        telephone_number,
        telephone_verify_code,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        submitLoading: false,
      })
    })
  }

  render() {
    const { fetchLoading } = this.props;
    const { submitLoading, count, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
      </div>
    );

    const { 
      we_real_name, 
      we_number,
      we_payment_qr_code,
      we_payment_link,
      telephone_number,
      telephone_verify_code,
    } = this.state.params;

    return (
      <ContLayout loading={fetchLoading || submitLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>姓名</span>} className={styles.textTop}>
                <Input onChange={this.handleName} style={{width: 385}} placeholder="输入姓名" value={we_real_name} />
                <p style={{fontSize: 14, color: '#EA0000'}}>收款微信姓名必须与认证信息姓名一致</p>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>微信号</span>}>
                <Input onChange={this.handleNumber} style={{width: 385}} placeholder="输入微信号" value={we_number} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>收款码</span>} className={styles.textTop}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                  accept={'.jpg,.jpeg,.png'}
                >
                  { we_payment_qr_code ? <img width="103" height="103" src={we_payment_qr_code} /> : uploadButton }
                </Upload>
                <div className={styles.upImgDesc}>上传收款码</div>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>收码链接</span>}>
                <Input onChange={this.handleLink} style={{width: 385}} placeholder="输入收码链接" value={we_payment_link} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机号码</span>}>
                <Input onChange={this.handlePhone} style={{width: 385}} placeholder="输入手机号码" value={telephone_number} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input onChange={this.handleCaptcha} style={{width: 385}} placeholder="输入手机验证码" value={telephone_verify_code} />
                <Button
                  disabled={!!count}
                  onClick={this.onGetCaptcha}
                  style={{
                    width: 140,
                    display: 'inline-block',
                    marginLeft: 20
                  }}
                >
                  {count
                    ? `${count} s`
                    : '获取手机验证码'}
                </Button>
              </Descriptions.Item>
              <Descriptions.Item className={styles.noneBeforeIcon}>
                <Button type="primary" loading={submitLoading} onClick={this.submit}>确定提交</Button>
                <span style={{display: 'inline-block', width: '10px'}}></span>
                <Button>
                  <Link to="/finance/settings">返回</Link>
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default FinanceSettingsWX;
