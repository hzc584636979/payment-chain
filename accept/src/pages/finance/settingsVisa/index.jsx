import { Button, Descriptions, Input, Upload, Icon, message, Row, Col } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

@connect(({ financeSettingsVisa, loading }) => ({
  financeSettingsVisa,
  fetchLoading: loading.effects['financeSettingsVisa/fetch'],
}))
class FinanceSettingsVisa extends Component {
  state = {
    params: {},
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'financeSettingsVisa/fetch',
    }).then(data => {
      this.setState({
        params: {
          ...data
        }
      })
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleName = e => {
    this.setState({
      params: {
        ...this.state.params,
        visa_real_name: e.target.value,
      }
    })
  }

  handleNumber = e => {
    this.setState({
      params: {
        ...this.state.params,
        visa_number: e.target.value,
      }
    })
  }

  handleVisaName = e => {
    this.setState({
      params: {
        ...this.state.params,
        visa_name: e.target.value,
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

    if(!telephone_number || !regPhone(telephone_number)) {
      message.error('请输入正确的手机号');
      return;
    }

    dispatch({
      type: 'financeSettingsVisa/getCode',
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
      visa_real_name, 
      visa_number,
      visa_name,
      telephone_number,
      telephone_verify_code,
    } = this.state.params;

    if(!visa_real_name) {
      message.error('请填写姓名后提交');
      return;
    }else if(!visa_number) {
      message.error('请填写银行卡号后提交');
      return;
    }else if(!visa_name) {
      message.error('请填写开户行后提交');
      return;
    }else if(!telephone_number || !(/^1\d{10}$/.test(telephone_number))) {
      message.error('请填写正确的手机号码后提交');
      return;
    }else if(!telephone_verify_code) {
      message.error('请填写手机验证码后提交');
      return;
    }

    this.setState({
      submitLoading: true,
    })

    const { dispatch } = this.props;
    dispatch({
      type: 'financeSettingsVisa/submit',
      payload: {
        visa_real_name, 
        visa_number,
        visa_name,
        telephone_number,
        telephone_verify_code,
      },
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
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
    const { submitLoading, count } = this.state;
    const { 
      visa_real_name, 
      visa_number,
      visa_name,
      telephone_number,
      telephone_verify_code,
    } = this.state.params;

    return (
      <ContLayout loading={fetchLoading || submitLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>姓名</span>} className={styles.textTop}>
                <Input onChange={this.handleName} style={{width: 385}} placeholder="输入姓名" value={visa_real_name} />
                <p style={{fontSize: 14, color: '#EA0000'}}>收款银行卡姓名必须与认证信息姓名一致</p>
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>银行卡号</span>}>
                <Input onChange={this.handleNumber} style={{width: 385}} placeholder="输入银行卡号" value={visa_number} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>开户行</span>}>
                <Input onChange={this.handleVisaName} style={{width: 385}} placeholder="输入开户行" value={visa_name} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机号码</span>}>
                <Input onChange={this.handlePhone} style={{width: 385}} placeholder="输入开户预留手机号" maxLength={11} value={telephone_number} />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>手机验证码</span>}>
                <Input onChange={this.handleCaptcha} style={{width: 385}} placeholder="输入手机验证码" maxLength={6} value={telephone_verify_code} />
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

export default FinanceSettingsVisa;
