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
  Radio
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

const bindStatus = {
  0: '全部',
  1: '未绑定',
  2: '已绑定'
}

@connect(({ superMerchantMember, loading }) => ({
  superMerchantMember,
  loading: loading.effects['superMerchantMember/fetch'],
}))
@Form.create()
class SuperMerchantMember extends Component {
  state = {
    selectedRowKeys: [],
    showMyList: false,
  };

  componentDidMount() {
    this.parent_id = pathToRegexp('/super/merchant_add/:id').exec(window.location.pathname)[1];
    const { dispatch } = this.props;
    dispatch({
      type: 'superMerchantMember/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        search_value: null,
        bind_status: 0,
        manager_id: null,
      },
    })
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.superMerchantMember.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'superMerchantMember/search',
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
        manager_id: this.state.showMyList ? this.parent_id : null,
        bind_status: this.state.showMyList ? 2 : (pagination.bind_status || pagination.bind_status == 0 ? pagination.bind_status : fieldsValue.bind_status),
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'superMerchantMember/search',
        payload: values,
      }).then(data => {
        this.handleSelectRows([])
      })
    });
  };

  showMyList = () => {
    const status = !this.state.showMyList;
    this.setState({
      showMyList: status
    }, () => {
      this.handleSearch(null, {bind_status: 0});
    })
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.superMerchantMember.data;
    const { selectedRowKeys, showMyList } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col>
            <Radio onClick={this.showMyList} checked={showMyList}>只显示当前管理员已绑定成员</Radio>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={6} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('search_value',{ initialValue: history.search_value })(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
            <FormItem label="绑定状态">
              {getFieldDecorator('bind_status',{ initialValue: history.bind_status+'' })(
                <Select disabled={showMyList} placeholder="请选择">
                  {
                    Object.keys(bindStatus).map(value => {
                      return <Option value={value} key={value}>{bindStatus[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
          <Col xl={6} lg={12} sm={24} style={{textAlign: 'right'}}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button onClick={this.add} type="primary" disabled={selectedRowKeys.length > 0 ? false : true} style={{ marginLeft: 8 }}>
                绑定
              </Button>
              <Button onClick={this.delete} type="danger" disabled={selectedRowKeys.length > 0 ? false : true} style={{ marginLeft: 8 }}>
                解绑
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

  add = () => {
    const { dispatch } = this.props;
    const { pagination } = this.props.superMerchantMember.data;
    const { selectedRowKeys } = this.state;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'superMerchantMember/add',
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

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    const params = {
      page: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'superMerchantMember/delete',
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

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.superMerchantMember.data;
    const { selectedRowKeys } = this.state;
    const columns = [
      {
        title: '商户姓名',
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
        title: '已绑定管理员姓名',
        dataIndex: 'parent_name',
        key: 'parent_name',
        align: 'center',
      },
      {
        title: '注册时间',
        dataIndex: 'out_order_id',
        key: 'out_order_id',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
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
      </ContLayout>
    );
  }
}

export default SuperMerchantMember;
