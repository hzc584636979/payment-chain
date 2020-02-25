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
      submit(fieldsValue, params.id);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  const validator = (rule, value, callback) => {
    if(value) {
  		if(!Number(value)) {
	    	callback('请输入数字的手续费');
	    }else if(value > 100) {
	    	callback('手续费不能大于100');
	    }else if(value.toString().indexOf('.') > -1 && value.toString().split('.')[1].length > 2) {
	        callback('手续费的小数不能多于2位');
	    }
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
        <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="出金手续费设置">
          {form.getFieldDecorator('out_gas', {
            initialValue: params ? params['wallets.chu_gas_percent'] * 100 : null,
            rules: [
              { 
                required: true, 
                message: '请输入手续费' 
              },
              {
                validator: validator
              }
            ],
          })(<Input style={{width: 100}} placeholder="请输入手续费" />)}%
        </FormItem>
        <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="入金手续费设置">
          {form.getFieldDecorator('in_gas', {
            initialValue: params ? params['wallets.ru_gas_percent'] * 100 : null,
            rules: [
              { 
                required: true, 
                message: '请输入手续费' 
              },
              {
                validator: validator
              }
            ],
          })(<Input style={{width: 100}} placeholder="请输入手续费" />)}%
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ merchantBrokerage, loading }) => ({
  merchantBrokerage,
  loading: loading.effects['merchantBrokerage/fetch'],
}))
@Form.create()
class MerchantBrokerage extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantBrokerage/fetch',
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
    const { history } = this.props.merchantBrokerage.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'merchantBrokerage/search',
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
        type: 'merchantBrokerage/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.merchantBrokerage.data;

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

  modify = (arg, merchant_id) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.merchantBrokerage.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'merchantBrokerage/modify',
      payload: {
        merchant_id,
        out_gas: arg.out_gas / 100,
        in_gas: arg.in_gas / 100,
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
    const { history, list, pagination } = this.props.merchantBrokerage.data;
    const { visible, params } = this.state;

    const methods = {
      submit: this.modify,
      cancel: this.cancel,
      params,
    };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'real_name',
        key: 'real_name',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'telephone_number',
        key: 'telephone_number',
        align: 'center',
      },
      {
        title: '历史成交总量(单)',
        dataIndex: 'total_success_order',
        key: 'total_success_order',
        align: 'center',
      },
      {
        title: '出金手续费',
        dataIndex: 'wallets.chu_gas_percent',
        key: 'chu_gas_percent',
        align: 'center',
        render: (val, record) => {
          return val && <span style={{color: '#EA8A00'}}>{ val * 100 }%</span>;
        },
      },
      {
        title: '入金手续费',
        dataIndex: 'wallets.ru_gas_percent',
        key: 'ru_gas_percent',
        align: 'center',
        render: (val, record) => {
          return val && <span style={{color: '#EA8A00'}}>{ val * 100 }%</span>;
        },
      },
      {
        title: '操作',
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
            data={{ list, pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <CreateForm {...methods} modalVisible={ visible } />
      </ContLayout>
    );
  }
}

export default MerchantBrokerage;
