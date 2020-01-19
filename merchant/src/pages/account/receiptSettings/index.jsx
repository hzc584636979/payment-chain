import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Popconfirm } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

@connect(({ financeSettings, loading }) => ({
  financeSettings,
  fetchLoading: loading.effects['financeSettings/fetch'],
}))
class FinanceSettings extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'financeSettings/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  enable = (type, status) => {
    const { dispatch } = this.props;

    let url, params;
    if(type == 'bank') {
      url = 'financeSettings/bankDisabled';
      params = {
        bank_enable: !status
      }
    }else if(type == 'ali') {
      url = 'financeSettings/alipayDisabled';
      params = {
        ali_enable: !status
      }
    }else if(type == 'wx') {
      url = 'financeSettings/WXDisabled';
      params = {
        we_enable: !status
      }
    }

    dispatch({
      type: url,
      payload: params,
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
        return;
      }
      dispatch({
        type: 'financeSettings/fetch',
      })
    })
  }

  delete = type => {
    const { dispatch } = this.props;

    let url;
    if(type == 'bank') {
      url = 'financeSettings/bankDelete';
    }else if(type == 'ali') {
      url = 'financeSettings/alipayDelete';
    }else if(type == 'wx') {
      url = 'financeSettings/WXDelete';
    }

    dispatch({
      type: url,
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
        return;
      }
      dispatch({
        type: 'financeSettings/fetch',
      })
    })
  }

  render() {
    const { financeSettings, fetchLoading } = this.props;
    const { saveLoading } = this.state;

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              {
                !financeSettings.bank_number ? 
                <Descriptions.Item label="银行卡设置">
                  <Link to="/account/settingsBank">前往点击设置</Link>
                </Descriptions.Item>
                :
                <Fragment>
                  <Descriptions.Item label="银行卡设置">
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.bank_number }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.bank_real_name }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.bank_name }</div>
                    <Popconfirm title={ financeSettings.bank_enable ? "是否要禁用？" : "是否要启用？" } onConfirm={() => this.enable('bank', financeSettings.bank_enable)}>
                      <Button
                        type="primary"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        { financeSettings.bank_enable ? "禁用" : "启用" }
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      style={{
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      <Link to="/account/settingsBank">编辑</Link>
                    </Button>
                    <Popconfirm title="是否要删除？" onConfirm={() => this.delete('bank')}>
                      <Button
                        type="danger"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </Descriptions.Item>
                </Fragment>
              }

              {
                !financeSettings.ali_pay_number ? 
                <Descriptions.Item label="支付宝设置">
                  <Link to="/account/settingsAlipay">前往点击设置</Link>
                </Descriptions.Item>
                :
                <Fragment>
                  <Descriptions.Item label="支付宝设置">
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.ali_pay_number }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.ali_real_name }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}><img width="120" height="120" src={ financeSettings.ali_payment_qr_code } /></div>
                    <Popconfirm title={ financeSettings.ali_enable ? "是否要禁用？" : "是否要启用？" } onConfirm={() => this.enable('ali', financeSettings.ali_enable)}>
                      <Button
                        type="primary"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        { financeSettings.ali_enable ? "禁用" : "启用" }
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      style={{
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      <Link to="/account/settingsAlipay">编辑</Link>
                    </Button>
                    <Popconfirm title="是否要删除？" onConfirm={() => this.delete('ali')}>
                      <Button
                        type="danger"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </Descriptions.Item>
                </Fragment>
              }

              {
                !financeSettings.we_number ? 
                <Descriptions.Item label="微信设置">
                  <Link to="/account/settingsWX">前往点击设置</Link>
                </Descriptions.Item>
                :
                <Fragment>
                  <Descriptions.Item label="微信设置">
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.we_number }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.we_real_name }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}><img width="120" height="120" src={ financeSettings.we_payment_qr_code } /></div>
                    <Popconfirm title={ financeSettings.we_enable ? "是否要禁用？" : "是否要启用？" } onConfirm={() => this.enable('wx', financeSettings.we_enable)}>
                      <Button
                        type="primary"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        { financeSettings.we_enable ? "禁用" : "启用" }
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      style={{
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      <Link to="/account/settingsWX">编辑</Link>
                    </Button>
                    <Popconfirm title="是否要删除？" onConfirm={() => this.delete('wx')}>
                      <Button
                        type="danger"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </Descriptions.Item>
                </Fragment>
              }
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default FinanceSettings;
