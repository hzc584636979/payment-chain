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
import copy from 'copy-to-clipboard';
import moment from 'moment';
import styles from './style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const orderType = {
  0: '全部',
  1: '充币账单',
  2: '提币账单',
};
const statusType = {
  0: '全部',
  1: '提起交易',
  2: '交易已广播',
  3: '交易上链已确认',
  4: '交易广播失败',
  5: '交易上链失败',
  6: '已上链等待达到确认数',
  20: '拒绝提币申请',
};
const userType = {
  1: '商户',
  2: '承兑商',
}

@connect(({ withdrawList, loading }) => ({
  withdrawList,
  loading: loading.effects['withdrawList/fetch'],
  searchLoding: loading.effects['withdrawList/search'],
}))
@Form.create()
class WithdrawList extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'withdrawList/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        token_id: 0,
        telephone_number: null,
        order_type: 0,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.withdrawList.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'withdrawList/search',
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
        telephone_number: fieldsValue.telephone_number || null,
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'withdrawList/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.withdrawList.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('telephone_number',{ initialValue: history.telephone_number })(<Input placeholder="手机号" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="币种">
              {getFieldDecorator('token_id',{ initialValue: history.token_id+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(coinType2).map(value => {
                      return <Option value={value} key={value}>{coinType2[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="订单类型">
              {getFieldDecorator('order_type',{ initialValue: history.order_type+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(orderType).map(value => {
                      return <Option value={value} key={value}>{orderType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={12} lg={12} sm={24}>
            <FormItem label="创建时间">
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

  handleClipBoard = val => {
    if(copy(val)){
      message.success('复制成功') 
    }else{
      message.error('复制失败，请重试') 
    }
  }

  render() {
    const { loading, searchLoding } = this.props;
    const { history, list, pagination } = this.props.withdrawList.data;
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
        title: '用户类型',
        dataIndex: 'user_type',
        key: 'user_type',
        align: 'center',
        render:(val,record)=>{
          return userType[val];
        },
      },
      {
        title: '订单分类',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render:(val,record)=>{
          return orderType[val];
        },
      },
      {
        title: '币种',
        dataIndex: 'token_id',
        key: 'token_id',
        align: 'center',
        render:(val,record)=>{
          return coinType2[val];
        },
      },
      {
        title: '代币数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        render: (val, record) => {
          return `${wei2USDT(val, record.token_id == 1 ? 'erc20' : 'omni')}`;
        },
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render:(val,record)=>{
          return statusType[val >= 20 ? val : Number(val) + 1];
        },
      },
      {
        title: 'Txhash',
        dataIndex: 'txid',
        key: 'txid',
        align: 'center',
        width: 150,
        render:(val,record)=>{
          return <a onClick={() => this.handleClipBoard(val)}>{ val }</a>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (val, record) => {
          return moment(val*1000).local().format('YYYY-MM-DD HH:mm:ss')
        }
      }, 
    ];

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <StandardTable
            noRowSelection={true}
            rowKey={'id'}
            loading={loading || searchLoding}
            data={{ list, pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </ContLayout>
    );
  }
}

export default WithdrawList;
