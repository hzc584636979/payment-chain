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

  const validator = (rule, value, callback) => {
    if(value && !Number(value) || value.indexOf('.') > -1) {
     callback('请输入整数的综合信用额度');
    }
    callback();
  }

  return (
    <Modal
      title="修改"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <div style={{paddingBottom: '28px', textAlign: 'center'}}>承兑商 <span style={{color: '#308AFF'}}>asdasdsad</span> 押金 <span style={{color: '#EB9211'}}>123231312323213 USDT</span></div>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="综合信用额度">
          {form.getFieldDecorator('total_credit', {
            initialValue: 89,
            rules: [
              { 
                required: true, 
                message: '请输入综合信用额度' 
              },
              {
                validator: validator
              }
            ],
          })(<Input placeholder="设置综合信用额度" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ acceptCredit, loading }) => ({
  acceptCredit,
  loading: loading.effects['acceptCredit/fetch'],
}))
@Form.create()
class AccpetCredit extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'acceptCredit/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        search_value: null,
      },
    })
  }

  componentWillUnmount() {
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.acceptCredit.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'acceptCredit/search',
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
        type: 'acceptCredit/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.acceptCredit.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('search_value',{ initialValue: history.search_value })(<Input placeholder="姓名/手机号" />)}
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

  modify = (arg, accept_id) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.acceptCredit.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'acceptCredit/modify',
      payload: {
        accept_id,
        total_credit: arg.total_credit
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
    const { loading } = this.props;
    const { history, list, pagination } = this.props.acceptCredit.data;
    const { visible, params } = this.state;

    const methods = {
      submit: this.modify,
      cancel: this.cancel,
      params,
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
        title: '综合信用额度',
        dataIndex: 'out_order_id',
        key: 'out_order_id',
        align: 'center',
        render: (val, record) => {
          return(
            <span style={{color: '#EA8A00'}}>{val}</span>
          );
        },
      },
      {
        title: '押金',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '当前信用排名',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '修改综合信用额度',
        key: 'action',
        align: 'center',
        render: (val, record) => {
          return(
            <span>
              <Button onClick={() => this.handleModalVisible(record)}>修改</Button>
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

export default AccpetCredit;
