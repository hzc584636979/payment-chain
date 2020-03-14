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
  Radio,
  Switch,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import exportXLSX from '@/utils/exportXLSX';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import styles from './style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ withoutAudit, loading }) => ({
  withoutAudit,
  loading: loading.effects['withoutAudit/fetch'],
  searchLoading: loading.effects['withoutAudit/search'],
}))
@Form.create()
class WithoutAudit extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'withoutAudit/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        search_value: null,
        bind_status: g_getLocalStorage() ? (g_getLocalStorage().type == 1 ? 0 : 2) : 2,
        manager_id: g_getLocalStorage() ? (g_getLocalStorage().type == 1 ? null :  g_getLocalStorage().id) : null,
      },
    })
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.withoutAudit.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'withoutAudit/search',
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
        bind_status: g_getLocalStorage() ? (g_getLocalStorage().type == 1 ? 0 : 2) : 2,
        manager_id: g_getLocalStorage() ? (g_getLocalStorage().type == 1 ? null :  g_getLocalStorage().id) : null,
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'withoutAudit/search',
        payload: values,
      })
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.withoutAudit.data;
    const { selectedRowKeys, showMyList } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={6} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('search_value',{ initialValue: history.search_value })(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
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

  modify = (withdraw_without_audit, accept_id) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.withoutAudit.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'withoutAudit/modify',
      payload: {
        withdraw_without_audit,
        accept_id,
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

  render() {
    const { loading, searchLoading } = this.props;
    const { history, list, pagination } = this.props.withoutAudit.data;
    const { selectedRowKeys } = this.state;
    const columns = [
      {
        title: '承兑商姓名',
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
        title: '免提币审核',
        key: 'action',
        align: 'center',
        render: (val, record) => {
          return <Switch onChange={e => this.modify(e, record.id)} checkedChildren={'开'} unCheckedChildren={'关'} checked={record.withdraw_without_audit} />
        },
      },
    ];

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <StandardTable
            rowKey={'id'}
            noRowSelection={true}
            loading={loading || searchLoading}
            data={{ list, pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </ContLayout>
    );
  }
}

export default WithoutAudit;
