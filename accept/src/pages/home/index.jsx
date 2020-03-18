import { Col, Dropdown, Icon, Menu, Row, Button, notification, message, Input, Carousel, Select, Popover, Spin } from 'antd';
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

const { Option } = Select;

@connect(({ user, home, loading }) => ({
  currentUser: user.currentUser,
  home,
  loading: loading.effects['home/fetch'],
  getUserInfoLoading: loading.effects['user/getUserInfo'],
  mortgageLoading: loading.effects['home/mortgage'],
}))
class Home extends Component {
  state = {
    accountBalance1: g_getLocalStorage('accountBalance1') || false,
    tokenBalance1: g_getLocalStorage('tokenBalance1') || false,
    tokenBalance2: g_getLocalStorage('tokenBalance2') || false,
    payVisible: false,
    mortgageVisible: false,
    buyStatus: 'out',
    sellStatus: 'out',
    walletType: 1,
    firstBuyStatus: g_getLocalStorage().buy_online || false,
    firstSellStatus: g_getLocalStorage().sell_online || false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/getUserInfo',
    });

    dispatch({
      type: 'home/fetch',
    });
  }

  componentWillUnmount() {

  }

  eyeVisible = type => {
    if(!getRealNamePassed()) return;
    this.setState({
      [type]: !this.state[type],
    })

    g_setLocalStorage(!this.state[type], type)
  }

  handlePayVisible = () => {
    if(!getRealNamePassed()) return;
    this.setState({
      payVisible: !this.state.payVisible,
    })
  }

  handleMortgageVisible = () => {
    if(!getRealNamePassed()) return;
    this.setState({
      mortgageVisible: !this.state.mortgageVisible,
    })
  }

  toggleManagement = (type, status) => {
    if(!getRealNamePassed()) return;
    const { dispatch } = this.props;
    let url = type == 'buyStatus' ? 'home/buyStatus' : 'home/sellStatus';

    dispatch({
      type: url,
      payload: {
        online_status: status,
      }
    }).then(data => {
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

  handleMortgageNumber = e => {
    this.setState({
      mortgageValue: e.target.value,
    })
  }

  handleMortgageAll = e => {
    const { currentUser } = this.props;
    this.setState({
      mortgageValue: wei2USDT(currentUser.erc20.balance - currentUser.erc20.lock_balance),
    })
  }

  handleMortgage = () => {
    const { dispatch, currentUser } = this.props;
    const { walletType } = this.state;

    if(!Number(this.state.mortgageValue) || this.state.mortgageValue == 0) {
      message.error('请输入金额');
      return;
    }

    if(this.state.mortgageValue > wei2USDT(currentUser.erc20.balance - currentUser.erc20.lock_balance)) {
      message.error('超过最大金额');
      return;
    }

    dispatch({
      type: 'home/mortgage',
      payload: {
        token_id: walletType,
        pledge_amount: this.state.mortgageValue,
      }
    }).then(data => {
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

  firstOnlineLayerClose = () => {
    this.setState({
      firstOnlineLayerStatus: false,
    })
    setCookie('firstOnlineLayer', '1');
  }

  firstOnlineLayerSubmit = () => {
    const { firstBuyStatus, firstSellStatus } = this.state;
    setCookie('firstOnlineLayer', '1');
    this.toggleManagement('buyStatus', firstBuyStatus);
    this.toggleManagement('sellStatus', firstSellStatus);
  }

  firstOnlineLayerChangeStatus = (key, status) => {
    this.setState({
      [key]: status
    })
  }

  firstOnlineLayer = () => {
    const { firstBuyStatus, firstSellStatus } = this.state;
    if(getCookie('firstOnlineLayer')) return;
    return (
      <Layer
        title="承兑管理"
        hiddenVisible={this.firstOnlineLayerClose}
      >
        <div className={styles.mortgageLayout}>
          <Row
            gutter={24}
            type="flex"
          >
            <Col xl={24}>
              <div className={`${styles.layoutLeft} ${styles.otherWrap}`} style={{padding: 0, height: 'auto'}}>
                <div className={styles.item}>
                  当前购买状态
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Button type={firstBuyStatus ? 'primary' : ''} onClick={() => this.firstOnlineLayerChangeStatus('firstBuyStatus', true)}>上线</Button>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Button type={!firstBuyStatus ? 'primary' : ''} onClick={() => this.firstOnlineLayerChangeStatus('firstBuyStatus', false)}>下线</Button>
                </div>
                <div className={styles.item}>
                  当前出售状态
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Button type={firstSellStatus ? 'primary' : ''} onClick={() => this.firstOnlineLayerChangeStatus('firstSellStatus', true)}>上线</Button>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Button type={!firstSellStatus ? 'primary' : ''} onClick={() => this.firstOnlineLayerChangeStatus('firstSellStatus', false)}>下线</Button>
                </div>
              </div>
              <div className={styles.desc} style={{margin: '10px 0'}}>
                温馨提示：<br/>
                请确认设置<Link to="/finance/settings">收款方式</Link>并且准备充足资金后上线，否则订单失败将有降低信用的惩罚
              </div>
              <div style={{textAlign: 'center'}}>
                <Button type="primary" style={{width: 120}} onClick={this.firstOnlineLayerSubmit}>确定设置</Button>
                <span style={{display: 'inline-block', width: '10px'}}></span>
                <Button style={{width: 120}} onClick={this.firstOnlineLayerClose}>稍后设置</Button>
              </div>
            </Col>
          </Row>
        </div>
      </Layer>
    );
  }

  getTxInfo = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'home/fetch',
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('刷新成功');
      }
    })
  }

  getHeaderMessage = () => {
    const { currentUser } = this.props;
    if(!currentUser.real_name_passed) {
      return (
        <Row
          className={styles.message1}
          type="flex"
          justify="space-between"
        >
          <Col>
            您尚未通过支付链商家认证，<Link to="/account">去认证></Link>
          </Col>
        </Row>
      )
    }else if(!currentUser.trade_permission) {
      return (
        <Row
          className={styles.message1}
          type="flex"
          justify="space-between"
        >
          <Col>
            当前账号因为在异议订单中有一方申请客服介入，现已被冻结，请及时联系管理员：{`${currentUser.parent_name} ${currentUser.manager_telephone_number}`}
          </Col>
        </Row>
      )
    }else if(currentUser.real_name_passed) {
      return (
        <Row
          className={`${styles.message1} ${styles.passed}`}
          type="flex"
          justify="space-between"
        >
          <Col>
            您已通过支付链商家认证，<Link to="/finance/settings">设置收款方式></Link>
          </Col>
        </Row>
      )
    }
  }

  render() {
    const { accountBalance1, tokenBalance1, tokenBalance2, payVisible, mortgageVisible, buyStatus, sellStatus, mortgageValue, walletType } = this.state;
    const { currentUser, home, loading, getUserInfoLoading, mortgageLoading } = this.props;
    const payLayerAddress = currentUser.id ? (walletType == '1' ? currentUser.erc20.address : currentUser.omni.address) : null;
    const allBalance = currentUser.id ? new BigNumber(wei2USDT(currentUser.erc20.balance)).plus(new BigNumber(wei2USDT(currentUser.omni.balance, 'omni'))).toNumber() : 0;
    const allLockBalance = currentUser.id ? new BigNumber(wei2USDT(currentUser.erc20.lock_balance)).plus(new BigNumber(wei2USDT(currentUser.omni.lock_balance, 'omni'))).toNumber() : 0;
    const confirmations = currentUser.id ? (walletType == '1' ? currentUser.erc20.confirmations : currentUser.omni.confirmations) : null;

    return (
      <Spin spinning={!!getUserInfoLoading}>
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
                      { currentUser.user_name || <Link to="/account">设置名称</Link> } | <span style={{color: '#2194FF'}}>{ new BigNumber(currentUser.success_order_percent || 0).multipliedBy(100).toNumber() }%</span><br/>
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
                    <ul className={styles.priceList}>
                      <li>火币购买汇率(USDT:CNY)：<br/>1:{home.buy_price}</li>
                      <li style={{color: '#cf0000'}}>平台购买汇率(USDT:CNY)：<br/>1:{home.platform_buy_price}</li>
                      <li>火币出售汇率(USDT:CNY)：<br/>1:{home.sell_price}</li>
                      <li style={{color: '#cf0000'}}>平台出售汇率(USDT:CNY)：<br/>1:{home.platform_sell_price}</li>
                    </ul>
                    <div className={styles.bottom}>
                      <div className={styles.button}><Link to="/account">账户管理</Link></div>
                      <div className={styles.time}>上次登录：{ moment(currentUser.login_date).local().format('YYYY-MM-DD HH:mm:ss') }</div>
                    </div>
                  </div>
                </Col>
                <Col xl={19} md={24} sm={24} xs={24}>
                  <div className={`${styles.layoutRight} ${styles.messageWrap}`}>
                    { this.getHeaderMessage() }
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
                            <div className={styles.title}>代币余额</div>
                            <div className={styles.item}>
                              <span style={{display: 'inline-block', width: 160}}>可用余额（USDT）</span>
                              {tokenBalance1 ? 
                                <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>{ new BigNumber(allBalance)
                          .minus(new BigNumber(allLockBalance))
                          .toNumber() }</span>
                                : 
                                <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                              }
                              <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('tokenBalance1')}>{tokenBalance1 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                            </div>
                            <div className={styles.item}>
                              <span style={{display: 'inline-block', width: 160}}>冻结余额（USDT）</span>
                              {tokenBalance2 ? 
                                <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>{ allLockBalance }</span>
                                : 
                                <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                              }
                              <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('tokenBalance2')}>{tokenBalance2 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                            </div>
                            <div className={styles.but}>
                              <a onClick={this.handlePayVisible}>充值</a>
                              <Link to="/finance/withdrawApply">提币</Link>
                            </div>
                          </div>
                        </Col>
                        <Col xl={12} md={12} sm={24} xs={24}>
                          <div className={`${styles.itemBox} ${styles.itemBoxBg2}`} style={{borderLeft: '1px solid #ECECEC'}}>
                            <div className={styles.title}>抵押资金</div>
                            <div className={styles.item}>
                              <span style={{display: 'inline-block', width: 160}}>我的排名</span>
                              <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>{ currentUser.rank }</span>
                              <span style={{cursor: 'pointer', color: '#49a1ff'}}>
                                <Popover content={<div>缴纳更多押金，可提升排名</div>}>
                                  <Icon type="exclamation-circle" />
                                </Popover>
                              </span> 
                            </div>
                            <div className={styles.item}>
                              <span style={{display: 'inline-block', width: 160}}>抵押资金（USDT）</span>
                              {accountBalance1 ? 
                                <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>{ currentUser.pledge_amount }</span>
                                : 
                                <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                              }
                              <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('accountBalance1')}>{accountBalance1 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                            </div>
                            <div className={styles.item}>
                              <span style={{display: 'inline-block', width: 160}}>信用评分</span>
                              <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>{ currentUser.credit }</span>
                              <span style={{cursor: 'pointer', color: '#49a1ff'}}>
                                <Popover content={<div>增加抵押资金可提高信用评分</div>}>
                                  <Icon type="exclamation-circle" />
                                </Popover>
                              </span> 
                            </div>
                            <div className={styles.but}>
                              <a onClick={this.handleMortgageVisible}>抵押</a>
                              <Link to="/finance/depositList">申请解冻</Link>
                            </div>
                          </div>
                        </Col>
                      </Row>
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
                    <div className={styles.title}>承兑管理</div>
                    <div className={styles.item}>
                      <p>购买</p>
                      <div className={styles.but}>
                        <Button type={currentUser.buy_online ? 'primary' : ''} style={{width: '47%', marginRight: '3%'}} onClick={() => this.toggleManagement('buyStatus', true)}>上线</Button>
                        <Button type={!currentUser.buy_online ? 'primary' : ''} style={{width: '47%'}} onClick={() => this.toggleManagement('buyStatus', false)}>下线</Button>
                      </div>
                    </div>
                    <div className={styles.item}>
                      <p>出售</p>
                      <div className={styles.but}>
                        <Button type={currentUser.sell_online ? 'primary' : ''} style={{width: '47%', marginRight: '3%'}} onClick={() => this.toggleManagement('sellStatus', true)}>上线</Button>
                        <Button type={!currentUser.sell_online ? 'primary' : ''} style={{width: '47%'}} onClick={() => this.toggleManagement('sellStatus', false)}>下线</Button>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xl={19} md={24} sm={24} xs={24}>
                  <div className={`${styles.layoutLeft} ${styles.orderWrap}`}>
                    <div className={styles.itemBox} style={{borderBottom: '1px solid #ECECEC'}}>
                      <div className={styles.title}>
                        待处理
                        <span style={{fontSize: 15, fontWeight: 600, padding: '0 15px', color: '#1890ff'}}>出售交易槽：{ `${home.sell_accept_slot_current} / ${home.sell_accept_slot_max}` }</span>
                        <span style={{fontSize: 15, fontWeight: 600, padding: '0 15px', color: '#1890ff'}}>购买交易槽：{ `${home.buy_accept_slot_current} / ${home.buy_accept_slot_max}` }</span>
                        <Button loading={loading} onClick={this.getTxInfo}>刷新交易槽</Button>
                      </div>
                      <Row
                        gutter={24}
                        type="flex"
                        style={{
                          marginTop: 24,
                        }}
                      >
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>出售订单待处理</div>
                            <div className={styles.num}>{ home.sell_order_pending }</div>
                            <div className={styles.but}><Link to="/order/sellOrder"><Button type="primary">去处理</Button></Link></div>
                          </div>
                        </Col>
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>购买订单待处理</div>
                            <div className={styles.num}>{ home.buy_order_pending }</div>
                            <div className={styles.but}><Link to="/order/buyOrder"><Button type="primary">去处理</Button></Link></div>
                          </div>
                        </Col>
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>出售异议待处理</div>
                            <div className={styles.num}>{ home.sell_complaint_order_pending }</div>
                            <div className={styles.but}><Link to="/dissentOrder/sellOrder"><Button type="primary">去处理</Button></Link></div>
                          </div>
                        </Col>
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>购买异议待处理</div>
                            <div className={styles.num}>{ home.buy_complaint_order_pending }</div>
                            <div className={styles.but}><Link to="/dissentOrder/buyOrder"><Button type="primary">去处理</Button></Link></div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.itemBox}>
                      <div className={styles.title}>收益</div>
                      <Row
                        gutter={24}
                        type="flex"
                        style={{
                          marginTop: 24,
                        }}
                      >
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>总收益（USDT）</div>
                            <div className={styles.num}>{
                              getDecimal(home.total_earnings, 4)
                            }</div>
                          </div>
                        </Col>
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>总成单量（笔）</div>
                            <div className={styles.num}>{ home.total_success_order }</div>
                          </div>
                        </Col>
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>今日收益（USDT）</div>
                            <div className={styles.num}>{
                              getDecimal(home.today_earnings, 4)
                            }</div>
                          </div>
                        </Col>
                        <Col xl={6} md={6} sm={12} xs={12}>
                          <div className={styles.item}>
                            <div className={styles.name}>今日成单量（笔）</div>
                            <div className={styles.num}>{ home.today_success_order }</div>
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
              title="充值"
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
                    <Button
                      type="link"
                    >
                      <Link to="/finance/withdrawList">提币/充币查询</Link>
                    </Button>
                  </div>
                }
                <div className={styles.desc}>
                  温馨提示：<br/>充值USDT需要{ confirmations }个区块确认，请耐心等待。此地址只接受{walletType == 1 ? 'erc20' : 'omni'}协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此地址将无法找回，平台也不承担带来的损失。
                </div>
              </div>
            </Layer>
          }
          { mortgageVisible && 
            <Layer
              title="抵押"
              hiddenVisible={this.handleMortgageVisible}
            >
              <div className={styles.mortgageLayout}>
                <div style={{textAlign: 'center'}}>
                  <Row>
                    <Col xl={4} md={5} sm={24} xs={24} style={{lineHeight: '32px', fontSize: 16, color: '#666666'}}>
                      抵押金额：
                    </Col>
                    <Col xl={14} md={13} sm={24} xs={24} style={{marginRight: 10}}>
                      <Input placeholder="请输入抵押金额" onChange={this.handleMortgageNumber} value={mortgageValue} />
                    </Col>
                    <Col xl={5} md={5} sm={24} xs={24}>
                      <Button style={{width: 128}} onClick={this.handleMortgageAll}>全部抵押</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={4} md={5} sm={0} xs={0} style={{lineHeight: '32px', fontSize: 16, color: '#666666'}}></Col>
                    <Col xl={14} md={13} sm={24} xs={24} style={{color: '#333333', textAlign: 'left'}}>
                      可用余额:{ wei2USDT(currentUser.erc20.balance - currentUser.erc20.lock_balance) } USDT
                    </Col>
                  </Row>
                </div>
                <div className={styles.desc}>
                  温馨提示：<br/>
                  1.充值USDT需要{ currentUser.erc20.confirmations }个区块确认，请耐心等待。 此地址 只接受erc20协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此<br/>
                  2.地址将无法找回，平台也不承担带来的损失。充值USDT需要6个区块确认，请耐心等待。 此地址 只接受erc20协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此地址将无法找回，平台也不承担带来的损失。
                </div>
                <div style={{textAlign: 'center'}}>
                  <Button loading={mortgageLoading} type="primary" style={{width: 120}} onClick={this.handleMortgage}>确定抵押</Button>
                </div>
              </div>
            </Layer>
          }
          {
            getRealNamePassed() &&
            this.firstOnlineLayer()
          }
          {
            !getRealNamePassed() &&
            <div className={styles.passedLayer}>用户必须通过实名认证后方可使用平台的功能 <span onClick={this.checkUserAuth} style={{color: '#EA0000', cursor: 'pointer'}}>去认证</span></div>
          }
        </GridContent>
      </Spin>
    );
  }
}

export default Home;
