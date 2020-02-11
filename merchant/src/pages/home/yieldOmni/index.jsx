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

@connect(({ user, yieldOmni, loading }) => ({
  currentUser: user.currentUser,
  yieldOmni,
  loading: loading.effects['yieldOmni/fetch'],
}))
@Form.create()
class YieldOmni extends Component {
  state = {
    yieldId: null,
    MM: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'yieldOmni/fetch',
      payload: {
        pageSize: 10,
        page: 0,
        state: 5,
        token_id: 2,
        order_id: null,
        time: [moment().startOf('month'), moment().endOf('month')],
      },
    });
  }

  componentWillUnmount() {}

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.yieldOmni.data;

    const params = {
      ...history,
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'yieldOmni/search',
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
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 10,
      };
      dispatch({
        type: 'yieldOmni/search',
        payload: values,
      });
    });
  };

  renderForm() {
    /*const { getFieldDecorator } = this.props.form;
    const { history } = this.props.yieldOmni.data;
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

  yield = record => {
    const { dispatch } = this.props;
    const { MM } = this.state;
    const { pagination } = this.props.yieldOmni.data;

    const params = {
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'yieldErc20/yield',
      payload: {
        order_id: record.order_id,
        payment_pwd: MM,
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

  renderItem = record => {
    const { currentUser } = this.props;
    const { yieldId, MM, coin } = this.state;
    let renderStr = record.a_user_name;
    /*let payType = record.pay_type == 1 ? currentUser.bank : record.pay_type == 2 ? currentUser.zhifubao : currentUser.weixin;
    const bank = true;
    if(yieldId == record.order_id) {
      if(bank) {
        renderStr = {
          children: (
            <Row gutter={24} type="flex" justify="space-between" className={`${styles.itemLayer}`}>
              <Col xl={10} sm={24}>
                <Row>
                  <Col span={12}>金三胖</Col>
                  <Col span={12}>7.00 CNY</Col>
                </Row>
                <Row>
                  <Col span={12}>数量 100.00 USDT</Col>
                  <Col span={12}>5000.00 - 8000.00 CNY</Col>
                </Row>
              </Col>
              <Col xl={14} sm={24}>
                <Input placeholder="0.00CNY" onChange={this.handleCNY} value={CNY} style={{width: '20%'}} />
                <span style={{color: '#999999',padding: '0 5px'}}><Icon type="swap" /></span>
                <Input placeholder="0.00USDT" onChange={this.handleDB} value={DB} style={{width: '20%'}} />
                <span style={{display: 'inline-block', width: 15}}></span>
                <Input type="password" placeholder="输入资金密码" onChange={this.handleMM} value={MM} style={{width: '20%'}} />
                <span style={{display: 'inline-block', width: 15}}></span>
                <Button type="primary" onClick={() => this.yield(record.order_id)}>出金</Button>
                <span style={{display: 'inline-block', width: 15}}></span>
                <Button onClick={this.cancelButton}>取消</Button>
              </Col>
            </Row>
          ),
          props: {
            colSpan: 7,
          },
        }
      }else {
        renderStr = {
          children: (
            <Row gutter={24} type="flex" align="middle" justify="space-between" className={`${styles.itemLayer}`}>
              <Col xl={10} sm={24}>
                <Row>
                  <Col span={12}>金三胖</Col>
                </Row>
                <Row>
                  <Col span={12}>数量 100.00 USDT</Col>
                </Row>
              </Col>
              <Col xl={14} sm={24}>
                <span style={{marginRight: 15}}>承兑商仅支持{ payName[record.pay_type] }向您付款，您需要添加{ payName[record.pay_type] }支付方式</span>
                <Link to="/account">去添加</Link>
                <span style={{color: '#999999',padding: '0 15px'}}>|</span>
                <span style={{color: '#999999'}} onClick={this.cancelButton}>取消</span>
              </Col>
            </Row>
          ),
          props: {
            colSpan: 7,
          },
        }
      }
    }*/
    if (yieldId == record.order_id) {
      renderStr = {
        children: (
          <Row gutter={24} type="flex" justify="space-between" className={`${styles.itemLayer}`}>
            <Col xl={10} sm={24}>
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
            <Col xl={14} sm={24}>
              <Input disabled={true} value={`${record.pay_amount} USDT`} style={{ width: '15%' }} />
              <span style={{ color: '#999999', padding: '0 5px' }}>
                <Icon type="swap" />
              </span>
              <Input
                disabled={true}
                value={`${record.pay_amount_cny} CNY`}
                style={{ width: '15%' }}
              />
              <span style={{ display: 'inline-block', width: 15 }}></span>
              <Input
                type="password"
                placeholder="输入交易密码"
                maxLength={8}
                onChange={this.handleMM}
                value={MM}
                style={{ width: '20%' }}
              />
              <span style={{ display: 'inline-block', width: 15 }}></span>
              <Button type="primary" onClick={() => this.yield(record)}>
                出金
              </Button>
              <span style={{ display: 'inline-block', width: 15 }}></span>
              <Button onClick={this.cancelButton}>取消</Button>
            </Col>
          </Row>
        ),
        props: {
          colSpan: 7,
        },
      };
    }
    return renderStr;
  };

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.yieldOmni.data;
    const { yieldId } = this.state;
    const columns = [
      {
        title: '承兑商姓名',
        dataIndex: 'a_user_name',
        key: 'a_user_name',
        align: 'center',
        render: (val, record) => this.renderItem(record),
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
            return val;
          }
        },
      },
      {
        title: '订单金额(CNY)',
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
      {
        title: '操作',
        key: 'action',
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
            return (
              <Button type="primary" onClick={() => this.button(record.order_id)}>
                出金
              </Button>
            );
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
          />
        </div>
      </ContLayout>
    );
  }
}

export default YieldOmni;
