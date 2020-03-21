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
  Modal,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import exportXLSX from '@/utils/exportXLSX';
import moment from 'moment';
import styles from './style.less';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusType = {
  0: '全部',
  1: '申请提现中',
  2: '已退款',
  3: '拒绝退款',
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, params, refuseLoading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue, params.id);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  return (
    <Modal
      title="拒绝"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      confirmLoading={refuseLoading}
      centered
      okText='确认'
    >
      <Form>
        <div style={{paddingBottom: '28px', textAlign: 'center'}}>商户 <span style={{color: '#308AFF'}}>{ params && params['user.real_name'] }</span> 申请金额 <span style={{color: '#EB9211'}}>{ params && `${params.coin_number} ${coinType2[params.token_id]}` }</span></div>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拒绝理由">
          {form.getFieldDecorator('reason', {
            rules: [
              { 
                required: true, 
                message: '请输入拒绝理由' 
              },
            ],
          })(<TextArea maxLength={100} placeholder="请输入拒绝理由" style={{width: '100%', height: 120}} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ acceptCoinWithdrawApply, loading }) => ({
  acceptCoinWithdrawApply,
  loading: loading.effects['acceptCoinWithdrawApply/fetch'],
  agreeLoading: loading.effects['acceptCoinWithdrawApply/agree'],
  refuseLoading: loading.effects['acceptCoinWithdrawApply/refuse'],
}))
@Form.create()
class AccpetCoinWithdrawApply extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'acceptCoinWithdrawApply/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        search_value: null,
        state: 0,
      },
    })
  }

  componentWillUnmount() {
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.acceptCoinWithdrawApply.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'acceptCoinWithdrawApply/search',
      payload: params,
    });
  };

  handleSearch = (e, pagination={}) => {
    e && e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        search_value: fieldsValue.search_value || null,
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'acceptCoinWithdrawApply/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.acceptCoinWithdrawApply.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('search_value',{ initialValue: history.search_value })(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state', { initialValue: history.state + '' })(
                <Select style={{width: 150}} placeholder="请选择">
                  {Object.keys(statusType).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {statusType[value]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  agree = order_id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.acceptCoinWithdrawApply.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'acceptCoinWithdrawApply/agree',
      payload: {
        order_id
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.handleSearch(null, params);
    })
  }

  refuse = (arg, order_id) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.acceptCoinWithdrawApply.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'acceptCoinWithdrawApply/refuse',
      payload: {
        order_id,
        reason: arg.reason,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.handleSearch(null, params);
      this.setState({
        visible: false,
      });
    })
  }

  cancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleModalVisible = params => {
    this.setState({
      params,
      visible: true,
    });
  }

  render() {
    const { 
      loading,
      agreeLoading,
      refuseLoading
    } = this.props;
    const { history, list, pagination } = this.props.acceptCoinWithdrawApply.data;
    const { visible, params } = this.state;

    const methods = {
      submit: this.refuse,
      cancel: this.cancel,
      params,
      refuseLoading
    };

    const columns = [
      {
        title: '申请金额',
        dataIndex: 'coin_number',
        key: 'coin_number',
        align: 'center',
        render: (val, record) => {
          //return `${wei2USDT(val, record.token_id == 1 ? 'erc20' : 'omni')} ${coinType2[record.token_id]}`;
          return <span style={{color: '#ea8a00'}}>{ `${val} ${coinType2[record.token_id]}` }</span>
        },
      },
      {
        title: '余额',
        dataIndex: 'balance',
        key: 'balance',
        align: 'center',
        render: (val, record) => {
          return <span style={{color: '#ea8a00'}}>{ `${val} ${record.token_id == 1 || record.token_id == 2 ? 'USDT' : ''}` }</span>
        },
      },
      {
        title: '姓名',
        dataIndex: 'user.real_name',
        key: 'real_name',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'user.telephone_number',
        key: 'telephone_number',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          return statusType[val];
        }
      },
      {
        title: '申请时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 200,
        render: (val, record) => {
          return(
            <span>
              {
                record.state == 1 &&
                <Fragment>
                  <Popconfirm title="是否要确认同意？" onConfirm={() => this.agree(record.id)}>
                    <Button loading={agreeLoading}>同意</Button>
                  </Popconfirm>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                  <Button onClick={() => this.handleModalVisible(record)}>拒绝</Button>
                </Fragment>
              }
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
            noRowSelection={true}
            loading={loading}
            data={{ list, pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
            scroll={list && list.length > 0 ? { x: 800 } : {}}
          />
        </div>
        <CreateForm {...methods} modalVisible={ visible } />
      </ContLayout>
    );
  }
}

export default AccpetCoinWithdrawApply;
