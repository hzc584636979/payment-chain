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

@connect(({ buyDissentOrder, loading }) => ({
  buyDissentOrder,
  loading: loading.effects['buyDissentOrder/fetch'],
}))
@Form.create()
class BuyDissentOrder extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyDissentOrder/fetch',
      payload:{
        pageSize:10,
        page:0,
        state: 0,
        token_id: 0,
        issue_state: 0,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.buyDissentOrder.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'buyDissentOrder/search',
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
        page: pagination.page || 0,
        pageSize: pagination.pageSize || this.basePageSize,
      };
      dispatch({
        type: 'buyDissentOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.buyDissentOrder.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
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
          <Col xl={8} lg={12} sm={24}>
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
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
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

  exportOk = fieldsValue => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        page:0,
        pageSize:10,
      };
      dispatch({
        type: 'buyDissentOrder/export',
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
              "订单创建时间": moment(i.created_at).local().format('YYYY-MM-DD HH:mm:ss'),
              "异议时间": moment(i.issue_create_time).local().format('YYYY-MM-DD HH:mm:ss'),
              "问题类型": i.issue_type,
              "平台订单号": i.order_id,
              "唯一标示号": i.out_order_id,
              "客户姓名": i.payee_name,
              "收款方式": payName[i.pay_type],
              "商户昵称": i.m_user_name,
              "订单金额": `${i.pay_amount_cny} ${cashType[i.currency_type]}`,
              "代币数量": `${i.pay_amount} ${coinType[i.token_id]}`,
              "订单状态": buyStatusType[i.state],
          };
          dataWCN.push(dataWObj);
        })
        exportXLSX('异议购买订单', dataWCN);
      })
    });
  }

  receiptFromMerchant = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.buyDissentOrder.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };
    dispatch({
      type: 'buyDissentOrder/receiptFromMerchant',
      payload: {
        order_id: id,
        payment_screenshot: null
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
    const { history, list, pagination } = this.props.buyDissentOrder.data;
    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: 'left',
        align: 'center',
        width: 200,
        render: (val, record) => {
          return(
            <span>
              {
                record.state == 7 &&
                <Fragment>
                  <Popconfirm title="是否要确认成交？" onConfirm={() => this.receiptFromMerchant(record.order_id)}>
                    <Button>确认成交</Button>
                  </Popconfirm>
                  <span style={{display: 'inline-block', width: '10px'}}></span>
                </Fragment> 
              }
              <Button>
                <Link to={`/dissentOrder/buyOrder_detail/${record.order_id}`}>查看</Link>
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
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '异议时间',
        dataIndex: 'issue_create_time',
        key: 'issue_create_time',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '问题类型',
        dataIndex: 'issue_type',
        key: 'issue_type',
        align: 'center',
        render: (val, record) => {
          return val
        }
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
        title: '客户姓名',
        dataIndex: 'payee_name',
        key: 'payee_name',
        align: 'center',
      },
      {
        title: '收款方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center',
        render:(val,record)=>{
          return <img src={payIcon[val]} style={{maxWidth: 40}} />;
        },
      },
      {
        title: '商户昵称',
        dataIndex: 'm_user_name',
        key: 'm_user_name',
        align: 'center',
      },
      {
        title: '订单金额/代币数量',
        dataIndex: 'pay_amount_cny',
        key: 'pay_amount_cny',
        align: 'center',
        render: (val,record) => {
          return `${val} ${cashType[record.currency_type]}/${record.pay_amount} ${coinType[record.token_id]}`;
        }
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          return buyStatusType[val];
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
            scroll={list && list.length > 0 ? { x: 1400 } : {}}
          />
        </div>
        <a style={{display: 'none'}} href="" download id="hf">导出</a>
      </ContLayout>
    );
  }
}

export default BuyDissentOrder;
