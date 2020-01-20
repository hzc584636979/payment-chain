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
  Icon,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ entryOmni, loading }) => ({
  entryOmni,
  loading: loading.effects['entryOmni/fetch'],
}))
@Form.create()
class EntryOmni extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'entryOmni/fetch',
      payload:{
        pageSize:10,
        page:0,
        state: 3,
        token_id: 2,
        order_id: null,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.entryOmni.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'entryOmni/search',
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
        page:0,
        pageSize:10,
      };
      dispatch({
        type: 'entryOmni/search',
        payload: values,
      });
    });
  };

  renderForm() {
    /*const { getFieldDecorator } = this.props.form;
    const { history } = this.props.entryOmni.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={10} lg={12} sm={24}>
            <FormItem label="支付方式">
              {getFieldDecorator('state',{ initialValue: history.state+'' })(
                <Select placeholder="请选择">
                  {
                    Object.keys(payName).map(value => {
                      return <Option value={value} key={value}>{payName[value]}</Option>
                    })
                  }
                </Select>
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
    );*/
  }

  entry = id => {
    dispatch({
      type: 'entryOmni/entry',
      payload: {
        order_id: id
      },
    });
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.entryOmni.data;
    const columns = [
      {
        title: '承兑商姓名',
        dataIndex: 'a_user_name',
        key: 'a_user_name',
        align: 'center',
      },
      {
        title: '订单金额(USDT)',
        dataIndex: 'pay_amount',
        key: 'pay_amount',
        align: 'center',
      },
      {
        title: '订单金额(CNY)',
        dataIndex: 'pay_amount_cny',
        key: 'pay_amount_cny',
        align: 'center',
      },
      {
        title: '手续费(USDT)',
        dataIndex: 'gas',
        key: 'gas',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss')
        },
      },
      {
        /*title: '操作',
        key: 'action',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (val, record) => {
          //return <Button><Link to={`/entry/entryOmni/${record.id}`}>入金</Link></Button>;
          return (
            <Popconfirm title="是否要确认入金？" onConfirm={() => this.transfer(record.order_id)}>
              <Button>入金</Button>
            </Popconfirm>
          );
        },*/
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

export default EntryOmni;