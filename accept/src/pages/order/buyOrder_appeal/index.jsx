import { Button, Descriptions, Input, Select, Upload, Icon, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;
const statusType = {
  0: '0',
  1: '1',
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('Image must smaller than 5MB!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({ buyOrderAppeal, loading }) => ({
  buyOrderAppeal,
  fetchLoading: loading.effects['buyOrderAppeal/fetch'],
}))
class BuyOrderAppeal extends Component {
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

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          fileList: info.fileList,
          upLock: info.fileList.length < 5 ? false : true,
          loading: false,
        }),
      );
    }
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
    if(fileList.length == 0 || type == '' || desc == ''){
      message.error('请填写完整信息后提交');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'buyOrderAppeal/submit',
      payload: {
        fileList,
        type,
        desc
      },
    }).then(data => {
      this.setState({
        submitLock: true,
      })
    })
  }

  render() {
    const { fetchLoading } = this.props;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
      </div>
    );
    const { upLock, submitLock } = this.state;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <Descriptions column={1}>
            <Descriptions.Item label="问题类型">
              <Select placeholder="请选择问题类型" style={{width: 280, maxWidth: '100%'}} onChange={this.handleSelect}>
                {
                  Object.keys(statusType).map(value => {
                    return <Option value={value} key={value}>{statusType[value]}</Option>
                  })
                }
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="申诉描述" className={styles.textTop} style={{}}>
              <TextArea onChange={this.handleDesc} style={{width: 511, height: 162, maxWidth: '100%'}} />
            </Descriptions.Item>
            <Descriptions.Item label="上传图片" className={styles.textTop}>
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={true}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                disabled={upLock}
                multiple={true}
              >
                {uploadButton}
              </Upload>
              <div className={styles.upImgDesc}>图片上传限制:最多5张，最大5M</div>
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button type="primary" onClick={this.submit} disabled={submitLock}>确定提交</Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to="/order/buyOrder?history">返回</Link>
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default BuyOrderAppeal;
