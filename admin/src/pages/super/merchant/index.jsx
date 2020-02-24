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
import React, { Component } from 'react';
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

const CreateAddForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel } = props;
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
      title="添加商户管理员"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('user_name', {
            rules: [{ required: true, message: '请输入姓名' }],
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
          {form.getFieldDecorator('telephone_number', {
            rules: [{ required: true, pattern: /^1\d{10}$/, message: '请输入正确的手机号' }],
          })(<Input placeholder="请输入手机号" maxLength={11} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

const CreateModifyForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel, params } = props;
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

  const validator = (rule, value, callback) => {
    if(value && !Number(value) || value.indexOf('.') > -1) {
     callback('请输入整数的管理人数');
    }
    callback();
  }

  return (
    <Modal
      title="修改管理人数"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <div style={{paddingBottom: '28px', textAlign: 'center'}}>商户 <span style={{color: '#308AFF'}}>{ params && params.user_name }</span> 可管理人数 <span style={{color: '#EB9211'}}>{ params && params.manageable_peoples }</span></div>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="修改管理人数">
          {form.getFieldDecorator('manageable_peoples', {
            rules: [
              { 
                required: true, 
                message: '请输入管理人数' 
              },
              {
                validator: validator
              }
            ],
          })(<Input style={{width: 150}} maxLength={4} placeholder="设置人数" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ superMerchant, loading }) => ({
  superMerchant,
  loading: loading.effects['superMerchant/fetch'],
}))
@Form.create()
class SuperMerchant extends Component {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'superMerchant/fetch',
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
    const { history } = this.props.superMerchant.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'superMerchant/search',
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
        type: 'superMerchant/search',
        payload: values,
      }).then(data => {
        this.handleSelectRows([])
      })
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.superMerchant.data;
    const { selectedRowKeys } = this.state;

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
          <Col xl={8} lg={12} sm={24} style={{textAlign: 'right'}}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button onClick={this.handleAddModalVisible} type="primary">
                添加
              </Button>
              <Button onClick={this.delete} type="danger" disabled={selectedRowKeys.length > 0 ? false : true} style={{ marginLeft: 8 }}>
                删除
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleSelectRows = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    });
  };

  add = arg => {
    const { dispatch } = this.props;
    const { pagination } = this.props.superMerchant.data;
    const params = {
      page: 0,
      pageSize: 10,
    };

    dispatch({
      type: 'superMerchant/add',
      payload: arg,
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

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    const params = {
      page: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'superMerchant/delete',
      payload: {
        users: selectedRowKeys
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

  modify = (arg, accept_id) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.superMerchant.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'superMerchant/modify',
      payload: {
        accept_id,
        manageable_peoples: arg.manageable_peoples,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        'modifyVisible': false,
      });
      this.handleSearch(null, params);
    })
  }

  addCancel = () => {
    this.setState({
      'addVisible': false,
    });
  }

  handleAddModalVisible = (type) => {
    this.setState({
      'addVisible': true,
    });
  }

  modifyCancel = () => {
    this.setState({
      'modifyVisible': false,
    });
  }

  handleModifyModalVisible = params => {
    this.setState({
      params,
      'modifyVisible': true,
    });
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.superMerchant.data;
    const { selectedRowKeys, addVisible, modifyVisible, params } = this.state;

    const addMethods = {
      submit: this.add,
      cancel: this.addCancel,
    };

    const modifyMethods = {
      submit: this.modify,
      cancel: this.modifyCancel,
      params,
    };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'telephone_number',
        key: 'telephone_number',
        align: 'center',
      },
      {
        title: '可管理人数',
        dataIndex: 'manageable_peoples',
        key: 'manageable_peoples',
        align: 'center',
      },
      {
        title: '已管理人数',
        dataIndex: 'managed_peoples',
        key: 'managed_peoples',
        align: 'center',
      },
      {
        title: '添加时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (val, record) => {
          return(
            <span>
              <Button>
                <Link to={`/super/merchant_add/${record.id}?parent_name=${record.user_name}`}>成员管理</Link>
              </Button>
              <span style={{ display: 'inline-block', width: '10px' }}></span>
              <Button onClick={() => this.handleModifyModalVisible(record)}>修改</Button>
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
        <CreateAddForm {...addMethods} modalVisible={ addVisible } />
        <CreateModifyForm {...modifyMethods} modalVisible={ modifyVisible } />
      </ContLayout>
    );
  }
}

export default SuperMerchant;
