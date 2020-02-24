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
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ coldwalletGas, loading }) => ({
  coldwalletGas,
  loading: loading.effects['coldwalletGas/fetch'],
}))
@Form.create()
class ColdwalletGas extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coldwalletGas/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        order_type: 0,
        search_value: null,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.coldwalletGas.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'coldwalletGas/search',
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
        search_value: fieldsValue.search_value || null,
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'coldwalletGas/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.coldwalletGas.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('search_value',{ initialValue: history.search_value })(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xl={4} lg={12} sm={24}>
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

  frozen = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.superAccept.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    
    dispatch({
      type: 'coldwalletGas/frozen',
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

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.coldwalletGas.data;
    const columns = [
      
      {
        title: '商户姓名',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '商户地址',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '订单金额',
        dataIndex: '12313',
        key: '123213',
        align: 'center',
        render: (val, record) => {
          return `${val} ${cashType[record.currency_type]}`;
        },
      },
      {
        title: '手续费',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        render: (val, record) => {
          return `${wei2USDT(val, record.token_id == 1 ? 'erc20' : 'omni')} ${coinType[record.token_id]}`;
        },
      }, 
      {
        title: '冻结资金',
        dataIndex: '123213',
        key: '123123',
        align: 'center',
        render: (val, record) => {
          return `${wei2USDT(val, record.token_id == 1 ? 'erc20' : 'omni')} ${coinType[record.token_id]}`;
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
              <Popconfirm title="是否要确认冻结商户资金？" onConfirm={this.frozen}>
                <Button>冻结商户资金</Button>
              </Popconfirm>
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
      </ContLayout>
    );
  }
}

export default ColdwalletGas;
