import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import QRCode from 'qrcode.react';
import styles from './style.less';

const { Option } = Select;

@connect(({ user, centerWalletPay }) => ({
  currentUser: user.currentUser,
  centerWalletPay,
}))
class CenterWalletPay extends Component {
  state = {
    walletType: 1
  };

  componentDidMount() {

  }

  componentWillUnmount() {
    
  }

  clickDownLoad = () => {
    var Qr = document.getElementById('qrid');
    let image = new Image();
    image.src = Qr.toDataURL('image/png');
    var a_link = document.getElementById('aId');
    a_link.href = image.src;
    a_link.download = '二维码.png';
  };

  changeWallet = walletType => {
    this.setState({
      walletType,
    });
  };

  render() {
    const { centerWalletPay, currentUser } = this.props;
    const {
      walletType,
    } = this.state;
    const payLayerAddress = currentUser.id
      ? walletType == '1'
        ? currentUser.erc20.address
        : currentUser.omni.address
      : null;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <div style={{ margin: '5px 0' }}>
              <label style={{ fontSize: 16 }}>USDT币种：</label>
              <Select value={walletType + ''} style={{ width: 150 }} onChange={this.changeWallet}>
                {Object.keys(coinType2).map((value, index) => {
                  if (index != 0) {
                    return (
                      <Option value={value} key={value}>
                        {coinType2[value]}
                      </Option>
                    );
                  }
                })}
              </Select>
            </div>
            <div className={styles.payLayout}>
              <div className={styles.ewm}>
                {
                  payLayerAddress &&
                  <QRCode
                    id="qrid"
                    value={ payLayerAddress }
                    size={220}
                    style={{ margin: '0 auto' }}
                  />
                }
              </div>
              <Button type="primary" style={{ width: 130 }}>
                <a download id="aId" onClick={this.clickDownLoad}>
                  保存二维码
                </a>
              </Button>
              <div className={styles.address}>{ payLayerAddress }</div>
              <Button
                type="primary"
                style={{ width: 130 }}
                onClick={() => this.handleClipBoard(payLayerAddress)}
              >
                复制地址
              </Button>
            </div>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default CenterWalletPay;
