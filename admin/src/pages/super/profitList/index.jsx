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
          {form.getFieldDecorator('remark', {
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
    totalError: null
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profitList/fetch',
    }).then(data => {
      let total = 0;
      for(let i = 0; i < data.list.length; i++) {
        total = new BigNumber(total).plus(new BigNumber(Number(data.list[i].ratio))).toNumber();
      }
      if(total != 10000) {
        this.setState({
          totalError: '当前利润比总和不等于100%，请及时修改避免造成分配问题'
        })
      }else {
        this.setState({
          totalError: null
        })
      }
    })
  }

  componentWillUnmount() {
    
  }

  handleSearch = () => {
    dispatch({
      type: 'profitList/fetch',
      payload: values,
    }).then(data => {
      this.handleSelectRows([])
    })
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
    const { selectedRowKeys, editStatus, totalError } = this.state;

    return (
      <Form layout="inline">
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
    const { list } = this.props.profitList.data;
    const { selectedRowKeys } = this.state;
    let newList = JSON.parse(JSON.stringify(list));

    newList.push({
      address: arg.address,
      ratio: 0,
      remark: arg.remark,
    })

    dispatch({
      type: 'profitList/modify',
      payload: {
        accounts: JSON.stringify(newList)
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.handleSearch();
    })
  }

  delete = () => {
    const { dispatch } = this.props;
    const { list } = this.props.profitList.data;
    const { selectedRowKeys } = this.state;
    let newList = JSON.parse(JSON.stringify(list));
    let dataList = [];

    selectedRowKeys.map(k => {
      delete newList[k]
    })

    newList.map(v => {
      v && dataList.push(v);
    })
    
    dispatch({
      type: 'profitList/modify',
      payload: {
        accounts: JSON.stringify(dataList)
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.handleSearch();
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

    if(key == 'ratio') {
      if(!(Number(e.target.value)) && e.target.value != 0) {
        message.error('请输入数字的利润比');
        return;
      }else if(e.target.value.indexOf('.') > -1 && e.target.value.split('.')[1].length == 0) {
        newList[index][key] = (new BigNumber(Number(e.target.value.split('.')[0])).multipliedBy(100).toNumber()) + '.';
      }else if(e.target.value.indexOf('.') > -1 && e.target.value.split('.')[1].length > 2) {
        message.error('利润比的小数不能超过2位');
        return;
      }else {
        newList[index][key] = new BigNumber(Number(e.target.value)).multipliedBy(100).toNumber();
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
      console.log(list[i].ratio)
      if((!Number(list[i].ratio) && list[i].ratio != 0) 
        || list[i].ratio.toString().split('.').length > 2
        || list[i].ratio.toString() == '0.'
      ) {
        message.error('利润比不是数字');
        return false;
      }
      total = new BigNumber(total).plus(new BigNumber(Number(list[i].ratio))).toNumber();
    }
    if(total != 10000) {
      message.error('利润比总和必须等于100%，请修改后提交')
    }
    console.log(total)
    return total == 10000 ? true : false;
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { list } = this.props.profitList.data;
    const { editData } = this.state;
    const newList = editData || list;

    if(!this.checkTotalNum(newList)) {
      return;
    }

    dispatch({
      type: 'profitList/modify',
      payload: {
        accounts: JSON.stringify(newList),
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
        return;
      }else {
        message.success('操作成功');
      }
      this.setState({
        totalError: null
      })
      this.handleEditCancel();
      this.handleSearch();
    })
  }

  render() {
    const { loading } = this.props;
    const { list } = this.props.profitList.data;
    const { selectedRowKeys, addVisible, editStatus, editData, totalError } = this.state;

    const addMethods = {
      submit: this.add,
      cancel: this.addCancel,
    };

    const columns = [
      {
        title: '合伙人',
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
        render: (val, record, index) => {
          if(editStatus) {
            return <Input value={val} onChange={e => this.handleEditData(e, 'remark', index)} />
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
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'center',
        render: (val, record, index) => {
          if(editStatus) {
            if(typeof val == 'string') {
              const newVal = new BigNumber(val.substr(0, val.lastIndexOf('.'))).dividedBy(100).toNumber();
              return <span><Input style={{width: 100}} value={newVal+'.'} onChange={e => this.handleEditData(e, 'ratio', index)} />%</span>;
            }else {
              return <span><Input style={{width: 100}} value={new BigNumber(val).dividedBy(100).toNumber()} onChange={e => this.handleEditData(e, 'ratio', index)} />%</span>;
            }
          }else {
            return <span style={{color: '#EA8A00'}}>{`${new BigNumber(val).dividedBy(100).toNumber()}%`}</span>;
          }
        },
      },
    ];

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          {
            totalError &&
            <div className={styles.errMsg}>{ totalError }</div>
          }
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
