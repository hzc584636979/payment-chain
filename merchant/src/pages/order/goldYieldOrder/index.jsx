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
  Icon,
  Popover,
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

@connect(({ goldYieldOrder, loading }) => ({
  goldYieldOrder,
  loading: loading.effects['goldYieldOrder/fetch'],
}))
@Form.create()
class GoldYieldOrder extends Component {
  state = {
    yieldId: null,
    MM: null,
  };

  interval = undefined;

  componentDidMount() {
    this.getViewData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query.key && this.initKey != nextProps.location.query.key) {
      this.initKey = nextProps.location.query.key;
      this.getViewData();
    }
  }

  getViewData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goldYieldOrder/fetch',
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
    const { history } = this.props.goldYieldOrder.data;

    const params = {
      ...history,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'goldYieldOrder/search',
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
        type: 'goldYieldOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.goldYieldOrder.data;

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
                  {Object.keys(buyStatusType).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {buyStatusType[value]}
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
        type: 'goldYieldOrder/export',
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
            "单价(CNY)": i.cny_price,
            "手续费": `${i.gas} ${coinType[i.token_id]}`,
            '订单状态': buyStatusType[i.state],
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

  withdraw = order_id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.goldYieldOrder.data;

    const params = {
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'goldYieldOrder/withdrawOrder',
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
  };

  yield = record => {
    const { dispatch } = this.props;
    const { MM } = this.state;
    const { pagination } = this.props.goldYieldOrder.data;

    const params = {
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    
    if (!MM) {
      message.error('请输入交易密码');
      return;
    }

    dispatch({
      type: 'goldYieldOrder/yieldOrder',
      payload: {
        order_id: record.order_id,
        payment_pwd: MM,
        token_id: record.token_id,
      },
    }).then(data => {
      if (data.status != 1) {
        message.error(data.msg);
        return;
      } else {
        message.success('操作成功');
      }
      this.handleSearch(null, params);
      this.setState({
        yieldId: null,
        MM: null,
      });
    });
  };

  button = yieldId => {
    this.setState({
      yieldId,
    });
  };

  cancelButton = yieldId => {
    this.setState({
      yieldId: null,
      MM: null,
    });
  };

  handleMM = e => {
    this.setState({
      MM: e.target.value,
    });
  };

  auditOrder = (order_id, audit_state) => {
    const { dispatch } = this.props;
    const { MM } = this.state;
    const { pagination } = this.props.goldYieldOrder.data;

    const params = {
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'goldYieldOrder/auditOrder',
      payload: {
        order_id,
        audit_state,
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
  };

  renderItem = record => {
    const { currentUser } = this.props;
    const { yieldId, MM } = this.state;
    let renderStr = record.order_id;
    if (yieldId == record.order_id) {
      renderStr = {
        children: (
          <Row type="flex" className={`${styles.itemLayer}`}>
            <Col xl={11} sm={24}>
              <Input
                type="password"
                placeholder="输入交易密码"
                maxLength={24}
                onChange={this.handleMM}
                value={MM}
                style={{ width: '25%' }}
              />
              <span style={{ display: 'inline-block', width: 15 }}></span>
              <Button type="primary" onClick={() => this.yield(record)}>
                出金
              </Button>
              <span style={{ display: 'inline-block', width: 15 }}></span>
              <Button onClick={this.cancelButton}>取消</Button>
              <span style={{ display: 'inline-block', width: 15 }}></span>
              <Input disabled={true} value={`${record.pay_amount} USDT`} style={{ width: '20%' }} />
              <span style={{ color: '#999999', padding: '0 5px' }}>
                <Icon type="swap" />
              </span>
              <Input
                disabled={true}
                value={`${record.pay_amount_cny} ${cashType[record.currency_type]}`}
                style={{ width: '20%' }}
              />
            </Col>
            <Col xl={6} sm={24}>
              <Row>
                <Col span={12}>{record.a_user_name}</Col>
                <Col span={12}>单价 {record.cny_price} CNY</Col>
              </Row>
              <Row>
                <Col span={12}>数量 {record.pay_amount} USDT</Col>
                <Col span={12}>
                  {record.min_amount} CNY - {record.max_amount} CNY
                </Col>
              </Row>
            </Col>
          </Row>
        ),
        props: {
          colSpan: 11,
        },
      };
    }
    return renderStr;
  };

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.goldYieldOrder.data;
    const { yieldId } = this.state;
    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: yieldId ? false : 'left',
        align: 'center',
        width: 300,
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return (
              <span>
                {record.state == 1 ? (
                  <Fragment>
                    <Button type="primary" onClick={() => this.auditOrder(record.order_id, 1)}>
                      审核通过
                    </Button>
                    <span style={{ display: 'inline-block', width: '10px' }}></span>
                    <Button type="danger" onClick={() => this.auditOrder(record.order_id, 2)}>
                      审核不通过
                    </Button>
                    <span style={{ display: 'inline-block', width: '10px' }}></span>
                  </Fragment>
                ) : record.state < 5 ? (
                  <Fragment>
                    <Button type="primary" onClick={() => this.withdraw(record.order_id)}>
                      撤回
                    </Button>
                    <span style={{ display: 'inline-block', width: '10px' }}></span>
                  </Fragment>
                ) : record.state == 5 ? (
                  <Fragment>
                    <Button type="primary" onClick={() => this.button(record.order_id)}>
                      出金
                    </Button>
                    <span style={{ display: 'inline-block', width: '10px' }}></span>
                  </Fragment>
                ) : null}
                <Button>
                  <Link to={`/order/goldYieldOrder_appeal/${record.order_id}`}>申诉</Link>
                </Button>
                <span style={{ display: 'inline-block', width: '10px' }}></span>
                <Button>
                  <Link to={`/order/goldYieldOrder_detail/${record.order_id}`}>查看</Link>
                </Button>
              </span>
            );
          }
        },
      },
      {
        title: '订单金额',
        dataIndex: 'pay_amount_cny',
        key: 'pay_amount_cny',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return `${val} ${cashType[record.currency_type]}`;
          }
        },
      },
      {
        title: '代币数量',
        dataIndex: 'pay_amount',
        key: 'pay_amount',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return `${val} ${coinType[record.token_id]}`;
          }
        },
      },
      /*{
        title: '支付截图',
        dataIndex: 'payment_screenshot',
        key: 'payment_screenshot',
        align: 'center',
        render: (val, record) => {
          return (
            val ?
            <Popover content={<a target="_blank" href={val}><img src={val} style={{maxWidth: 100}} /></a>}>
              <Icon type="file-image" />
            </Popover>
            :
            null
          );
        },
      },*/
      {
        title: '平台订单号',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center',
        render: (val, record) => this.renderItem(record),
      },
      {
        title: '商户订单号',
        dataIndex: 'out_order_id',
        key: 'out_order_id',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return val;
          }
        },
      },
      {
        title: '承兑商姓名',
        dataIndex: 'a_user_name',
        key: 'a_user_name',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return val;
          }
        },
      },
      {
        title: '单价(CNY)',
        dataIndex: 'cny_price',
        key: 'cny_price',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return val;
          }
        },
      },
      {
        title: '手续费',
        dataIndex: 'gas',
        key: 'gas',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return `${val} ${coinType[record.token_id]}`
          }
        },
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return buyStatusType[val];
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (val, record) => {
          if (yieldId == record.order_id) {
            return {
              children: val,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return moment(val)
              .local()
              .format('YYYY-MM-DD HH:mm:ss');
          }
        },
      },
    ];

    return (
      <ContLayout loading={loading}>
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

export default GoldYieldOrder;
