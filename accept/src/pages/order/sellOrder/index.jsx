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

@connect(({ sellOrder, loading }) => ({
  sellOrder,
  loading: loading.effects['sellOrder/fetch'],
}))
@Form.create()
class SellOrder extends Component {
  state = {
    
  };

  interval = undefined;

  basePageSize = 100;

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
      type: 'sellOrder/fetch',
      payload:{
        pageSize: this.basePageSize,
        page: 0,
        state: 0,
        token_id: 0,
        order_id: null,
        time: [moment().startOf('month'), moment().endOf('month')],
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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.sellOrder.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'sellOrder/search',
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
        pageSize: pagination.pageSize || this.basePageSize,
      };
      dispatch({
        type: 'sellOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.sellOrder.data;
    const { exportLock } = this.state;
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
                    Object.keys(sellStatusType).map(value => {
                      return <Option value={value} key={value}>{sellStatusType[value]}</Option>
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
              <Button loading={exportLock} style={{ marginLeft: 8 }} onClick={this.exportOk}>
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  receipt = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.sellOrder.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'sellOrder/receipt',
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

  noReceipt = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.sellOrder.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    
    dispatch({
      type: 'sellOrder/noReceipt',
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

    this.setState({
      exportLock: true,
    })

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        order_id: fieldsValue.order_id || null,
        page: 0,
        pageSize: this.basePageSize,
      };
      dispatch({
        type: 'sellOrder/export',
        payload: values,
      }).then(data => {
        this.setState({
          exportLock: false,
        })
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
              "订单金额": `${i.pay_amount_cny} ${cashType[i.currency_type]}`,
              "代币数量": `${i.pay_amount} ${coinType[i.token_id]}`,
              "付款用户": i.payee_name,
              "付款方式": payName[i.pay_type],
              "平台订单号": i.order_id,
              "商户订单号": i.out_order_id,
              "收币商户": i.m_user_name,
              "订单状态": sellStatusType[i.state],
              "创建时间": moment(i.created_at).local().format('YYYY-MM-DD HH:mm:ss'),
              "订单更新时间": moment(i.updated_at).local().format('YYYY-MM-DD HH:mm:ss'),
          };
          dataWCN.push(dataWObj);
        })
        exportXLSX('出售订单', dataWCN);
      })
    });
  }

  getAging = record => {
    const time1 = new Date().getTime() - moment(record.updated_at).local().format('x');
    const time2 = Number(record.aging) * 60 * 1000;
    const lessTime = moment.duration(time2 - time1 > 0 ? time2 - time1 : 0);
    const hoursTime = 60 * 60 * 1000;
    if(lessTime <= 0) {
      /*const { pagination } = this.props.sellOrder.data;

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
    const { history, list, pagination } = this.props.sellOrder.data;
    const { exportVisible } = this.state;
    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: 'left',
        align: 'center',
        width: 300,
        render: (val, record) => {
          const time = (new Date().getTime() - moment(record.updated_at).local().format('x')) > 5 * 60 * 1000 ? true : false;
          return(
            <span>
              {
                this.getAging(record) && record.state == 2 &&
                <Fragment>
                  <Popconfirm title="是否要确认收款？" onConfirm={() => this.receipt(record.order_id)}>
                    <Button>确认收款</Button>
                  </Popconfirm>
                  {
                    time &&
                    <Fragment>
                      <span style={{display: 'inline-block', width: '10px'}}></span>
                      <Popconfirm title="是否要确认未收款？" onConfirm={() => this.noReceipt(record.order_id)}>
                        <Button>未收到收款</Button>
                      </Popconfirm>
                    </Fragment>
                  }
                </Fragment>
              }
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to={`/order/sellOrder_appeal/${record.order_id}`}>申诉</Link>
              </Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to={`/order/sellOrder_detail/${record.order_id}`}>查看</Link>
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
        title: '付款用户',
        dataIndex: 'payee_name',
        key: 'payee_name',
        align: 'center',
      },
      {
        title: '付款方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center',
        render:(val,record)=>{
          return <img src={payIcon[val]} style={{maxWidth: 40}} />;
        },
      },
      {
        title: '付款账号',
        dataIndex: 'user_pay_account',
        key: 'user_pay_account',
        align: 'center',
      },
      {
        title: '时效',
        dataIndex: 'aging',
        key: 'aging',
        align: 'center',
        render: (val, record) => {
          if(record.state == 2) {
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
        title: '收币商户',
        dataIndex: 'm_user_name',
        key: 'm_user_name',
        align: 'center',
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render:(val,record)=>{
          return sellStatusType[val];
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

export default SellOrder;
