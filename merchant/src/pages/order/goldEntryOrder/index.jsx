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

@connect(({ goldEntryOrder, loading }) => ({
  goldEntryOrder,
  loading: loading.effects['goldEntryOrder/fetch'],
}))
@Form.create()
class GoldEntryOrder extends Component {
  state = {};

  interval = undefined;

  componentDidMount() {
    this.getViewData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query.key && this.initKey != nextProps.location.query.key) {
      clearInterval(this.interval);
      this.initKey = nextProps.location.query.key;
      this.getViewData();
    }
  }

  getViewData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldEntryOrder/fetch',
      payload: {
        pageSize: 10,
        page: 0,
        state: 0,
        token_id: 0,
        order_id: null,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.goldEntryOrder.data;

    const params = {
      ...history,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'goldEntryOrder/search',
      payload: params,
    });
  };

  handleSearch = (e, pagination = {}) => {
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
        type: 'goldEntryOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.goldEntryOrder.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={5} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('order_id', { initialValue: history.order_id })(
                <Input placeholder="平台订单号" />,
              )}
            </FormItem>
          </Col>
          <Col xl={3} lg={12} sm={24}>
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
          <Col xl={5} lg={12} sm={24}>
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
          <Col xl={7} lg={12} sm={24}>
            <FormItem>
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
        order_id: fieldsValue.order_id || null,
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'goldEntryOrder/export',
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
            "订单金额": `${i.pay_amount_cny} ${cashType[i.currency_type]}`,
            "代币数量": `${i.pay_amount} ${coinType[i.token_id]}`,
            "平台订单号": i.order_id,
            "商户订单号": i.out_order_id,
            "承兑商姓名": i.a_user_name,
            "手续费": `${i.gas} ${coinType[i.token_id]}`,
            "订单状态": sellStatusType[i.state],
            "创建时间": moment(i.created_at)
              .local()
              .format('YYYY-MM-DD HH:mm:ss'),
          };
          dataWCN.push(dataWObj);
        });
        exportXLSX('出金订单', dataWCN);
      });
    });
  };

  confirmPayment = order_id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.goldEntryOrder.data;

    const params = {
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'goldEntryOrder/confirmPayment',
      payload: {
        order_id,
      },
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      this.handleSearch(null, params);
    });
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.goldEntryOrder.data;
    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: 'left',
        align: 'center',
        width: 300,
        render: (val, record) => {
          return (
            <span>
              {
                record.state == 1 &&
                <Fragment>
                  <Button type="primary" onClick={() => this.confirmPayment(record.order_id)}>确认已付款</Button>
                  <span style={{ display: 'inline-block', width: '10px' }}></span>
                </Fragment>
              }
              <Button>
                <Link to={`/order/goldEntryOrder_appeal/${record.order_id}`}>申诉</Link>
              </Button>
              <span style={{ display: 'inline-block', width: '10px' }}></span>
              <Button>
                <Link to={`/order/goldEntryOrder_detail/${record.order_id}`}>查看</Link>
              </Button>
            </span>
          );
        },
      },
      {
        title: '订单金额',
        dataIndex: 'pay_amount_cny',
        key: 'pay_amount_cny',
        align: 'center',
        render: (val,record) => {
          return `${val} ${cashType[record.currency_type]}`;
        }
      },
      {
        title: '代币数量',
        dataIndex: 'pay_amount',
        key: 'pay_amount',
        align: 'center',
        render: (val,record) => {
          return `${val} ${coinType[record.token_id]}`;
        }
      },
      {
        title: '平台订单号',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center',
      },
      {
        title: '商户订单号',
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
        title: '单价(CNY)',
        dataIndex: 'cny_price',
        key: 'cny_price',
        align: 'center',
      },
      {
        title: '手续费',
        dataIndex: 'gas',
        key: 'gas',
        align: 'center',
        render: (val, record) => {
          return `${val} ${coinType[record.token_id]}`
        },
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
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (val, record) => {
          return moment(val)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
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

export default GoldEntryOrder;
