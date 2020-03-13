import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Tooltip, Form, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import ModulFromColdWallet from '@/components/ModulFromColdWallet';
import styles from './style.less';

@connect(({ coldwalletMerchantList, loading }) => ({
  coldwalletMerchantList,
  loading: loading.effects['coldwalletMerchantList/fetch'],
  loadingErc20: loading.effects['coldwalletMerchantList/modifyErc20'],
  loadingOmni: loading.effects['coldwalletMerchantList/modifyOmni'],
}))
class ColdwalletMerchantList extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coldwalletMerchantList/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'coldwalletMerchantList/getCaptcha',
    })
  }

  modify = (arg, callback) => {
    const { dispatch } = this.props;

    if(!arg.address) {
      message.error('请输入钱包地址');
      return;
    }else if(!arg.telephone_verify_code) {
      message.error('请输入验证码');
      return;
    }

    dispatch({
      type: arg.chain == 'eth' ? 'coldwalletMerchantList/modifyErc20' : 'coldwalletMerchantList/modifyOmni',
      payload: {
        chain: arg.chain,
        telephone_verify_code: arg.telephone_verify_code,
        address1: arg.address,
        address2: null,
      },
    }).then(data => {
      callback();
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      dispatch({
        type: 'coldwalletMerchantList/fetch',
      })
    })
  }

  render() {
    const { coldwalletMerchantList, loading, loadingErc20, loadingOmni } = this.props;
    const { count } = this.state;
    const erc20Wallet = coldwalletMerchantList.wallet ? coldwalletMerchantList.wallet.erc20 : null;
    const omniWallet = coldwalletMerchantList.wallet ? coldwalletMerchantList.wallet.omni : null;

    return (
      <ContLayout loading={loading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <ModulFromColdWallet 
              coldwalletInfo={{
                walletType: 'erc20钱包',
                walletAddress: erc20Wallet,
                chain: 'eth',
                onGetCaptcha: this.onGetCaptcha,
                submit: this.modify,
                loading: loadingErc20,
              }}
            />
            <div style={{height: 50, width: '100%'}}></div>
            <ModulFromColdWallet 
              coldwalletInfo={{
                walletType: 'omni钱包',
                walletAddress: omniWallet,
                chain: 'omni',
                onGetCaptcha: this.onGetCaptcha,
                submit: this.modify,
                loading: loadingOmni,
              }}
            />
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default ColdwalletMerchantList;
