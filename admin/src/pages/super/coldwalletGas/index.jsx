import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Menu,
  Row,
  Col,
  Divider,
  Popconfirm,
  message,
  Alert,
  Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import styles from './style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreatePayForm = Form.create()(props => {
  const { modalVisible, cancel, payAddress, clickDownLoad, handleClipBoard } = props;

  const cancelHandle = () => {
    cancel();
  }

  return (
    <Modal
      title="充币"
      visible={modalVisible}
      onCancel={cancelHandle}
      footer={null}
    >
      <Form>
        <div className={styles.payLayout}>
          <div className={styles.ewm}>
            {
              payAddress &&
              <QRCode
                id="qrid"
                value={ payAddress }
                size={220}
                style={{ margin: '0 auto' }}
              />
            }
          </div>
          <Button type="primary" style={{ width: 130 }}>
            <a download id="aId" onClick={clickDownLoad}>
              保存二维码
            </a>
          </Button>
          <div className={styles.address}>{ payAddress }</div>
          <Button
            type="primary"
            style={{ width: 130 }}
            onClick={() => handleClipBoard(payAddress)}
          >
            复制地址
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

@connect(({ coldwalletGasList, loading }) => ({
  coldwalletGasList,
  loading: loading.effects['coldwalletGasList/fetch'],
  submitLoading: loading.effects['coldwalletGasList/add'],
  deleteLoading: loading.effects['coldwalletGasList/delete'],
}))
@Form.create()
class ColdwalletGas extends Component {
  state = {
    selectedRowKeys: []
  };

  componentDidMount() {
    this.getInfo();
  }

  componentWillUnmount() {

  }

  getInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'coldwalletGasList/fetch',
      payload:{
        pageSize: 10,
        page: 0,
      },
    });
  }

  clickDownLoad = () => {
    var Qr = document.getElementById('qrid');
    let image = new Image();
    image.src = Qr.toDataURL('image/png');
    var a_link = document.getElementById('aId');
    a_link.href = image.src;
    a_link.download = '二维码.png';
  };

  handleClipBoard = address => {
    if (copy(address)) {
      message.success('复制成功');
    } else {
      message.error('复制失败，请重试');
    }
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'coldwalletGasList/fetch',
      payload: params,
    });
  };

  handleType = e => {
    this.setState({
      token_id: e,
      address: null,
      private_key: null,
    })
  }

  handleAddress = e => {
    this.setState({
      address: e.target.value
    })
  }

  handlePrivateKey = e => {
    this.setState({
      private_key: e.target.value
    })
  }

  addWallet = () => {
    const { token_id, address, private_key } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'coldwalletGasList/add',
      payload: {
        token_id, 
        address, 
        private_key
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        private_key: null, 
        address: null, 
      })
      this.getInfo();
    })
  }

  deleteWallet = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'coldwalletGasList/delete',
      payload: {
        selectedRowKeys, 
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        selectedRowKeys: []
      })
      this.getInfo();
    })
  }

  renderForm() {
    const { submitLoading, deleteLoading } = this.props;
    const { token_id, address, private_key, selectedRowKeys } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="钱包类型">
              <Select value={token_id} placeholder="请选择币种" onChange={this.handleType}>
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
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              <Input onChange={this.handleAddress} placeholder="请输入地址" value={address} />
            </FormItem>
          </Col>
          {
            token_id == 1 ?
            <Col xl={8} lg={12} sm={24}>
              <FormItem>
                <Input onChange={this.handlePrivateKey} placeholder="请输入私钥" value={private_key} />
              </FormItem>
            </Col>
            :
            <Fragment>
              <Col xl={4} lg={12} sm={24}>
                <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
                  <Button loading={submitLoading} type="primary" onClick={this.addWallet}>
                    生成钱包
                  </Button>
                </span>
              </Col>
              <Col xl={4} lg={12} sm={24}>
                <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
                  <Button disabled={selectedRowKeys.length > 0 ? false : true} loading={deleteLoading} type="danger" onClick={this.deleteWallet}>
                    删除
                  </Button>
                </span>
              </Col>
            </Fragment>
          }
        </Row>
        {
          token_id == 1 &&
          <Row type="flex" justify="space-between">
            <Col xl={4} lg={12} sm={24}>
              <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
                <Button loading={submitLoading} type="primary" onClick={this.addWallet}>
                  生成钱包
                </Button>
              </span>
            </Col>
            <Col xl={4} lg={12} sm={24}>
              <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
                <Button disabled={selectedRowKeys.length > 0 ? false : true} loading={deleteLoading} type="danger" onClick={this.deleteWallet}>
                  删除
                </Button>
              </span>
            </Col>
          </Row>
        }
      </Form>
    );
  }

  payCancel = () => {
    this.setState({
      payVisible: false,
    });
  }

  handlePayModalVisible = payAddress => {
    this.setState({
      payAddress,
      payVisible: true,
    });
  }

  handleSelectRows = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    });
  };

  render() {
    const { loading } = this.props;
    const { list, pagination } = this.props.coldwalletGasList.data;
    const { selectedRowKeys, payVisible, payAddress } = this.state;

    const payMethods = {
      submit: this.payCancel,
      cancel: this.payCancel,
      payAddress,
      clickDownLoad: this.clickDownLoad, 
      handleClipBoard: this.handleClipBoard
    };

    const columns = [
      {
        title: '钱包类型',
        dataIndex: 'token_id',
        key: 'token_id',
        align: 'center',
        render: (val, record) => {
          return coinType2[record.token_id];
        },
      },
      {
        title: '钱包地址',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
      },
      {
        title: '钱包余额',
        dataIndex: '12313',
        key: '123213',
        align: 'center',
        render: (val, record) => {
          return `${wei2USDT(val, record.token_id == 1 ? 'erc20' : 'omni')} ${coinType2[record.token_id]}`;
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (val, record) => {
          return(
            <span>
              <Button onClick={() => this.handlePayModalVisible(record.address)}>充值</Button>
            </span>
          );
        },
      },
    ];

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <StandardTable
            selectedRowKeys={selectedRowKeys}
            rowKey={'id'}
            onSelectRow={this.handleSelectRows}
            loading={loading}
            data={{ list, pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <CreatePayForm {...payMethods} modalVisible={ payVisible } />
      </ContLayout>
    );
  }
}

export default ColdwalletGas;
