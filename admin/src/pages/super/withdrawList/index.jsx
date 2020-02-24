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
const orderType = {
  0: '全部',
  1: '转入',
  2: '转出',
};

@connect(({ withdrawList, loading }) => ({
  withdrawList,
  loading: loading.effects['withdrawList/fetch'],
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
        state: 0,
        token_id: 0,
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
        page:0,
        pageSize:10,
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
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="订单分类">
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
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="时间">
              {getFieldDecorator('time',{ initialValue: history.time })(
                <RangePicker
                  style={{ width: '100%' }}
                />
              )}
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

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.withdrawList.data;
    const columns = [
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
        title: '姓名',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '代币数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        render: (val, record) => {
          return `${wei2USDT(val, record.token_id == 1 ? 'erc20' : 'omni')} ${coinType2[record.token_id]}`;
        },
      },
      {
        title: '时间',
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

export default WithdrawList;
