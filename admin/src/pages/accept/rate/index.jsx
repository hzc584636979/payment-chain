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
    if(value) {
      if(!Number(value)) {
        callback('请输入数字的浮动汇率');
      }else if(value > 100) {
        callback('浮动汇率不能大于100');
      }else if(value.toString().indexOf('.') > -1 && value.toString().split('.')[1].length > 1) {
        callback('浮动汇率的小数不能多于1位');
      }
    }
    callback();
  }

  return (
    <Modal
      title="调整"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <div style={{paddingBottom: '28px', textAlign: 'center'}}>承兑商 <span style={{color: '#308AFF'}}>asdasdsad</span></div>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="浮动汇率">
          {form.getFieldDecorator('old_telephone_number', {
            initialValue: 1.2,
            rules: [
              { 
                required: true, 
                message: '请输入浮动汇率' 
              },
              {
                validator: validator
              }
            ],
          })(<Input style={{width: 100}} placeholder="请输入浮动汇率" />)}%
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ acceptRate, loading }) => ({
  acceptRate,
  loading: loading.effects['acceptRate/fetch'],
}))
@Form.create()
class AccpetRate extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'acceptRate/fetch',
      payload:{
        pageSize:10,
        page:0,
        search_value: null,
      },
    })
  }

  componentWillUnmount() {
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.acceptRate.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'acceptRate/search',
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
        type: 'acceptRate/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.acceptRate.data;

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

  modify = arg => {
    const { dispatch } = this.props;
    const { pagination } = this.props.acceptRate.data;
console.log(arg)
    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'acceptRate/modify',
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
    const { history, list, pagination } = this.props.acceptRate.data;
    const { visible, params } = this.state;

    const methods = {
      submit: this.modify,
      cancel: this.cancel,
      params,
    };

    const columns = [
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
        title: '出售订单',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '购买订单',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '浮动汇率(%)',
        dataIndex: 'out_order_id',
        key: 'out_order_id',
        align: 'center',
        render: (val, record) => {
          return <span style={{color: '#EA8A00'}}>{ val }</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (val, record) => {
          return(
            <span>
              <Button onClick={() => this.handleModalVisible(record)}>调整汇率</Button>
              {/*<span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to="">查看交易</Link>
              </Button>*/}
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
            rowKey='user_id'
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

export default AccpetRate;
