import { Col, Dropdown, Icon, Menu, Row, Button, notification, message, Input } from 'antd';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { GridContent } from '@ant-design/pro-layout';
import { connect, routerRedux } from 'dva';
import Layer from './components/pay';
import copy from 'copy-to-clipboard';
import styles from './style.less';
import banner1 from '@/assets/img_home_banner.png';
import ewm from '@/assets/icon_qianbi.png';

@connect(({ user, home, loading }) => ({
  currentUser: user.currentUser,
  home,
  loading: loading.effects['home/fetch'],
}))

class Home extends Component {
  state = {
    accountBalance1: true,
    accountBalance2: true,
    tokenBalance1: true,
    tokenBalance2: true,
    payVisible: false,
    mortgageVisible: false,
    buyStatus: 'on',
    sellStatus: 'on',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetch',
    });
  }

  componentWillUnmount() {

  }

  eyeVisible = type => {
    this.setState({
      [type]: !this.state[type],
    })
  }

  handlePayVisible = () => {
    this.checkUserAuth();
    this.setState({
      payVisible: !this.state.payVisible,
    })
  }

  handleMortgageVisible = () => {
    this.checkUserAuth();
    this.setState({
      mortgageVisible: !this.state.mortgageVisible,
    })
  }

  toggleManagement = (type, status) => {
    this.setState({
      [type]: status
    })
  }

  handleClipBoard = () => {
    if(copy(`sahidhioafsf4563ahdj13265ans`)){
      message.success('复制成功') 
    }else{
      message.error('复制失败，请重试') 
    }
  }

  checkUserAuth = () => {
    const { currentUser } = this.props;
    const { dispatch } = this.props;
    if(!currentUser.auth) {
      dispatch(routerRedux.push('/account'));
    }
  }

  render() {
    const { accountBalance1, accountBalance2, tokenBalance1, tokenBalance2, payVisible, mortgageVisible, buyStatus, sellStatus } = this.state;
    const { currentUser, home, loading } = this.props;
    const {  } = home;

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
                  <div className={styles.avatar}><img src={ currentUser.avatar } /></div>
                  <div className={styles.user}>
                    承兑商名称 | <span style={{color: '#2194FF'}}>94%</span><br/>
                    <span style={{fontSize: 12}}>18977777777</span>
                  </div>
                  <div className={styles.bottom}>
                    <div className={styles.button}><Link to="/account">账户管理</Link></div>
                    <div className={styles.time}>上次登录：2019-11-11 05:22:33</div>
                  </div>
                </div>
              </Col>
              <Col xl={19} md={24} sm={24} xs={24}>
                <div className={`${styles.layoutRight} ${styles.messageWrap}`}>
                  <Row
                    className={styles.message1}
                    type="flex"
                    justify="space-between"
                  >
                    <Col>
                      您尚未通过支付链商家认证，<Link to="/account">去认证></Link>
                    </Col>
                    <Col>
                      <Link to="/" style={{color: '#2194FF'}}>了解详情</Link>
                    </Col>
                  </Row>
                  <div className={styles.message2} style={{height: 205}}>
                    <img src={banner1} />
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
                        <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: '#DDDDDD', marginRight: 20, verticalAlign: 'middle'}}></span><span style={{color: '#CF0000'}}>[重要通知]</span> 您提交的支付链商家认证，后台正在审核中
                      </Col>
                      <Col>
                        <Link to="/" style={{color: '#2194FF', fontSize: 16}}>查看更多</Link>
                      </Col>
                    </Row>
                    <Row
                      type="flex"
                    >
                      <Col xl={8} md={8} sm={24} xs={24}>
                        <div className={styles.itemBox} style={{borderRight: '1px solid #ECECEC'}}>
                          <div className={styles.title}>账户余额</div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>可用余额（元）</span>
                            {accountBalance1 ? 
                              <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>0.00</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                            }
                            <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('accountBalance1')}>{accountBalance1 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>不可用余额（元）</span>
                            {accountBalance2 ? 
                              <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>0.00</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                            }
                            <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('accountBalance2')}>{accountBalance2 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.but}>
                            <a onClick={this.handlePayVisible}>充值</a>
                            <a>提现</a>
                            <a>转账</a>
                          </div>
                        </div>
                      </Col>
                      <Col xl={8} md={8} sm={24} xs={24}>
                        <div className={styles.itemBox} style={{borderRight: '1px solid #ECECEC'}}>
                          <div className={styles.title}>代币余额</div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>可用余额（USDT）</span>
                            {tokenBalance1 ? 
                              <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>0.00</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                            }
                            <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('tokenBalance1')}>{tokenBalance1 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>不可用余额（USDT）</span>
                            {tokenBalance2 ? 
                              <span style={{display: 'inline-block', minWidth: 100,color: '#2194FF'}}>0.00</span>
                              : 
                              <span style={{display: 'inline-block', minWidth: 100, color: '#333333'}}>****</span>
                            }
                            <span style={{cursor: 'pointer'}} onClick={() => this.eyeVisible('tokenBalance2')}>{tokenBalance2 ? <Icon type="eye-invisible" /> : <Icon type="eye" />}</span> 
                          </div>
                          <div className={styles.but}>
                            <a>转入</a>
                            <a>转出</a>
                          </div>
                        </div>
                      </Col>
                      <Col xl={8} md={8} sm={24} xs={24}>
                        <div className={styles.itemBox}>
                          <div className={styles.title}>抵押资金</div>
                          <div className={styles.item}>
                            <span style={{display: 'inline-block', width: 160}}>资金余额（USDT）</span>
                            <span style={{display: 'inline-block', minWidth: 100,color: '#333333'}}>1000.00</span>
                          </div>
                          <div className={styles.but} style={{marginTop: 64}}>
                            <a onClick={this.handleMortgageVisible}>抵押</a>
                            <a>申请解冻</a>
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
                      <Button type={buyStatus == 'on' ? 'primary' : ''} style={{width: '47%', marginRight: '3%'}} onClick={() => this.toggleManagement('buyStatus', 'on')}>上线</Button>
                      <Button type={buyStatus == 'out' ? 'primary' : ''} style={{width: '47%'}} onClick={() => this.toggleManagement('buyStatus', 'out')}>下线</Button>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <p>出售</p>
                    <div className={styles.but}>
                      <Button type={sellStatus == 'on' ? 'primary' : ''} style={{width: '47%', marginRight: '3%'}} onClick={() => this.toggleManagement('sellStatus', 'on')}>上线</Button>
                      <Button type={sellStatus == 'out' ? 'primary' : ''} style={{width: '47%'}} onClick={() => this.toggleManagement('sellStatus', 'out')}>下线</Button>
                    </div>
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
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>出售订单待处理</div>
                          <div className={styles.num}>0</div>
                          <div className={styles.but}><Button type="primary">去处理</Button></div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>购买订单待处理</div>
                          <div className={styles.num}>0</div>
                          <div className={styles.but}><Button type="primary">去处理</Button></div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>出售异议待处理</div>
                          <div className={styles.num}>0</div>
                          <div className={styles.but}><Button type="primary">去处理</Button></div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>出售异议待处理</div>
                          <div className={styles.num}>0</div>
                          <div className={styles.but}><Button type="primary">去处理</Button></div>
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
                          <div className={styles.num}>0.00</div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>总成单量（笔）</div>
                          <div className={styles.num}>0</div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>总收益（USDT）</div>
                          <div className={styles.num}>0.00</div>
                        </div>
                      </Col>
                      <Col xl={6} md={6} sm={12} xs={12}>
                        <div className={styles.item}>
                          <div className={styles.name}>总收益（USDT）</div>
                          <div className={styles.num}>0.00</div>
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
              <div style={{textAlign: 'center'}}>
                <div className={styles.ewm}>
                  <img src={ewm} />
                </div>
                <Button type="primary" style={{width: 130}}>保存二维码</Button>
                <div className={styles.address}>sahidhioafsf4563ahdj13265ans</div>
                <Button type="primary" style={{width: 130}} onClick={this.handleClipBoard}>复制地址</Button>
              </div>
              <div className={styles.desc}>
                温馨提示：<br/>充值USDT需要6个区块确认，请耐心等待。此地址只接受OMNI协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此地址将无法找回，平台也不承担带来的损失。
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
                    <Input placeholder="请输入抵押金额" />
                  </Col>
                  <Col xl={5} md={5} sm={24} xs={24}>
                    <Button style={{width: 128}}>全部抵押</Button>
                  </Col>
                </Row>
                <Row>
                  <Col xl={4} md={5} sm={0} xs={0} style={{lineHeight: '32px', fontSize: 16, color: '#666666'}}></Col>
                  <Col xl={14} md={13} sm={24} xs={24} style={{color: '#333333', textAlign: 'left'}}>
                    可用余额:777856.56 USDT
                  </Col>
                </Row>
              </div>
              <div className={styles.desc}>
                温馨提示：<br/>
                1.充值USDT需要6个区块确认，请耐心等待。 此地址 只接受OMNI协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此<br/>
                2.地址将无法找回，平台也不承担带来的损失。充值USDT需要6个区块确认，请耐心等待。 此地址 只接受OMNI协议的USDT，请勿往地址元值其他协议的USDT发送其他币种到此地址将无法找回，平台也不承担带来的损失。
              </div>
              <div style={{textAlign: 'center'}}>
                <Button type="primary" style={{width: 120}}>确定抵押</Button>
              </div>
            </div>
          </Layer>
        }
      </GridContent>
    );
  }
}

export default Home;
