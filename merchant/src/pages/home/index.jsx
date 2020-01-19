import { Col, Dropdown, Icon, Menu, Row, Button, notification, message, Input, Carousel, Select } from 'antd';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { GridContent } from '@ant-design/pro-layout';
import { connect, routerRedux } from 'dva';
import Layer from '@/components/Layer';
import copy from 'copy-to-clipboard';
import { getRealNamePassed } from '@/utils/utils';
import moment from 'moment';
import QRCode  from 'qrcode.react';
import BigNumber from 'bignumber.js';
import styles from './style.less';
import banner1 from '@/assets/img_home_banner.png';
import ewm from '@/assets/icon_qianbi.png';
import apiDoc from '@/assets/apiDoc-v1.0.0.docx';

const { Option } = Select;

@connect(({ user, home, loading }) => ({
  currentUser: user.currentUser,
  home,
  loading: loading.effects['home/fetch'],
}))
class Home extends Component {
  state = {    
    tokenBalance1: g_getLocalStorage('tokenBalance1') || false,
    tokenBalance2: g_getLocalStorage('tokenBalance2') || false,
    tokenBalance3: g_getLocalStorage('tokenBalance3') || false,
    tokenBalance4: g_getLocalStorage('tokenBalance4') || false,
    payVisible: false,
    withdrawApplyVisible: false,
    walletType: 1,
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'home/fetch',
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  eyeVisible = type => {
    if(!getRealNamePassed()) return;
    this.setState({
      [type]: !this.state[type],
    })

    g_setLocalStorage(!this.state[type], type)
  }

  handlePayVisible = payType => {
    if(!getRealNamePassed()) return;
    this.setState({
      payType,
      payVisible: !this.state.payVisible,
      walletType: 1,
    })
  }

  handleWithdrawApplyVisible = withdrawApplyType => {
    if(!getRealNamePassed()) return;
    this.setState({
      withdrawApplyType, 
      withdrawApplyVisible: !this.state.withdrawApplyVisible,
      walletType: 1,
    })
    clearInterval(this.interval);
  }

  handleClipBoard = address => {
    if(copy(address)){
      message.success('复制成功') 
    }else{
      message.error('复制失败，请重试') 
    }
  }

  checkUserAuth = () => {
    const { dispatch } = this.props;
    if(!getRealNamePassed()) {
      dispatch(routerRedux.push('/account'));
    }
  }

  clickDownLoad = () => {
    var Qr = document.getElementById('qrid');  
    let image = new Image();
    image.src = Qr.toDataURL("image/png");
    var a_link = document.getElementById('aId');
    a_link.href = image.src;
    a_link.download = "二维码.png";
  }

  handleWithdrawApplyAddress = e => {
    this.setState({
      withdrawApplyAddress: e.target.value,
    })
  }

  handleWithdrawApplyNumber = e => {
    this.setState({
      withdrawApplyValue: e.target.value,
    })
  }

  handleWithdrawApplyAll = withdrawApplyBalance => {
    this.setState({
      withdrawApplyValue: withdrawApplyBalance,
    })
  }

  handleWithdrawApplyCaptcha = e => {
    this.setState({
      withdrawApplyCaptcha: e.target.value,
    })
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'home/getCode',
    }).then(data => {
      if(data.status != 1) {
        message.error('短信验证码发送失败，请重试！');
        return;
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

  handleWithdrawApply = maxCoin => {
    const { dispatch, currentUser } = this.props;
    const { withdrawApplyType, withdrawApplyValue, withdrawApplyAddress, withdrawApplyCaptcha, walletType } = this.state;

    if(!withdrawApplyValue || withdrawApplyValue == 0 || !withdrawApplyAddress || !withdrawApplyCaptcha){
      message.error('请填写完整信息后提交');
      return;
    }

    if(withdrawApplyValue <= 0) {
      message.error('金额不能小于0');
      return;
    }

    const x = new BigNumber(withdrawApplyValue);
    const y = new BigNumber(currentUser.gas);
    if(x.plus(y).toNumber() > maxCoin) {
      message.error('超过最大金额');
      return;
    }

    this.setState({
      withdrawApplyStatus: true,
    })

    let url = withdrawApplyType == 'erc20' ? 'home/withdrawApplyErc20' : 'home/withdrawApplyOmni';

    dispatch({
      type: url,
      payload: {
        coin_number: withdrawApplyValue,
        to_address: withdrawApplyAddress,
        telephone_verify_code: withdrawApplyCaptcha,
        token_id: walletType,
      }
    }).then(data => {

      this.setState({
        withdrawApplyStatus: false,
      })

      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'user/getUserInfo',
      });
    })
  }

  changeWallet = (walletType) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/changeWalletInfo',
      payload: {
        walletType: Number(walletType) - 1,
      }
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        walletType
      })
    })
  }

  changeWallet1 = (walletType) => {
    this.setState({
      walletType
    })
  }

  render() {
    const { tokenBalance1, tokenBalance2, tokenBalance3, tokenBalance4, payVisible, withdrawApplyVisible, withdrawApplyValue, withdrawApplyType, withdrawApplyCaptcha, withdrawApplyAddress, count, walletType, payType, withdrawApplyStatus } = this.state;
    const { currentUser, home, loading } = this.props;
    //const payLayerAddress = currentUser.id ? (payType == 'erc20' ? currentUser.erc20.address : currentUser.omni.address) : null;
    //const withdrawApplyBalance = currentUser.id ? (withdrawApplyType == 'erc20' ? currentUser.erc20.balance : currentUser.omni.balance) : null;
    const payLayerAddress = currentUser.id ? (walletType == '1' ? currentUser.erc20.address : currentUser.omni.address) : null;
    const allBalance = currentUser.id ? new BigNumber(wei2USDT(currentUser.erc20.balance)).plus(new BigNumber(wei2USDT(currentUser.omni.balance, 'omni'))).toNumber() : 0;
    const allLockBalance = currentUser.id ? new BigNumber(wei2USDT(currentUser.erc20.lock_balance)).plus(new BigNumber(wei2USDT(currentUser.omni.lock_balance, 'omni'))).toNumber() : 0;

    return (
      <GridContent>
        <Fragment>
          <div className={styles.wrap}>
            <Row
              gutter={24}
              type="flex"
            >
              <Col xl={5} md={24} sm={24} xs={24}>
                <div className={`${styles.layoutLeft} ${styles.userInfo}`}>
                  <div className={styles.avatar}><img src={ currentUser.logo_path || DEFAULTAVATAR } /></div>
                  <div className={styles.user}>
                    { currentUser.user_name || <Link to="/account">设置名称</Link> }<br/>
                    {/*<div style={{margin: '5px 0'}}>
                      <label style={{fontSize: 16}}>USDT币种：</label>
                      <Select value={walletType || "1"} onChange={this.changeWallet}>
                        {
                          Object.keys(coinType).map((value, index) => {
                            if(index != 0){
                              return <Option value={value} key={value}>{coinType[value]}</Option>
                            }
                          })
                        }
                      </Select>
                    </div>*/}
                    <span style={{fontSize: 12}}>{ currentUser.telephone_number }</span>
                  </div>
                  <div className={styles.bottom}>
                    <div className={styles.button}><Link to="/account">账户管理</Link></div>
                    <div className={styles.time}>上次登录：{ moment(currentUser.login_date).local().format('YYYY-MM-DD HH:mm:ss') }</div>
                  </div>
                </div>
              </Col>
              <Col xl={19} md={24} sm={24} xs={24}>
                <div className={`${styles.layoutRight} ${styles.messageWrap}`}>
                  {
                    currentUser.real_name_passed ?
                    <Row
                      className={`${styles.message1} ${styles.passed}`}
                      type="flex"
                      justify="space-between"
                    >
                      <Col>
                        您已通过支付链商家认证
                      </Col>
                    </Row>
                    :
                    <Row
                      className={styles.message1}
                      type="flex"
                      justify="space-between"
                    >
                      <Col>
                        您尚未通过支付链商家认证，<Link to="/account">去认证></Link>
                      </Col>
                      {/*<Col>
                        <Link to="/message" style={{color: '#2194FF'}}>了解详情</Link>
                      </Col>*/}
                    </Row>
                  }
                  <div className={styles.message2}>
                    <Carousel
                      style={{
                        width: '100%',
                        height: 205,
                        overflow: 'hidden',
                      }}
                      autoplay={true}
                    >
                      <img src={banner1} width="100%" height="205" />
                    </Carousel>
                  </div>
                  <div className={styles.message3}>
                    <Row
                      style={{
                        height: 56,
                        lineHeight: '56px',
                        borderBottom: '1px solid #ECECEC',
                        padding: '0 20px 0 30px',
                      }}
                      type="flex"
                      justify="space-between"
                    >
                      <Col style={{fontSize: 16}}>
                        <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: '#DDDDDD', marginRight: 20, verticalAlign: 'middle'}}></span><span style={{color: '#CF0000'}}>[重要通知]</span> 
                        {
                          currentUser.real_name_passed ?
                          ` 您提交的支付链商家认证，已通过审核`
                          :
                          ` 您提交的支付链商家认证，后台正在审核中`
                        }
                      </Col>
                      {/*<Col>
                        <Link to="/message" style={{color: '#2194FF', fontSize: 16}}>查看更多</Link>
                      </Col>*/}
                    </Row>
                    <Row
                      type="flex"
                    >
                      <Col xl={12} md={12} sm={24} xs={24}>
                        <div className={styles.itemBox}>
                          <div className={styles.title}>USDT代币余额</div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>可用余额（USDT）</span>
                            {tokenBalance1 ? 
                              <span style={{display: 'inline-block', minWidth: 50,color: '#2194FF', textAlign: 'center'}}>{ allBalance }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, color: '#333333', textAlign: 'center'}}>****</span>
                            }
                            <span style={{padding: '0 5px'}}>≈</span>
                            {tokenBalance1 ? 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>{ (allBalance * currentUser.token_price * currentUser.rate).toFixed(2) }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>****</span>
                            }
                            CNY
                            <span style={{cursor: 'pointer', marginLeft: 5}} onClick={() => this.eyeVisible('tokenBalance1')}>{tokenBalance1 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>不可用余额（USDT）</span>
                            {tokenBalance2 ? 
                              <span style={{display: 'inline-block', minWidth: 50,color: '#2194FF', textAlign: 'center'}}>{ allLockBalance }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, color: '#333333', textAlign: 'center'}}>****</span>
                            }
                            <span style={{padding: '0 5px'}}>≈</span>
                            {tokenBalance2 ? 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>{ (allLockBalance * currentUser.token_price * currentUser.rate).toFixed(2) }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>****</span>
                            }
                            CNY
                            <span style={{cursor: 'pointer', marginLeft: 5}} onClick={() => this.eyeVisible('tokenBalance2')}>{tokenBalance2 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.but}>
                            <a onClick={() => this.handlePayVisible('erc20')}>充值</a>
                            <a onClick={() => this.handleWithdrawApplyVisible('erc20')}>提币</a>
                            <Link to="/yield/yieldErc20">出金</Link>
                            <Link to="/entry/entryErc20">入金</Link>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {/*<Row
                      type="flex"
                    >
                      <Col xl={12} md={12} sm={24} xs={24}>
                        <div className={styles.itemBox} style={{borderRight: '1px solid #ECECEC'}}>
                          <div className={styles.title}>USDT(erc20)代币余额</div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>可用余额（USDT）</span>
                            {tokenBalance1 ? 
                              <span style={{display: 'inline-block', minWidth: 50,color: '#2194FF', textAlign: 'center'}}>{ currentUser.erc20.balance }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, color: '#333333', textAlign: 'center'}}>****</span>
                            }
                            <span style={{padding: '0 5px'}}>≈</span>
                            {tokenBalance1 ? 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>{ currentUser.erc20.balance * currentUser.token_price * currentUser.rate }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>****</span>
                            }
                            CNY
                            <span style={{cursor: 'pointer', marginLeft: 5}} onClick={() => this.eyeVisible('tokenBalance1')}>{tokenBalance1 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>不可用余额（USDT）</span>
                            {tokenBalance2 ? 
                              <span style={{display: 'inline-block', minWidth: 50,color: '#2194FF', textAlign: 'center'}}>{ currentUser.erc20.lock_balance }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, color: '#333333', textAlign: 'center'}}>****</span>
                            }
                            <span style={{padding: '0 5px'}}>≈</span>
                            {tokenBalance2 ? 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>{ currentUser.erc20.lock_balance * currentUser.token_price * currentUser.rate }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>****</span>
                            }
                            CNY
                            <span style={{cursor: 'pointer', marginLeft: 5}} onClick={() => this.eyeVisible('tokenBalance2')}>{tokenBalance2 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.but}>
                            <a onClick={() => this.handlePayVisible('erc20')}>充值</a>
                            <a onClick={() => this.handleWithdrawApplyVisible('erc20')}>提币</a>
                            <Link to="/yield/yieldErc20">出金</Link>
                            <Link to="/entry/entryErc20">入金</Link>
                          </div>
                        </div>
                      </Col>
                      <Col xl={12} md={12} sm={24} xs={24}>
                        <div className={styles.itemBox} style={{borderRight: '1px solid #ECECEC'}}>
                          <div className={styles.title}>USDT(omni)代币余额</div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>可用余额（USDT）</span>
                            {tokenBalance3 ? 
                              <span style={{display: 'inline-block', minWidth: 50,color: '#2194FF', textAlign: 'center'}}>{ currentUser.omni.balance }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, color: '#333333', textAlign: 'center'}}>****</span>
                            }
                            <span style={{padding: '0 5px'}}>≈</span>
                            {tokenBalance3 ? 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>{ currentUser.omni.balance * currentUser.token_price * currentUser.rate }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>****</span>
                            }
                            CNY
                            <span style={{cursor: 'pointer', marginLeft: 5}} onClick={() => this.eyeVisible('tokenBalance3')}>{tokenBalance3 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>不可用余额（USDT）</span>
                            {tokenBalance4 ? 
                              <span style={{display: 'inline-block', minWidth: 50,color: '#2194FF', textAlign: 'center'}}>{ currentUser.omni.lock_balance }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, color: '#333333', textAlign: 'center'}}>****</span>
                            }
                            <span style={{padding: '0 5px'}}>≈</span>
                            {tokenBalance4 ? 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>{ currentUser.omni.lock_balance * currentUser.token_price * currentUser.rate }</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 50, textAlign: 'center'}}>****</span>
                            }
                            CNY
                            <span style={{cursor: 'pointer', marginLeft: 5}} onClick={() => this.eyeVisible('tokenBalance4')}>{tokenBalance4 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.but}>
                            <a onClick={() => this.handlePayVisible('omni')}>充值</a>
                            <a onClick={() => this.handleWithdrawApplyVisible('omni')}>提币</a>
                            <Link to="/yield/yieldOmni">出金</Link>
                            <Link to="/entry/entryOmni">入金</Link>
                          </div>
                        </div>
                      </Col>
                    </Row>*/}
                  </div>
                </div>
              </Col>
            </Row>
            <div style={{height: 10}}></div>
            <Row
              gutter={24}
              type="flex"
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={5} md={24} sm={24} xs={24}>
                <div className={`${styles.layoutLeft} ${styles.otherWrap}`}>
                  <div className={styles.title}>说明文档</div>
                  <div className={styles.item}>
                    <Button type="primary" style={{width: '100%'}} download target="_blank" href={apiDoc}>接口文档</Button>
                    {/*<Button type="primary" style={{width: '100%', marginTop: 30}} download target="_blank" href="">小额贷款API接口</Button>
                    <Button type="primary" style={{width: '100%', marginTop: 30}} download target="_blank" href="">商城版API接口</Button>
                    <Button type="primary" style={{width: '100%', marginTop: 30}} download target="_blank" href="">博彩手游API接口</Button>*/}
                  </div>
                </div>
              </Col>
              <Col xl={19} md={24} sm={24} xs={24}>
                <div className={`${styles.layoutLeft} ${styles.orderWrap}`}>
                  <div className={styles.itemBox} style={{borderBottom: '1px solid #ECECEC'}}>
                    <div className={styles.title}>待处理</div>
                    <Row
                      gutter={24}
                      type="flex"
                      style={{
                        marginTop: 24,
                      }}
                    >
                      <Col xl={8} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>出金待处理</div>
                          <div className={styles.num}>{ home.buy_order_pending }</div>
                          <div className={styles.but}><Link to="/order/goldYieldOrder"><Button type="primary">去处理</Button></Link></div>
                        </div>
                      </Col>
                      <Col xl={8} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>出金申诉待处理</div>
                          <div className={styles.num}>{ home.buy_complaint_order_pending }</div>
                          <div className={styles.but}><Link to="/dissentOrder/goldYieldOrder"><Button type="primary">去处理</Button></Link></div>
                        </div>
                      </Col>
                      <Col xl={8} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>入金申诉待处理</div>
                          <div className={styles.num}>{ home.sell_complaint_order_pending }</div>
                          <div className={styles.but}><Link to="/dissentOrder/goldEntryOrder"><Button type="primary">去处理</Button></Link></div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className={styles.itemBox}>
                    <div className={styles.title}>交易数据</div>
                    <Row
                      gutter={24}
                      type="flex"
                      style={{
                        marginTop: 24,
                      }}
                    >
                      <Col xl={4} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>总出金（USDT）</div>
                          <div className={styles.num}>{ home.total_gold_yield }</div>
                        </div>
                      </Col>
                      <Col xl={4} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>总入金（USDT）</div>
                          <div className={styles.num}>{ home.total_deposit }</div>
                        </div>
                      </Col>
                      <Col xl={4} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>总提币（USDT）</div>
                          <div className={styles.num}>{ wei2USDT(home.total_cash_out) }</div>
                        </div>
                      </Col>
                      <Col xl={4} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>今日出金（USDT）</div>
                          <div className={styles.num}>{ home.today_gold_yield }</div>
                        </div>
                      </Col>
                      <Col xl={4} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>今日入金（USDT）</div>
                          <div className={styles.num}>{ home.today_deposit }</div>
                        </div>
                      </Col>
                      <Col xl={4} md={8} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>今日提币（USDT）</div>
                          <div className={styles.num}>{ wei2USDT(home.today_cash_out) }</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Fragment>
        { payVisible && 
          <Layer 
            title={`充值`}
            hiddenVisible={this.handlePayVisible}
          >
            <div className={styles.payLayout}>
              <div style={{margin: '5px 0'}}>
                <label style={{fontSize: 16}}>USDT币种：</label>
                <Select value={walletType+""} onChange={this.changeWallet1}>
                  {
                    Object.keys(coinType2).map((value, index) => {
                      if(index != 0){
                        return <Option value={value} key={value}>{coinType2[value]}</Option>
                      }
                    })
                  }
                </Select>
              </div>
              {
                payLayerAddress &&
                <div style={{textAlign: 'center'}}>
                  <div className={styles.ewm}>
                    <QRCode id='qrid' value={payLayerAddress} size={220} style={{margin: '0 auto'}} /> 
                  </div>
                  <Button type="primary" style={{width: 130}}>
                    <a download id='aId' onClick={this.clickDownLoad}>保存二维码</a>
                  </Button>
                  <div className={styles.address}>{payLayerAddress}</div>
                  <Button type="primary" style={{width: 130}} onClick={() => this.handleClipBoard(payLayerAddress)}>复制地址</Button>
                </div>
              }
              <div className={styles.desc}>
                温馨提示：<br/>充值USDT需要6个区块确认，请耐心等待。此地址只接受{walletType == 1 ? 'erc20' : 'omni'}协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此地址将无法找回，平台也不承担带来的损失。
              </div>
            </div>
          </Layer>
        }
        { withdrawApplyVisible && 
          <Layer
            title={`提币`}
            hiddenVisible={this.handleWithdrawApplyVisible}
          >
            <div className={styles.withdrawApplyLayout}>
              <div style={{textAlign: 'center'}}>
                <Row>
                  <Col xl={4} md={5} sm={24} xs={24} style={{lineHeight: '32px', fontSize: 16, color: '#666666', marginBottom: 40}}>
                    USDT币种：
                  </Col>
                  <Col xl={14} md={13} sm={24} xs={24} style={{marginRight: 10}}>
                    <Select value={walletType+""} onChange={this.changeWallet1} style={{width: '100%'}}>
                      {
                        Object.keys(coinType2).map((value, index) => {
                          if(index != 0){
                            return <Option value={value} key={value}>{coinType2[value]}</Option>
                          }
                        })
                      }
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Col xl={4} md={5} sm={24} xs={24} style={{lineHeight: '32px', fontSize: 16, color: '#666666', marginBottom: 40}}>
                    提币地址：
                  </Col>
                  <Col xl={14} md={13} sm={24} xs={24} style={{marginRight: 10}}>
                    <Input placeholder="输入提币地址" onChange={this.handleWithdrawApplyAddress} value={withdrawApplyAddress} />
                  </Col>
                </Row>
                <Row>
                  <Col xl={4} md={5} sm={24} xs={24} style={{lineHeight: '32px', fontSize: 16, color: '#666666', marginBottom: 10}}>
                    提币数量：
                  </Col>
                  <Col xl={14} md={13} sm={24} xs={24} style={{marginRight: 10}}>
                    <Input placeholder="输入提币数量" onChange={this.handleWithdrawApplyNumber} value={withdrawApplyValue} />
                  </Col>
                  <Col xl={5} md={5} sm={24} xs={24}>
                    <Button style={{width: 128}} onClick={() => this.handleWithdrawApplyAll(allBalance - allLockBalance)}>全部</Button>
                  </Col>
                </Row>
                <Row style={{marginBottom: 40}}>
                  <Col xl={4} md={5} sm={0} xs={0} style={{lineHeight: '32px', fontSize: 16, color: '#666666'}}></Col>
                  <Col xl={14} md={13} sm={24} xs={24} style={{color: '#333333', textAlign: 'left'}}>
                    <span style={{paddingRight: 10}}>手续费:{ currentUser.gas } USDT</span>
                    <span>可用余额:{ allBalance - allLockBalance } USDT</span>
                  </Col>
                </Row>
                <Row>
                  <Col xl={4} md={5} sm={24} xs={24} style={{lineHeight: '32px', fontSize: 16, color: '#666666'}}>
                    短信验证码：
                  </Col>
                  <Col xl={14} md={13} sm={24} xs={24} style={{marginRight: 10}}>
                    <Input placeholder="输入短信验证码" maxLength={6} onChange={this.handleWithdrawApplyCaptcha} value={withdrawApplyCaptcha} />
                  </Col>
                  <Col xl={5} md={5} sm={24} xs={24}>
                    <Button
                      disabled={!!count}
                      onClick={this.onGetCaptcha}
                      style={{
                        width: 128,
                        display: 'inline-block',
                      }}
                    >
                      {count
                        ? `${count} s`
                        : '获取手机验证码'}
                    </Button>
                  </Col>
                </Row>
              </div>
              <div className={styles.desc}>          
                温馨提示：<br/>
                1.提币所需手续费，手续费为{ currentUser.gas } USDT；<br/>
                2.请务必确保提币地址的正确性，若由于地址填写错误导致资金丢失，不属于平台责任。
              </div>
              <div style={{textAlign: 'center'}}>
                <Button loading={withdrawApplyStatus} type="primary" style={{width: 120}} onClick={() => this.handleWithdrawApply(allBalance - allLockBalance)}>确定</Button>
              </div>
            </div>
          </Layer>
        }
        {
          !getRealNamePassed() &&
          <div className={styles.passedLayer}>用户必须通过实名认证后方可使用平台的功能 <span onClick={this.checkUserAuth} style={{color: '#EA0000', cursor: 'pointer'}}>去认证</span></div>
        }
      </GridContent>
    );
  }
}

export default Home;
