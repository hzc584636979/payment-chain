import { Button, Descriptions, Input, Select, Upload, Icon, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;
const statusType = {
  '金额问题': '金额问题',
  '流程问题': '流程问题',
  '异常问题': '异常问题',
  '投诉承兑商': '投诉承兑商',
};

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

@connect(({ goldEntryOrderAppeal, loading }) => ({
  goldEntryOrderAppeal,
  fetchLoading: loading.effects['goldEntryOrderAppeal/fetch'],
}))
class GoldEntryOrderAppeal extends Component {
  state = {
    loading: false,
    fileList: [],
    type: '',
    desc: '',
    submitLock: false,
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleChange = file => {
    if(!beforeUpload(file)) return false;
    getBase64(file, imageUrl => {
      if(!imageUrl) {
        this.setState({
          loading: false,
        });
        return;
      }
      this.setState({
        fileList: [
          ...this.state.fileList,
          imageUrl,
        ],
        upLock: this.state.fileList.length < 2 ? false : true,
        loading: false,
      })
    });
    return false;
  }

  handleSelect = e => {
    console.log(e)
    this.setState({
      type: e
    })
  }

  handleDesc = e => {
    this.setState({
      desc: e.target.value
    })
  }

  submit = () => {
    const { fileList, type, desc } = this.state;

    if(fileList.length == 0) {
      message.error('请上传图片后提交');
      return;
    }else if(type == '') {
      message.error('请选择问题类型后提交');
      return;
    }else if(desc == '') {
      message.error('请填写申诉描述后提交');
      return;
    }

    this.setState({
      submitLock: true,
    })
    
    const { dispatch } = this.props;
    dispatch({
      type: 'goldEntryOrderAppeal/submit',
      payload: {
        issue_file: fileList,
        issue_type: type,
        issue_desc: desc
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        submitLock: false,
      })
    })
  }

  render() {
    const { fetchLoading } = this.props;
    const { upLock, submitLock, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
      </div>
    );

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label={<span className={styles.itemLabel}>问题类型</span>}>
              <Select placeholder="请选择问题类型" style={{width: 280, maxWidth: '100%'}} onChange={this.handleSelect}>
                {
                  Object.keys(statusType).map(value => {
                    return <Option value={value} key={value}>{statusType[value]}</Option>
                  })
                }
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>申诉描述</span>} className={styles.textTop} style={{}}>
              <TextArea placeholder="请输入申诉描述" onChange={this.handleDesc} style={{width: 511, height: 162, maxWidth: '100%'}} />
            </Descriptions.Item>
            <Descriptions.Item label={<span className={styles.itemLabel}>上传图片</span>} className={styles.textTop}>
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={true}
                beforeUpload={this.handleChange}
                disabled={upLock}
                multiple={true}
                accept={'.jpg,.jpeg,.png'}
              >
                {!submitLock && !upLock && uploadButton}
              </Upload>
              <div className={styles.upImgDesc}>图片上传限制:最多3张，最大2MB</div>
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button type="primary" loading={submitLock || loading} onClick={this.submit}>确定提交</Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to="/order/goldEntryOrder?history">返回</Link>
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default GoldEntryOrderAppeal;
