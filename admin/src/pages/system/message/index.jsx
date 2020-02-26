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

@connect(({ systemMessage, loading }) => ({
  systemMessage,
  loading: loading.effects['systemMessage/fetch'],
}))
@Form.create()
class SystemMessage extends Component {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMessage/fetch',
      payload:{
        pageSize:10,
        page:0,
        time: [moment().startOf('day'), moment().endOf('day')],
      },
    })
  }

  componentWillUnmount() {
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.systemMessage.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'systemMessage/search',
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
        type: 'systemMessage/search',
        payload: values,
      }).then(data => {
        this.handleSelectRows([])
      })
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.systemMessage.data;
    const { selectedRowKeys } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={12} lg={12} sm={24}>
            <FormItem label="发布时间">
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
            </span>
          </Col>
          <Col xl={8} lg={12} sm={24} style={{textAlign: 'right'}}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button onClick={this.delete} type="danger" disabled={selectedRowKeys.length > 0 ? false : true} style={{ marginLeft: 8 }}>
                删除
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleSelectRows = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    });
  };

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    const params = {
      page: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'systemMessage/delete',
      payload: {
        message_ids: selectedRowKeys
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
    const { history, list, pagination } = this.props.systemMessage.data;
    const { selectedRowKeys } = this.state;

    const columns = [
      {
        title: '发布时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        render: (val, record) => {
          return moment(val).local().format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '消息标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (val, record) => {
          return(
            <span>
              <Button>
                <Link to={`/system/message_detail/${record.id}`}>查看</Link>
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
            selectedRowKeys={selectedRowKeys}
            rowKey={'id'}
            onSelectRow={this.handleSelectRows}
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

export default SystemMessage;
