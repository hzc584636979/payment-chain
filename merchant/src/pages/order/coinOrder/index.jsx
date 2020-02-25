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

@connect(({ coinOrder, loading }) => ({
  coinOrder,
  loading: loading.effects['coinOrder/fetch'],
}))
@Form.create()
class CoinOrder extends Component {
  state = {};

  interval = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coinOrder/fetch',
      payload: {
        pageSize: 10,
        page: 0,
        state: 0,
        order_type: 0,
        token_id: 0,
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
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.coinOrder.data;

    const params = {
      ...history,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'coinOrder/search',
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
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'coinOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.coinOrder.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={4} lg={12} sm={24}>
            <FormItem label="币种">
              {getFieldDecorator('token_id', { initialValue: history.token_id + '' })(
                <Select placeholder="请选择">
                  {Object.keys(coinType2).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {coinType2[value]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={12} sm={24}>
            <FormItem label="订单分类">
              {getFieldDecorator('order_type', { initialValue: history.order_type + '' })(
                <Select placeholder="请选择">
                  {Object.keys(orderType).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {orderType[value]}
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
                  {Object.keys(statusType).map(value => {
                    return (
                      <Option value={value} key={value}>
                        {statusType[value]}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} sm={24}>
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
        page: 0,
        pageSize: 10,
      };
      dispatch({
        type: 'coinOrder/export',
        payload: values,
      }).then(data => {
        if (data.status != 1) {
          message.error(data.msg);
          return;
        }
        if (data.data.list.length <= 0) {
          message.error('选择的日期内无数据');
          return;
        }
        let dataWCN = [];
        data.data.list.map(i => {
          let dataWObj = {
            "订单分类": orderType[i.type],
            "Txhash": i.txid,
            "代币数量": `${wei2USDT(i.count, i.token_id == 1 ? 'erc20' : 'omni')} ${coinType2[i.token_id]}`,
            "地址": i.to_address,
            "订单状态": statusType[i.state >= 20 ? i.state : Number(i.state)+1],
            "创建时间": moment(i.create_time * 1000)
              .local()
              .format('YYYY-MM-DD HH:mm:ss'),
          };
          dataWCN.push(dataWObj);
        });
        exportXLSX('提币、充币订单', dataWCN);
      });
    });
  };

  handleClipBoard = val => {
    if (copy(val)) {
      message.success('复制成功');
    } else {
      message.error('复制失败，请重试');
    }
  };

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.coinOrder.data;
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
                <Link to={`/order/coinOrder_detail/${record.id}`}>查看</Link>
              </Button>
            </span>
          );
        },
      },
      {
        title: '订单分类',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (val, record) => {
          return orderType[val];
        },
      },
      {
        title: 'Txhash',
        dataIndex: 'txid',
        key: 'txid',
        align: 'center',
        ellipsis: true,
        render: (val, record) => {
          return <a onClick={() => this.handleClipBoard(val)}>{val}</a>;
        },
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
        title: '地址',
        dataIndex: 'to_address',
        key: 'to_address',
        align: 'center',
        ellipsis: true,
        render: (val, record) => {
          return <a onClick={() => this.handleClipBoard(val)}>{val}</a>;
        },
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          return statusType[val >= 20 ? val : Number(val) + 1];
        },
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (val, record) => {
          return moment(val * 1000)
            .local()
            .format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '拒绝提币理由',
        dataIndex: 'refuse_reason',
        key: 'refuse_reason',
        align: 'center',
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

export default CoinOrder;
