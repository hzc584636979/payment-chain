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
    }).then(data => {
      this.setState({
        minCoin: data && data.data && data.data.min_amount,
        maxCoin: data && data.data && data.data.max_amount,
      })
    })
  }

  componentWillUnmount() {
    
  }

  handleMinCoin = e => {
    this.setState({
      minCoin: e.target.value
    })
  }

  handleMaxCoin = e => {
    this.setState({
      maxCoin: e.target.value
    })
  }

  saveCoin = () => {
    const { financeSettings } = this.props;
    const { minCoin, maxCoin } = this.state;
    if(!minCoin || !maxCoin){
      message.error('请修改金额后保存');
      return;
    }
    if(minCoin < financeSettings.limit_min_amount || minCoin > financeSettings.limit_max_amount || maxCoin < financeSettings.limit_min_amount || maxCoin > financeSettings.limit_max_amount){
      message.error(`最小不低于${financeSettings.limit_min_amount}CNY,最大不高于${financeSettings.limit_max_amount}CNY`);
      return;
    }
    if(minCoin > maxCoin) {
      message.error(`最小值不可大于最大值`);
      return;
    }
    this.setState({
      saveLoading: true,
    })
    const { dispatch } = this.props;
    dispatch({
      type: 'financeSettings/saveCoin',
      payload: {
        min_amount: minCoin,
        max_amount: maxCoin,
      },
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        saveLoading: false,
      })
    })
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
    }else if(type == 'visa') {
      url = 'financeSettings/visaDisabled';
      params = {
        visa_enable: !status
      }
    }else if(type == 'paypal') {
      url = 'financeSettings/paypalDisabled';
      params = {
        paypal_enable: !status
      }
    }

    dispatch({
      type: url,
      payload: params,
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
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
    }else if(type == 'visa') {
      url = 'financeSettings/visaDelete';
    }else if(type == 'paypal') {
      url = 'financeSettings/paypalDelete';
    }

    dispatch({
      type: url,
    }).then(data => {
      if(data.status != 1){
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'financeSettings/fetch',
      })
    })
  }

  render() {
    const { financeSettings, fetchLoading } = this.props;
    const { saveLoading, minCoin, maxCoin } = this.state;

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label="收款范围设置" className={styles.textTop}>
                <div>
                  <Input onChange={this.handleMinCoin} style={{width: 179}} value={minCoin || null} placeholder={`${financeSettings.limit_min_amount} CNY`} />
                  <span style={{padding: '0 5px'}}>至</span> 
                  <Input onChange={this.handleMaxCoin} style={{width: 179}} value={maxCoin || null} placeholder={`${financeSettings.limit_max_amount} CNY`} />
                  <Button
                    loading={saveLoading}
                    onClick={this.saveCoin}
                    type="primary"
                    style={{
                      display: 'inline-block',
                      marginLeft: 20
                    }}
                  >
                    保存
                  </Button>
                </div>
                <p style={{fontSize: 14, color: '#333'}}>
                  <span style={{paddingRight: 81}}>最小不低于{financeSettings.limit_min_amount}CNY</span><span>最大不高于{financeSettings.limit_max_amount}CNY</span>
                </p>
              </Descriptions.Item>

              {
                !financeSettings.bank_number ? 
                <Descriptions.Item label="银行卡设置">
                  <Link to="/finance/settingsBank">前往点击设置</Link>
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
                      <Link to="/finance/settingsBank">编辑</Link>
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
                  <Link to="/finance/settingsAlipay">前往点击设置</Link>
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
                      <Link to="/finance/settingsAlipay">编辑</Link>
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
                  <Link to="/finance/settingsWX">前往点击设置</Link>
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
                      <Link to="/finance/settingsWX">编辑</Link>
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

              {
                !financeSettings.visa_number ? 
                <Descriptions.Item label="VISA设置">
                  <Link to="/finance/settingsVisa">前往点击设置</Link>
                </Descriptions.Item>
                :
                <Fragment>
                  <Descriptions.Item label="VISA设置">
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.visa_number }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.visa_real_name }</div>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.visa_name }</div>
                    <Popconfirm title={ financeSettings.visa_enable ? "是否要禁用？" : "是否要启用？" } onConfirm={() => this.enable('visa', financeSettings.visa_enable)}>
                      <Button
                        type="primary"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        { financeSettings.visa_enable ? "禁用" : "启用" }
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      style={{
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      <Link to="/finance/settingsVisa">编辑</Link>
                    </Button>
                    <Popconfirm title="是否要删除？" onConfirm={() => this.delete('visa')}>
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
                !financeSettings.paypal_number ? 
                <Descriptions.Item label="Paypal设置">
                  <Link to="/finance/settingsPaypal">前往点击设置</Link>
                </Descriptions.Item>
                :
                <Fragment>
                  <Descriptions.Item label="Paypal设置">
                    <div style={{width: 385, display: 'inline-block'}}>{ financeSettings.paypal_number }</div>
                    <Popconfirm title={ financeSettings.paypal_enable ? "是否要禁用？" : "是否要启用？" } onConfirm={() => this.enable('paypal', financeSettings.paypal_enable)}>
                      <Button
                        type="primary"
                        style={{
                          display: 'inline-block',
                          marginLeft: 20
                        }}
                      >
                        { financeSettings.paypal_enable ? "禁用" : "启用" }
                      </Button>
                    </Popconfirm>
                    <Button
                      type="primary"
                      style={{
                        display: 'inline-block',
                        marginLeft: 20
                      }}
                    >
                      <Link to="/finance/settingsPaypal">编辑</Link>
                    </Button>
                    <Popconfirm title="是否要删除？" onConfirm={() => this.delete('paypal')}>
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
