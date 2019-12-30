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
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusType = {
  0: '0',
  1: '1',
};

const CreateExportForm = Form.create()(props => {
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
      title="导出"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='导出'
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择日期">
          {form.getFieldDecorator('time')(
            <RangePicker
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ buyOrder, loading }) => ({
  buyOrder,
  loading: loading.effects['buyOrder/fetch'],
}))
@Form.create()
class BuyOrder extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    /*dispatch({
      type: 'buyOrder/fetch',
      payload:{pageSize:10,page:0},
    });*/
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    dispatch({
      type: 'buyOrder/search',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        time: fieldsValue.time && fieldsValue.time.valueOf(),
        page:0,
        pageSize:10,
      };
      dispatch({
        type: 'buyOrder/search',
        payload: values,
      });

      delete values.page;
      delete values.pageSize;
      this.setState({
        formValues: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.buyOrder.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={6} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('nickname',{ initialValue: history.nickname })(<Input placeholder="姓名/承兑商/订单号" />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status',{ initialValue: history.status })(
                <Select placeholder="请选择">
                  {
                    Object.keys(statusType).map(value => {
                      return <Option value={value} key={value}>{statusType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('time',{ initialValue: history.time })(
                <DatePicker format={'YYYY-MM-DD'} style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormExport}>
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  receipt = id => {
    dispatch({
      type: 'buyOrder/receipt',
      payload: {id},
    });
  }

  handleFormExport = () => {
    this.setState({
      exportVisible: true,
    })
  }

  exportOk = fieldsValue => {
    const { dispatch } = this.props;

    dispatch({
      type: 'sellOrder/export',
      payload: fieldsValue,
    }).then(data => {
      if(!data) {
        message.error('修改失败，请重试！');
        return;
      }
      this.setState({
        exportVisible: false,
      })
    })
  }

  exportCancel = () => {
    this.setState({
      exportVisible: false,
    })
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.buyOrder.data;
    const { exportVisible } = this.state;
    const columns = [
      {
        title: '时效',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '内部订单号',
        dataIndex: 'internalOrder',
        key: 'internalOrder',
        align: 'center',
      },
      {
        title: '外部订单号',
        dataIndex: 'externalOrder',
        key: 'externalOrder',
        align: 'center',
      },
      {
        title: '客户付款姓名',
        dataIndex: 'payName',
        key: 'payName',
        align: 'center',
      },
      {
        title: '承兑商收款姓名',
        dataIndex: 'way',
        key: 'way',
        align: 'center',
      },
      {
        title: '商户出售金额 (USDT)',
        dataIndex: 'customerNickname',
        key: 'customerNickname',
        align: 'center',
      },
      {
        title: '等值 (CNY)',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render:(val,record)=>{
          return statusType[val];
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 300,
        render: (val, record) => {
          return(
            <span>
              <Popconfirm title="是否要确认收款？" onConfirm={() => this.receipt(record._id)}>
                <Button>确认收款</Button>
              </Popconfirm>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to={`/order/buyOrder_appeal/${record._id}`}>申述</Link>
              </Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to={`/order/buyOrder_detail/${record._id}`}>查看</Link>
              </Button>
            </span>
          );
        },
      },
    ];

    const exportMethods = {
      submit: this.exportOk,
      cancel: this.exportCancel,
    };

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
            scroll={{ x: 1400 }}
          />
        </div>
        <CreateExportForm {...exportMethods} modalVisible={ exportVisible } />
      </ContLayout>
    );
  }
}

export default BuyOrder;
