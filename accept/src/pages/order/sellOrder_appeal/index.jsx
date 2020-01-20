import { Button, Descriptions, Input, Select, Upload, Icon, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;
const statusType = {
  '金额不对': '金额不对',
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    let newImage = new Image();
    let quality = 0.6;    //压缩系数0-1之间，压缩到0.9以上会有bug，注意！（可以自行设置）
    newImage.src = reader.result;
    let imgWidth, imgHeight;
    console.log(newImage)
    newImage.onload = function () {
      imgWidth = this.width;
      imgHeight = this.height;
      //给生成图片设置一个默认的最大宽/高（可以自行设置）
      let myWidth = 300;
      //准备在画布上绘制图片
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //判断上传的图片的宽高是否超过设置的默认最大值，以及设置同比例的宽高
      if (Math.max(imgWidth, imgHeight) > myWidth) {
        if (imgWidth > imgHeight) {
          canvas.width = myWidth;
          canvas.height = myWidth * imgHeight / imgWidth;
        } else {
          canvas.height = myWidth;
          canvas.width = myWidth * imgWidth / imgHeight;
        }
      } else {
        canvas.width = imgWidth;
        canvas.height = imgHeight;
      }
      //清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //开始绘制图片到画布上
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
      let newBase64 = canvas.toDataURL("image/jpeg", quality);//压缩图片大小（重点代码）
      // 获取到当前的图片的大小，然后调整成自己需要的大小，例如说需要200KB-500KB之间（可以自行设置）
      while (newBase64.length / 1024 > 5000) {
        quality -= 0.02;
        newBase64 = canvas.toDataURL("image/jpeg", quality);
      }
      callback(newBase64)
    }
  });
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG文件!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('图片超过5MB!');
    return false;
  }
  return true;
}

@connect(({ sellOrderAppeal, loading }) => ({
  sellOrderAppeal,
  fetchLoading: loading.effects['sellOrderAppeal/fetch'],
}))
class Appeal extends Component {
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
    getBase64(file, imageUrl =>
      this.setState({
        fileList: [
          ...this.state.fileList,
          imageUrl,
        ],
        upLock: this.state.fileList.length < 4 ? false : true,
        loading: false,
      }),
    );
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
      type: 'sellOrderAppeal/submit',
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
              <div className={styles.upImgDesc}>图片上传限制:最多5张，最大5M</div>
            </Descriptions.Item>
            <Descriptions.Item className={styles.noneBeforeIcon}>
              <Button type="primary" loading={submitLock} onClick={this.submit}>确定提交</Button>
              <span style={{display: 'inline-block', width: '10px'}}></span>
              <Button>
                <Link to="/order/sellOrder?history">返回</Link>
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </ContLayout>
    );
  }
}

export default Appeal;
