import { Button, Descriptions, Input, Upload, Icon, message, Row, Col, Tooltip, Form, Modal, Divider } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import copy from 'copy-to-clipboard';
import styles from './style.less';

const FormItem = Form.Item;

const CreateModifyForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, params, count, onGetCaptcha } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue, params.chain);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  return (
    <Modal
      title="修改冷钱包"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="旧地址">
          {form.getFieldDecorator('old_address', {
            initialValue: params ? params.address : null,
          })(<Input disabled={true} style={{width: '100%'}} />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="新地址">
          {form.getFieldDecorator('address1', {
            rules: [
              { 
                required: true, 
                message: '请输入新地址' 
              },
            ],
          })(<Input style={{width: '100%'}} placeholder="请输入新地址" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="验证码">
          <Row>
            <Col span={10}>
              {form.getFieldDecorator('telephone_verify_code', {
                rules: [{ required: true, message: '请输入正确的验证码' }],
              })(<Input placeholder="请输入验证码" maxLength={6} />)}
            </Col>
            <Col span={6}>
              <Button
                disabled={!!count}
                className={styles.getCaptcha}
                onClick={onGetCaptcha}
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
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ coldwalletGasList }) => ({
  coldwalletGasList,
}))
class ColdwalletGasList extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coldwalletGasList/fetch',
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

  modifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
  }

  handleModifyModalVisible = params => {
    this.setState({
      params,
      modifyVisible: true,
    });
  }

  onGetCaptcha = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'coldwalletGasList/getCaptcha',
    }).then(data => {
      if(data.status != 1) {
        message.error(captchaError(data.msg));
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

  modify = (arg, chain) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'coldwalletGasList/modify',
      payload: {
        chain,
        ...arg,
        address2: null,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        modifyVisible: false,
      });
      dispatch({
        type: 'coldwalletGasList/fetch',
      })
    })
  }

  render() {
    const { coldwalletGasList } = this.props;
    const { count, submitLoading, modifyVisible, params } = this.state;
    const erc20Wallet = coldwalletGasList.wallet ? coldwalletGasList.wallet.erc20 : null;
    const omniWallet = coldwalletGasList.wallet ? coldwalletGasList.wallet.omni : null;

    const modifyMethods = {
      submit: this.modify,
      cancel: this.modifyCancel,
      params,
      count,
      onGetCaptcha: this.onGetCaptcha,
    };

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={'erc20钱包'}></Descriptions.Item>
              {
                erc20Wallet && erc20Wallet.map(v => 
                  <Descriptions.Item label={''}>
                    <Tooltip title={v.address}>
                      <a style={{paddingRight: 10, display: 'inline-block', verticalAlign: 'middle', maxWidth: 400, overflow: 'hidden',whiteSpace: 'nowrap', textOverflow:'ellipsis'}} onClick={() => this.handleClipBoard(v.address)}>{ v.address }</a>
                    </Tooltip>
                    <br/>
                    <span style={{padding: '0 10px', color: '#ea8a00', verticalAlign: 'middle',}}>金额：1321 USDT</span>
                    <Button 
                      type="primary" 
                      onClick={() => this.handleModifyModalVisible({
                        address: v.address,
                        chain: 'eth'
                      })}
                    >
                      更改
                    </Button>
                    <span style={{padding: '0 5px'}}></span>
                    <Button>
                      <Link to={`/super/coldwallet/coldwalletGas/erc20?address=${v.address}`}>查账</Link>
                    </Button>
                    <Divider></Divider>
                  </Descriptions.Item>
                )
              }
              
              <Descriptions.Item label={'omni钱包'}></Descriptions.Item>

              {
                omniWallet && omniWallet.map(v => 
                  <Descriptions.Item label={''}>
                    <Tooltip title={v.address}>
                      <a style={{paddingRight: 10, display: 'inline-block', verticalAlign: 'middle', maxWidth: 400, overflow: 'hidden',whiteSpace: 'nowrap', textOverflow:'ellipsis'}} onClick={() => this.handleClipBoard(v.address)}>{ v.address }</a>
                    </Tooltip>
                    <br/>
                    <span style={{padding: '0 10px', color: '#ea8a00', verticalAlign: 'middle',}}>金额：1321 USDT</span>
                    <Button 
                      type="primary" 
                      onClick={() => this.handleModifyModalVisible({
                        address: v.address,
                        chain: 'omni'
                      })}
                    >
                      更改
                    </Button>
                    <span style={{padding: '0 5px'}}></span>
                    <Button>
                      <Link to={`/super/coldwallet/coldwalletGas/omni?address=${v.address}`}>查账</Link>
                    </Button>
                    <Divider></Divider>
                  </Descriptions.Item>
                )
              }
              
            </Descriptions>
          </div>
        </div>
        <CreateModifyForm {...modifyMethods} modalVisible={ modifyVisible } />
      </ContLayout>
    );
  }
}

export default ColdwalletGasList;
