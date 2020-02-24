import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import copy from 'copy-to-clipboard';
import styles from './style.less';

@connect(({ user, coldwalletAcceptList }) => ({
  currentUser: user.currentUser,
  coldwalletAcceptList,
}))
class ColdwalletAcceptList extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coldwalletAcceptList/fetch',
    })
  }

  componentWillUnmount() {
    
  }

  handleClipBoard = val => {
    if(copy(val)){
      message.success('复制成功') 
    }else{
      message.error('复制失败，请重试') 
    }
  }

  render() {
    const { coldwalletAcceptList } = this.props;
    const { phoneCount, submitLoading } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={'erc20钱包'}></Descriptions.Item>
              <Descriptions.Item label={''}>
                <Tooltip title="123123123">
                  <a style={{paddingRight: 10, display: 'inline-block', verticalAlign: 'middle', maxWidth: 200, overflow: 'hidden',whiteSpace: 'nowrap', textOverflow:'ellipsis'}} onClick={() => this.handleClipBoard(123123123)}>213313131313131313</a>
                </Tooltip>
                <span style={{padding: '0 10px', color: '#ea8a00', verticalAlign: 'middle',}}>金额：1321 USDT</span>
                <Button>
                  <Link to={`/super/coldwallet/coldwalletAccept/erc20?address=${123}`}>查账</Link>
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label={'omni钱包'}></Descriptions.Item>
              <Descriptions.Item label={''}>
                <Tooltip title="123123123">
                  <a style={{paddingRight: 10, display: 'inline-block', verticalAlign: 'middle', maxWidth: 200, overflow: 'hidden',whiteSpace: 'nowrap', textOverflow:'ellipsis'}} onClick={() => this.handleClipBoard(123123123)}>213313131313131313</a>
                </Tooltip>
                <span style={{padding: '0 10px', color: '#ea8a00', verticalAlign: 'middle',}}>金额：1321 USDT</span>
                <Button>
                  <Link to={`/super/coldwallet/coldwalletAccept/omni?address=${123}`}>查账</Link>
                </Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default ColdwalletAcceptList;
