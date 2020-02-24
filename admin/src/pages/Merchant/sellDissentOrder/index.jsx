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

@connect(({ merchantSellDissentOrder, loading }) => ({
  merchantSellDissentOrder,
  loading: loading.effects['merchantSellDissentOrder/fetch'],
}))
@Form.create()
class MerchantSellDissentOrder extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchantSellDissentOrder/fetch',
      payload:{
        pageSize: 10,
        page: 0,
        order_id: null,
      },
    })
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.merchantSellDissentOrder.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'merchantSellDissentOrder/search',
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
        type: 'merchantSellDissentOrder/search',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.merchantSellDissentOrder.data;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={8} lg={12} sm={24}>
            <FormItem>
              {getFieldDecorator('order_id',{ initialValue: history.order_id })(<Input placeholder="平台订单号" />)}
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
    const { history, list, pagination } = this.props.merchantSellDissentOrder.data;
    const columns = [
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
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '问题类型',
        dataIndex: '',
        key: '',
        align: 'center',
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
        dataIndex: 'm_user_name1',
        key: 'm_user_name1',
        align: 'center',
      },
      {
        title: '商户姓名',
        dataIndex: 'm_user_name2',
        key: 'm_user_name2',
        align: 'center',
      },
      {
        title: '客户姓名',
        dataIndex: 'm_user_name3',
        key: 'm_user_name3',
        align: 'center',
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
        title: '订单状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (val, record) => {
          return sellStatusType[val];
        }
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (val, record) => {
          return(
            <span>
              <Button>
                <Link to={`/Merchant/sellDissentOrder_detail/${record.order_id}`}>查看</Link>
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
          />
        </div>
      </ContLayout>
    );
  }
}

export default MerchantSellDissentOrder;
