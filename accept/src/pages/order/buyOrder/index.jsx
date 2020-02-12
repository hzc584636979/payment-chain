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
  Popover,
  Icon,
  Upload,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import StandardTable from '@/components/StandardTable';
import exportXLSX from '@/utils/exportXLSX';
import { getBase64 } from '@/utils/utils';
import moment from 'moment';
import styles from './style.less';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG文件!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片超过2MB!');
    return false;
  }
  return true;
}

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
        pageSize:1000,
        page:0,
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
        order_id: id,
        payment_screenshot: this.state.receiptImg
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.handleReceiptChange();
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
              "币种": coinType[i.token_id],
              "代币数量": i.pay_amount,
              "等值 (CNY)": i.pay_amount_cny,
              "客户姓名": i.payee_name,
              "收款方式": payName[i.pay_type],
              "平台订单号": i.order_id,
              "商户订单号": i.out_order_id,
              "商户昵称": i.m_user_name,
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

  handleUploadImg = file => {
    if(!beforeUpload(file)) return false;
    this.setState({
      handleUploadImgLoading: true
    })
    getBase64(file, imageUrl =>
      this.setState({
        receiptImg: imageUrl,
        handleUploadImgLoading: false,
      }),
    );
    return false;
  }

  handleReceiptChange = () => {
    this.setState({
      receiptChange: false,
      receiptId: null,
      receiptImg: null,
    })
  }

  handleShowReceiptImg = receiptId => {
    this.setState({
      receiptId,
    })
  }

  render() {
    const { loading } = this.props;
    const { handleUploadImgLoading, receiptImg, receiptId } = this.state;
    const { history, list, pagination } = this.props.buyOrder.data;

    const uploadButton = (
      <div>
        <Icon type={handleUploadImgLoading ? 'loading' : 'plus'} />
      </div>
    );

    const columns = [
      {
        title: '操作',
        key: 'action',
        fixed: 'left',
        align: 'center',
        width: 300,
        render: (val, record) => {
          return(
            <span>
              {
                this.getAging(record) ?
                (
                  record.state == 4 ?
                  <Fragment>
                    <Popover 
                      title={`上传支付截图`}
                      content={
                        <div style={{width: 150}}>
                          <div style={{textAlign: 'center', width: 104, margin: '0 auto'}}>
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              showUploadList={false}
                              beforeUpload={this.handleUploadImg}
                              accept={'.jpg,.jpeg,.png'}
                            >
                              { receiptImg ? <img width="50" height="50" src={receiptImg} /> : uploadButton }
                            </Upload>
                          </div>
                          <Button onClick={this.handleReceiptChange}>取消</Button>
                          <span style={{display: 'inline-block', width: '10px'}}></span>
                          <Button disabled={!receiptImg} type="primary" onClick={() => this.receipt(record.order_id)}>确定</Button>
                        </div>
                      }
                      trigger="click"
                      visible={receiptId == record.order_id ? true : false}
                    >
                      <Button onClick={() => this.handleShowReceiptImg(record.order_id)}>确认转款</Button>
                    </Popover>
                    <span style={{display: 'inline-block', width: '10px'}}></span>
                    <Button>
                      <Link to={`/order/buyOrder_appeal/${record.order_id}`}>申诉</Link>
                    </Button>
                  </Fragment>
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
                <Link to={`/order/buyOrder_detail/${record.order_id}`}>查看</Link>
              </Button>
            </span>
          );
        },
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
        title: '代币数量',
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
        title: '客户姓名',
        dataIndex: 'payee_name',
        key: 'payee_name',
        align: 'center',
      },
      {
        title: '收款二维码',
        dataIndex: 'pay_code_url',
        key: 'pay_code_url',
        align: 'center',
        render:(val,record)=>{
          return (
            val ?
            <Popover content={<img src={val} style={{maxWidth: 100}} />}>
              <Icon type="qrcode" />
            </Popover>
            :
            null
          );
        },
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
        dataIndex: 'm_user_name',
        key: 'm_user_name',
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
