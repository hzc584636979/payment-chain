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
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusType = {
  0: '0',
  1: '1',
};

import weixin from '@/assets/icon_saoma_weixin.png';
import yinlian from '@/assets/icon_saoma_yinlian.png';
import zhifubao from '@/assets/icon_saoma_zhifubao.png';
const payIcon = {
  0: weixin,
  1: yinlian,
  2: zhifubao,
}

@connect(({ sellDissentOrder, loading }) => ({
  sellDissentOrder,
  loading: loading.effects['sellDissentOrder/fetch'],
}))
@Form.create()
class SellDissentOrder extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    /*dispatch({
      type: 'sellDissentOrder/fetch',
      payload:{pageSize:10,page:0},
    });*/
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current -1,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    dispatch({
      type: 'sellDissentOrder/search',
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
        time: fieldsValue.time && fieldsValue.time.valueOf(),
        page:0,
        pageSize:10,
      };
      dispatch({
        type: 'sellDissentOrder/search',
        payload: values,
      });

      delete values.page;
      delete values.pageSize;
      this.setState({
        formValues: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.sellDissentOrder.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={10} lg={12} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status',{ initialValue: history.status })(
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
            <FormItem label="创建时间">
              {getFieldDecorator('time',{ initialValue: history.time })(
                <DatePicker format={'YYYY-MM-DD'} style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={12} sm={24}>
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

  receipt = id => {
    dispatch({
      type: 'sellDissentOrder/receipt',
      payload: {id},
    });
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.sellDissentOrder.data;
    const columns = [
      {
        title: '内部订单号',
        dataIndex: 'internalOrder',
        key: 'internalOrder',
        align: 'center',
      },
      {
        title: '外部订单号',
        dataIndex: 'externalOrder',
        key: 'externalOrder',
        align: 'center',
      },
      {
        title: '付款姓名',
        dataIndex: 'payName',
        key: 'payName',
        align: 'center',
      },
      {
        title: '客户收款方式',
        dataIndex: 'way',
        key: 'way',
        align: 'center',
        render:(val,record)=>{
          return <img src={payIcon[val]} />;
        },
      },
      {
        title: '客户收款昵称',
        dataIndex: 'customerNickname',
        key: 'customerNickname',
        align: 'center',
      },
      {
        title: '收款账户',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '开户行',
        dataIndex: 'bank',
        key: 'bank',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render:(val,record)=>{
          return statusType[val];
        },
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
                <Link to={`/dissentOrder/sellOrder_detail/${record._id}`}>查看</Link>
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
            scroll={{ x: 1400 }}
          />
        </div>
      </ContLayout>
    );
  }
}

export default SellDissentOrder;
