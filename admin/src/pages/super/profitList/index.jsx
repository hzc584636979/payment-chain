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
import BigNumber from 'bignumber.js';
import styles from './style.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateAddForm = Form.create()(props => {
  const { modalVisible, form, submit, cancel } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submit(fieldsValue);
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    cancel();
  }

  return (
    <Modal
      title="添加合伙人"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
      centered
      okText='确认'
    >
      <Form>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="合伙人">
          {form.getFieldDecorator('user_name', {
            rules: [{ required: true, message: '请输入合伙人姓名' }],
          })(<Input placeholder="请输入合伙人姓名" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="钱包地址">
          {form.getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入合伙人钱包地址' }],
          })(<Input placeholder="请输入合伙人钱包地址" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ profitList, loading }) => ({
  profitList,
  loading: loading.effects['profitList/fetch'],
}))
@Form.create()
class ProfitList extends Component {
  state = {
    selectedRowKeys: [],
    editData: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profitList/fetch',
      payload:{
        pageSize: 999,
        page: 0,
        search_value: null,
      },
    })
  }

  componentWillUnmount() {
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { history } = this.props.profitList.data;

    const params = {
      ...history,
      page: pagination.current -1,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'profitList/search',
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
        search_value: fieldsValue.search_value || null,
        page: pagination.page || 0,
        pageSize: pagination.pageSize || 999,
      };
      dispatch({
        type: 'profitList/search',
        payload: values,
      }).then(data => {
        this.handleSelectRows([])
      })
    });
  };

  handleEdit = () => {
    this.setState({
      editStatus: true,
      editData: null
    })
  }

  handleEditCancel = () => {
    this.setState({
      editStatus: false,
      editData: null,
    })
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.profitList.data;
    const { selectedRowKeys, editStatus } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={24} lg={24} sm={24} style={{textAlign: 'right'}}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              {
                !editStatus ?
                  <Fragment>
                    <Button onClick={this.handleAddModalVisible} type="primary">
                      添加
                    </Button>
                    <Button onClick={this.handleEdit} type="primary" style={{ marginLeft: 8 }}>
                      编辑
                    </Button>
                    <Button onClick={this.delete} type="danger" disabled={selectedRowKeys.length > 0 ? false : true} style={{ marginLeft: 8 }}>
                      删除
                    </Button>
                  </Fragment>
                  :
                  <Fragment>
                    <Button onClick={this.handleSubmit} type="primary">
                      提交
                    </Button>
                    <Button onClick={this.handleEditCancel} style={{ marginLeft: 8 }}>
                      取消
                    </Button>
                  </Fragment>
              }
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

  add = arg => {
    const { dispatch } = this.props;
    const { pagination } = this.props.profitList.data;
    const params = {
      page: 0,
      pageSize: 999,
    };

    dispatch({
      type: 'profitList/add',
      payload: arg,
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

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;

    const params = {
      page: 0,
      pageSize: 999,
    };
    dispatch({
      type: 'profitList/delete',
      payload: {
        users: selectedRowKeys
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

  addCancel = () => {
    this.setState({
      'addVisible': false,
    });
  }

  handleAddModalVisible = (type) => {
    this.setState({
      'addVisible': true,
    });
  }

  handleEditData = (e, key, index) => {
    const { list } = this.props.profitList.data;
    const { editData } = this.state;
    let newList = editData || JSON.parse(JSON.stringify(list));

    if(key == 'profit') {
      if(!(Number(e.target.value)) && e.target.value != 0) {
        message.error('请输入数字的利润比');
        return;
      }else if(e.target.value.indexOf('.') > -1 && e.target.value.split('.')[1].length == 0) {
        newList[index][key] = (new BigNumber(Number(e.target.value.split('.')[0])).dividedBy(100).toNumber()) + '.';
        console.log()
      }else {
        newList[index][key] = new BigNumber(Number(e.target.value)).dividedBy(100).toNumber();
      }
    }else {
      newList[index][key] = e.target.value;
    }

    this.setState({
      editData: [...newList]
    })
  }

  checkTotalNum = list => {
    let total = 0;
    for(let i = 0; i < list.length; i++) {
      console.log(list[i].profit)
      if((!Number(list[i].profit) && list[i].profit != 0) 
        || list[i].profit.toString().split('.').length > 2
        || list[i].profit.toString() == '0.'
      ) {
        message.error('利润比不是数字');
        return false;
      }
      total = new BigNumber(total).plus(new BigNumber(Number(list[i].profit))).toNumber();
    }
    if(total != 1) {
      message.error('利润比总和必须等于100%，请修改后提交')
    }
    console.log(total)
    return total == 1 ? true : false;
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { list } = this.props.profitList.data;
    const { editData } = this.state;
    const newList = editData || list;

    if(!this.checkTotalNum(newList)) {
      return;
    }

    const params = {
      page: 0,
      pageSize: 999,
    };
    dispatch({
      type: 'profitList/modify',
      payload: {
        editData: newList,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.handleEditCancel();
      this.handleSearch(null, params);
    })
  }

  render() {
    const { loading } = this.props;
    const { history, list, pagination } = this.props.profitList.data;
    const { selectedRowKeys, addVisible, editStatus, editData } = this.state;

    const addMethods = {
      submit: this.add,
      cancel: this.addCancel,
    };

    const columns = [
      {
        title: '合伙人',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center',
        render: (val, record, index) => {
          if(editStatus) {
            return <Input value={val} onChange={e => this.handleEditData(e, 'user_name', index)} />
          }else {
            return val;
          }
        },
      },
      {
        title: '钱包地址',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
        render: (val, record, index) => {
          if(editStatus) {
            return <Input value={val} onChange={e => this.handleEditData(e, 'address', index)} />
          }else {
            return val;
          }
        },
      },
      {
        title: '利润比',
        dataIndex: 'profit',
        key: 'profit',
        align: 'center',
        render: (val, record, index) => {
          if(editStatus) {
            if(typeof val == 'string') {
              const newVal = new BigNumber(val.substr(0, val.lastIndexOf('.'))).multipliedBy(100).toNumber();
              return <span><Input style={{width: 100}} value={newVal+'.'} onChange={e => this.handleEditData(e, 'profit', index)} />%</span>;
            }else {
              return <span><Input style={{width: 100}} value={new BigNumber(val).multipliedBy(100).toNumber()} onChange={e => this.handleEditData(e, 'profit', index)} />%</span>;
            }
          }else {
            return <span style={{color: '#EA8A00'}}>{`${val * 100}%`}</span>;
          }
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
            data={{ list: editData || list, pagination: false }}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        <CreateAddForm {...addMethods} modalVisible={ addVisible } />
      </ContLayout>
    );
  }
}

export default ProfitList;
