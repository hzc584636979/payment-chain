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

@connect(({ buyOrder, loading }) => ({
  buyOrder,
  loading: loading.effects['buyOrder/fetch'],
}))
@Form.create()
class BuyOrder extends Component {
  state = {
    
  };

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrder/fetch',
      payload:{
        pageSize:10,
        page:0,
        state: 0,
        token_id: 0,
        order_id: null,
        time: [moment().startOf('day'), moment().endOf('day')],
      },
    }).then(data => {
      let count = 0;
      this.interval = window.setInterval(() => {
        count += 1;
        this.setState({
          count,
        });
      }, 1000);
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.buyOrder.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'buyOrder/search',
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
        order_id: fieldsValue.order_id || null,
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'buyOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.buyOrder.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={5} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('order_id',{ initialValue: history.order_id })(<Input placeholder="平台订单号" />)}
            </FormItem>
          </Col>
          <Col xl={3} lg={12} sm={24}>
            <FormItem label="币种">
              {getFieldDecorator('token_id',{ initialValue: history.token_id+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(coinType).map(value => {
                      return <Option value={value} key={value}>{coinType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={12} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('state',{ initialValue: history.state+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(buyStatusType).map(value => {
                      return <Option value={value} key={value}>{buyStatusType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={7} lg={12} sm={24}>
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
              <Button style={{ marginLeft: 8 }} onClick={this.exportOk}>
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  transfer = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.buyOrder.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'buyOrder/transfer',
      payload: {
        order_id: id
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

  receipt = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.buyOrder.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'buyOrder/receipt',
      payload: {
        order_id: id
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

  exportOk = fieldsValue => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        order_id: fieldsValue.order_id || null,
        page:0,
        pageSize:10,
      };
      dispatch({
        type: 'buyOrder/export',
        payload: values,
      }).then(data => {
        if(data.status != 1) {
          message.error(data.msg);
          return;
        }else {
          message.success('操作成功');
        }
        if(data.data.rows.length <= 0){
          message.error('选择的日期内无数据');
          return;
        }
        let dataWCN = [];
        data.data.rows.map((i) => {
          let dataWObj = {
              "平台订单号": i.order_id,
              "商户订单号": i.out_order_id,
              "商户昵称": i.payee_name,
              "商户账号": i.payee_account,
              "币种": coinType[i.token_id],
              "商户出售金额 (USDT)": i.pay_amount,
              "等值 (CNY)": i.pay_amount_cny,
              "订单状态": buyStatusType[i.state],
              "创建时间": moment(i.created_at).local().format('YYYY-MM-DD HH:mm:ss'),
              "订单更新时间": moment(i.updated_at).local().format('YYYY-MM-DD HH:mm:ss'),
          };
          dataWCN.push(dataWObj);
        })
        exportXLSX('购买订单', dataWCN);
      })
    });
  }

  getAging = record => {
    const time1 = new Date().getTime() - moment(record.updated_at).local().format('x');
    const time2 = Number(record.aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);
    const hoursTime = 60 * 60 * 1000;

    if(lessTime <= 0) {
      /*const { pagination } = this.props.buyOrder.data;

      const params = {
        page: pagination.current -1,
        pageSize: pagination.pageSize,
      };

      this.handleSearch(null, params);*/
      return false;
    }else {
      return <span style={{color: '#EA0000'}}>{lessTime >= hoursTime ? `${lessTime.hours()} : ${lessTime.minutes()} : ${lessTime.seconds()}` : `${lessTime.minutes()} : ${lessTime.seconds()}`}</span>;
    }
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.buyOrder.data;
    const columns = [
      {
        title: '时效',
        dataIndex: 'aging',
        key: 'aging',
        align: 'center',
        render: (val, record) => {
          if(record.state == 4 || record.state == 3) {
            return this.getAging(record) || <span style={{color: '#EA0000'}}>0 : 0</span>;
          }else {
            return EXHIBITION2;
          }
        },
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
        title: '商户昵称',
        dataIndex: 'payee_name',
        key: 'payee_name',
        align: 'center',
      },
      {
        title: '商户账号',
        dataIndex: 'payee_account',
        key: 'payee_account',
        align: 'center',
      },
      {
        title: '币种',
        dataIndex: 'token_id',
        key: 'token_id',
        align: 'center',
        render: (val,record) => {
          return coinType[val];
        }
      },
      {
        title: '商户出售金额 (USDT)',
        dataIndex: 'pay_amount',
        key: 'pay_amount',
        align: 'center',
      },
      {
        title: '等值 (CNY)',
        dataIndex: 'pay_amount_cny',
        key: 'pay_amount_cny',
        align: 'center',
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          return buyStatusType[val];
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '订单更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
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
              {
                this.getAging(record) ?
                (
                  record.state == 4 ?
                  <Popconfirm title="是否要确认转款？" onConfirm={() => this.receipt(record.order_id)}>
                    <Button>确认转款</Button>
                  </Popconfirm>
                  :
                  record.state == 3 ?
                  <Popconfirm title="是否要确认接单？" onConfirm={() => this.transfer(record.order_id)}>
                    <Button>确认接单</Button>
                  </Popconfirm>
                  :
                  null
                )
                :
                null
              }
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to={`/order/buyOrder_appeal/${record.order_id}`}>申述</Link>
              </Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to={`/order/buyOrder_detail/${record.order_id}`}>查看</Link>
              </Button>
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
            data={{ list, pagination }}
            columns={columns}
            onChange={this.handleStandardTableChange}
            scroll={list && list.length > 0 ? { x: 2000 } : {}}
          />
        </div>
        <a style={{display: 'none'}} href="" download id="hf">导出</a>
      </ContLayout>
    );
  }
}

export default BuyOrder;
