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
const statusType = {
  0: '全部',
  1: '抵押中',
  2: '申请解冻中',
  3: '已退款',
  4: '拒绝退款',
};

@connect(({ depositList, loading }) => ({
  depositList,
  loading: loading.effects['depositList/fetch'],
}))
@Form.create()
class DepositList extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'depositList/fetch',
      payload:{
        pageSize:10,
        page:0,
        state: 0,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.depositList.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'depositList/search',
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
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'depositList/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.depositList.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={10} lg={12} sm={24}>
            <FormItem label="抵押状态">
              {getFieldDecorator('state',{ initialValue: history.state+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(statusType).map(value => {
                      return <Option value={value} key={value}>{statusType[value]}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={10} lg={12} sm={24}>
            <FormItem label="抵押时间">
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

  frozen = id => {
    const { dispatch } = this.props;
    const { pagination } = this.props.depositList.data;

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'depositList/frozen',
      payload: {
        order_id: id,
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
        page:0,
        pageSize:10,
      };
      dispatch({
        type: 'depositList/export',
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
              "平台订单号": i.id,
              "抵押金额(USDT)": i.pledge_amount,
              "抵押状态": statusType[i.state],
              "抵押时间": moment(i.pledge_time).local().format('YYYY-MM-DD HH:mm:ss'),
              "退款金额(USDT)": i.refund_amount,
              "退款时间": i.refund_time && moment(i.refund_time).local().format('YYYY-MM-DD HH:mm:ss'),
          };
          dataWCN.push(dataWObj);
        })
        exportXLSX('押金记录', dataWCN);
      })
    });
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.depositList.data;
    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: 'left',
        align: 'center',
        width: 100,
        render: (val, record) => {
          return(
            <span>
              {
                record.state == 1 &&
                <Popconfirm title="是否要申请解冻？" onConfirm={() => this.frozen(record.id)}>
                  <Button>申请解冻</Button>
                </Popconfirm>
              }
            </span>
          );
        },
      },
      {
        title: '平台订单号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '抵押金额(USDT)',
        dataIndex: 'pledge_amount',
        key: 'pledge_amount',
        align: 'center',
      },
      {
        title: '抵押状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render:(val,record)=>{
          return statusType[val];
        },
      },
      {
        title: '抵押时间',
        dataIndex: 'pledge_time',
        key: 'pledge_time',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss')
        }
      },
      {
        title: '退款金额(USDT)',
        dataIndex: 'refund_amount',
        key: 'refund_amount',
        align: 'center',
      },
      {
        title: '拒绝退款理由',
        dataIndex: '',
        key: '',
        align: 'center',
      },
      {
        title: '退款时间',
        dataIndex: 'refund_time',
        key: 'refund_time',
        align: 'center',
        render: (val, record) => {
          return val && moment(val).local().format('YYYY-MM-DD HH:mm:ss')
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

export default DepositList;
