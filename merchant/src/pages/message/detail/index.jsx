import { Button, Descriptions, Popconfirm, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import moment from 'moment';
import styles from './style.less';

@connect(({ messageDetail, loading }) => ({
  messageDetail,
  loading: loading.effects['messageDetail/fetch'],
}))
class MessageDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'messageDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { messageDetail, loading } = this.props;
                          
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <div className={styles.title}>{messageDetail.title}</div>
            <div className={styles.time}>{moment(messageDetail.time).local().format('YYYY-MM-DD HH:mm:ss')}</div>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: messageDetail.content || ''}}></div>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default MessageDetail;
