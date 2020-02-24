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

const CreateForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, params } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
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
      centered
      okText='确认'
    >
      <Form>
        <div style={{paddingBottom: '28px', textAlign: 'center'}}>承兑商 <span style={{color: '#308AFF'}}>asdasdsad</span> <span style={{color: '#308AFF'}}>313123123213123</span> 申请金额 <span style={{color: '#EB9211'}}>123231312323213 USDT</span></div>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拒绝理由">
          {form.getFieldDecorator('desc', {
            rules: [
              { 
                required: true, 
                message: '请输入拒绝理由' 
              },
            ],
          })(<TextArea placeholder="请输入拒绝理由" style={{width: '100%', height: 120}} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ merchantCoinWithdrawApply, loading }) => ({
  merchantCoinWithdrawApply,
  loading: loading.effects['merchantCoinWithdrawApply/fetch'],
}))
@Form.create()
class MerchantCoinWithdrawApply extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantCoinWithdrawApply/fetch',
      payload:{
        pageSize:10,
        page:0,
        order_id: null,
      },
    })
  }

  componentWillUnmount() {
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.merchantCoinWithdrawApply.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'merchantCoinWithdrawApply/search',
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
        order_id: fieldsValue.order_id || null,
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'merchantCoinWithdrawApply/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.merchantCoinWithdrawApply.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('order_id',{ initialValue: history.order_id })(<Input placeholder="姓名/手机号" />)}
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

  agree = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.merchantCoinWithdrawApply.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'merchantCoinWithdrawApply/agree',
      payload: {
        order_id: id
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

  refuse = arg => {
    const { dispatch } = this.props;
    const { pagination } = this.props.merchantCoinWithdrawApply.data;
console.log(arg)
    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'merchantCoinWithdrawApply/refuse',
      payload: arg,
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
    const { loading } = this.props;
    const { history, list, pagination } = this.props.merchantCoinWithdrawApply.data;
    const { visible, params } = this.state;

    const methods = {
      submit: this.refuse,
      cancel: this.cancel,
      params
    };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'aging',
        key: 'aging',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center',
      },
      {
        title: '余额',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '申请金额',
        dataIndex: 'out_order_id',
        key: 'out_order_id',
        align: 'center',
        render: (val, record) => {
          return(
            <span style={{color: '#EA8A00'}}>{val} USDT</span>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (val, record) => {
          return(
            <span>
              <Popconfirm title="是否要确认同意？" onConfirm={() => this.agree(record.order_id)}>
                <Button>同意</Button>
              </Popconfirm>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button onClick={() => this.handleModalVisible(record)}>拒绝</Button>
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
            data={{ list: [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}], pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <CreateForm {...methods} modalVisible={ visible } />
      </ContLayout>
    );
  }
}

export default MerchantCoinWithdrawApply;
