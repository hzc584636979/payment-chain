import 'braft-editor/dist/index.css';
import { Button, Descriptions, Input, Upload, Icon, message, Row, Col } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { getBase64 } from '@/utils/utils';
import styles from './style.less';

const { TextArea } = Input;

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

@connect(({ systemNews, loading }) => ({
  systemNews,
  fetchLoading: loading.effects['systemNews/fetch'],
}))
class SystemNews extends Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
    outputHTML: null
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleTitle = e => {
    this.setState({
      title: e.target.value
    })
  }

  handleDesc = editorState => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    })
  }

  submit = () => {
    const { 
      title, 
      outputHTML,
    } = this.state;

    if(!title){
      message.error('请填写消息标题后提交');
      return;
    }else if(!outputHTML) {
      message.error('请填写消息内容后提交');
      return;
    }

    this.setState({
      submitLoading: true,
    })
    console.log(outputHTML.length)
    const { dispatch } = this.props;
    dispatch({
      type: 'systemNews/submit',
      payload: {
        title, 
        content: outputHTML,
      },
    }).then(data => {
      if(data.status != 1) {
        message.error(data.msg);
      }else {
        message.success('操作成功');
      }
      this.setState({
        submitLoading: false,
      })
    })
  }

  handleUploadImg = file => {
    if(!beforeUpload(file)) return false;
    getBase64(file, imageUrl => {
      if(!imageUrl) return;
      this.setState({
        editorState: ContentUtils.insertMedias(this.state.editorState, [{
          type: 'IMAGE',
          url: imageUrl
        }])
      })
    });
    return false;
  }

  getLen = () => {
    const { 
      outputHTML,
    } = this.state;
    const text = outputHTML || '';
    let len = 0;  
    for (var i = 0; i < text.length; i++) {  
      if (text.charCodeAt(i) > 127 || text.charCodeAt(i) == 94) {  
        len += 2;  
      } else {  
        len ++;  
      }  
    }  
    return len;  
  }

  render() {
    const { systemNews, fetchLoading } = this.props;
    const { submitLoading, loading, title, outputHTML, editorState } = this.state;
    const controls = [
      'undo',
      'redo',
      'separator',
      'font-size', 
      'line-height', 
      'letter-spacing', 
      'separator',
      'text-color', 
      'bold', 
      'italic',
      'underline',
      'strike-through', 
      'separator',
      'superscript', 
      'subscript', 
      'remove-styles', 
      /*'emoji',*/
      'separator',
      'text-indent',
      'text-align', 
      'separator',
      'headings', 
      'separator',
      'link', 
      'hr', 
      'separator',
      'clear', 
    ];

    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            showUploadList={false}
            beforeUpload={this.handleUploadImg}
            accept={'.jpg,.jpeg,.png'}
          >
            <Button className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </Button>
          </Upload>
        )
      }
    ];

    return (
      <ContLayout loading={fetchLoading}>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <Descriptions column={1}>
              <Descriptions.Item label={<span className={styles.itemLabel}>消息标题</span>}>
                <Input maxLength={50} onChange={this.handleTitle} style={{ width: 700, maxWidth: '100%' }} placeholder="输入消息标题" />
              </Descriptions.Item>
              <Descriptions.Item label={<span className={styles.itemLabel}>消息内容</span>} className={styles.textTop}>
                <div className="editor-wrapper" style={{border: '1px solid #ccc', borderRadius: 5}}>
                  <BraftEditor
                    value={editorState}
                    controls={controls}
                    extendControls={extendControls}
                    onChange={this.handleDesc}
                  />
                </div>
                {/* `正文长度: ${this.getLen()}` */}
              </Descriptions.Item>
              <Descriptions.Item className={styles.noneBeforeIcon}>
                <Button type="primary" loading={submitLoading} onClick={this.submit}>确定发布</Button>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        {/*<div>
          <p>{ title }</p>
          <div dangerouslySetInnerHTML={{__html: outputHTML || ''}}></div>
        </div>*/}
      </ContLayout>
    );
  }
}

export default SystemNews;
