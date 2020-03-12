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

@connect(({ goldEntryDissentOrder, loading }) => ({
  goldEntryDissentOrder,
  loading: loading.effects['goldEntryDissentOrder/fetch'],
}))
@Form.create()
class GoldEntryDissentOrder extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldEntryDissentOrder/fetch',
      payload: {
        pageSize: 10,
        page: 0,
        state: 0,
        token_id: 0,
        issue_state: 0,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {}

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.goldEntryDissentOrder.data;

    const params = {
      ...history,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'goldEntryDissentOrder/search',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
console.log(fieldsValue)
      const values = {
        ...fieldsValue,
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'goldEntryDissentOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.goldEntryDissentOrder.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="币种">
              {getFieldDecorator('token_id', { initialValue: history.token_id + '' })(
                <Select placeholder="请选择">
                  {Object.keys(coinType).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {coinType[value]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('state', { initialValue: history.state + '' })(
                <Select placeholder="请选择">
                  {Object.keys(sellStatusType).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {sellStatusType[value]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="处理状态">
              {getFieldDecorator('issue_state',{ initialValue: history.issue_state+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(issueTypeStatus).map(value => {
                      return <Option value={value} key={value}>{issueTypeStatus[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={8} lg={12} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('time', { initialValue: history.time })(
                <RangePicker style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={12} sm={24}>
            <span
              className={styles.submitButtons}
              style={{ paddingTop: 4, display: 'inline-block' }}
            >
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.exportOk}>
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  exportOk = fieldsValue => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'goldEntryDissentOrder/export',
        payload: values,
      }).then(data => {
        if (data.status != 1) {
          message.error(data.msg);
          return;
        }
        if (data.data.rows.length <= 0) {
          message.error('选择的日期内无数据');
          return;
        }
        let dataWCN = [];
        data.data.rows.map(i => {
          let dataWObj = {
            "异议时间": moment(i.issue_create_time)
              .local()
              .format('YYYY-MM-DD HH:mm:ss'),
            "问题类型": i.issue_type,
            "平台订单号": i.order_id,
            "唯一标示号": i.out_order_id,
            "承兑商姓名": i.a_user_name,
            "订单金额": `${i.pay_amount_cny} ${cashType[i.currency_type]}`,
            "代币数量": `${i.m_pay_amount} ${coinType[i.token_id]}`,
            "订单状态": sellStatusType[i.state],
            "订单创建时间": moment(i.created_at)
              .local()
              .format('YYYY-MM-DD HH:mm:ss'),
          };
          dataWCN.push(dataWObj);
        });
        exportXLSX('入金异议订单', dataWCN);
      });
    });
  };

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.goldEntryDissentOrder.data;
    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: 'left',
        align: 'center',
        width: 100,
        render: (val, record) => {
          return (
            <span>
              <Button>
                <Link to={`/dissentOrder/goldEntryOrder_detail/${record.order_id}`}>查看</Link>
              </Button>
            </span>
          );
        },
      },
      {
        title: '订单创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (val, record) => {
          return moment(val)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '异议时间',
        dataIndex: 'issue_create_time',
        key: 'issue_create_time',
        align: 'center',
        render: (val, record) => {
          return moment(val)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '问题类型',
        dataIndex: 'issue_type',
        key: 'issue_type',
        align: 'center',
      },
      {
        title: '处理状态',
        dataIndex: 'issue_state',
        key: 'issue_state',
        align: 'center',
        render: (val, record) => {
          return issueTypeStatus[val];
        }
      },
      {
        title: '平台订单号',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center',
      },
      {
        title: '唯一标示号',
        dataIndex: 'out_order_id',
        key: 'out_order_id',
        align: 'center',
      },
      {
        title: '承兑商姓名',
        dataIndex: 'a_user_name',
        key: 'a_user_name',
        align: 'center',
      },
      {
        title: '订单金额/代币数量',
        dataIndex: 'pay_amount_cny',
        key: 'pay_amount_cny',
        align: 'center',
        render: (val,record) => {
          return `${val} ${cashType[record.currency_type]}/${record.m_pay_amount} ${coinType[record.token_id]}`;
        }
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          return sellStatusType[val];
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
            scroll={list && list.length > 0 ? { x: 1400 } : {}}
          />
        </div>
        <a style={{ display: 'none' }} href="" download id="hf">
          导出
        </a>
      </ContLayout>
    );
  }
}

export default GoldEntryDissentOrder;
