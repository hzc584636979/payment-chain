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
const roleType = {
  0: '全部',
  1: '超级管理员',
  2: '承兑商管理员',
  3: '商户管理员',
}
const statusType = {
  0: '全部',
  1: '登录系统',
  2: '调整费率',
  3: '删除成员',
  4: '添加成员',
  5: '调整手续费',
  6: '信用评分',
  7: '押金管理',
  8: '修改交易槽',
  9: '提现管理',
  10: '消息管理',
};

const roleData = [0, 1, 2, 3];
const statusData = {
  0: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  2: [0, 1, 2, 6, 7, 8, 9],
  3: [0, 1, 5, 9],
};

@connect(({ systemLog, loading }) => ({
  systemLog,
  loading: loading.effects['systemLog/fetch'],
}))
@Form.create()
class SystemLog extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemLog/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        search_value: null,
        manage_type: 0,
        action_value: 0,
        time: [moment().startOf('day'), moment().endOf('day')],
      },
    })
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.systemLog.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'systemLog/search',
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
        type: 'systemLog/search',
        payload: values,
      });
    });
  };

  handleSelectChange = e => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({'type': 0 })
  }

  renderForm() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { history } = this.props.systemLog.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={6} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('search_value',{ initialValue: history.search_value })(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xl={9} lg={12} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('manage_type',{ 
                initialValue: history.manage_type,
              })(
                <Select onChange={this.handleSelectChange} placeholder="请选择">
                  {
                    roleData.map(value => {
                      return <Option value={value} key={value}>{roleType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={9} lg={12} sm={24}>
            <FormItem label="操作类型">
              {getFieldDecorator('action_value',{ initialValue: history.action_value })(
                <Select placeholder="请选择">
                  {
                    statusData[getFieldValue('role') || 0].map(value => {
                      return <Option value={value} key={value}>{statusType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={12} lg={12} sm={24}>
            <FormItem label="操作时间">
              {getFieldDecorator('time',{ initialValue: history.time })(
                <RangePicker
                  style={{ width: '100%' }}
                />
              )}
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

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.systemLog.data;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center',
        fixed: 'left',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'telephone_number',
        key: 'telephone_number',
        align: 'center',
        fixed: 'left',
        width: 100,
      },
      {
        title: '角色',
        dataIndex: 'manager_user.type',
        key: 'type',
        align: 'center',
        fixed: 'left',
        width: 100,
        render: (val,record) => {
          return roleType[val];
        }
      },
      {
        title: '操作分类',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        fixed: 'left',
        width: 100,
        render: (val,record) => {
          return statusType[val];
        }
      },
      {
        title: '操作时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        fixed: 'left',
        width: 100,
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作内容',
        dataIndex: 'content',
        key: 'content',
        align: 'left',
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
      </ContLayout>
    );
  }
}

export default SystemLog;
